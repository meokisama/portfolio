/**
 * A small stable-fluids solver on WebGL2, rendered two ways:
 *  - "paper": dye is pigment. It absorbs light (Beer–Lambert), pools at its
 *    edges and picks up paper tooth, so strokes read as ink on washi.
 *  - "night": dye is light. It adds up on a dark ground.
 */

export type FluidMode = "paper" | "night";

export interface FluidOptions {
  mode: FluidMode;
  /** Ground colour, linear 0..1 sRGB triplet. Must match the page behind. */
  ground: [number, number, number];
  /** Called when the pointer picks up a new colour. */
  onColour?: (index: number) => void;
  reducedMotion?: boolean;
}

type RGB = [number, number, number];

/** 藍 indigo · 朱 vermilion · 山吹 yamabuki · 藤 wisteria · 若竹 bamboo · 桜 sakura */
const INKS: RGB[] = [
  [0.13, 0.25, 0.52],
  [0.88, 0.27, 0.13],
  [0.95, 0.68, 0.1],
  [0.52, 0.4, 0.76],
  [0.2, 0.6, 0.47],
  [0.93, 0.5, 0.62],
];

const LIGHTS: RGB[] = [
  [0.2, 0.42, 1.0],
  [1.0, 0.3, 0.14],
  [1.0, 0.72, 0.12],
  [0.62, 0.42, 1.0],
  [0.16, 0.85, 0.6],
  [1.0, 0.45, 0.66],
];

export const INK_COUNT = INKS.length;

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
uniform vec2 uTexel;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 o;
`;

const FRAG = {
  splat: `${HEAD}
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec3 uColor;
uniform vec2 uPoint;
uniform float uRadius;
void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  vec3 s = exp(-dot(p, p) / uRadius) * uColor;
  o = vec4(texture(uTarget, vUv).xyz + s, 1.0);
}`,
  advect: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uVelTexel;
uniform float uDt;
uniform float uDissipation;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uVelTexel;
  o = texture(uSource, coord) / (1.0 + uDissipation * uDt);
}`,
  divergence: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uStrength;
uniform float uDt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= uStrength * C;
  force.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + force * uDt;
  o = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float d = texture(uDivergence, vUv).x;
  o = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 v = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  o = vec4(v, 0.0, 1.0);
}`,
  scale: `${HEAD}
uniform sampler2D uTexture;
uniform float uValue;
void main() { o = uValue * texture(uTexture, vUv); }`,
  display: `${HEAD}
uniform sampler2D uDye;
uniform vec3 uGround;
uniform float uNight;
uniform float uFade;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return s;
}
float lum(vec3 c) { return dot(c, vec3(0.3333)); }

void main() {
  vec3 d = max(texture(uDye, vUv).rgb, 0.0);
  vec3 col;
  if (uNight > 0.5) {
    float mask = smoothstep(1.0, 1.0 - uFade, vUv.y) * (0.3 + 0.7 * smoothstep(0.04, 0.42, vUv.y));
    vec3 light = (1.0 - exp(-d * 0.85)) * 0.78;
    float g = hash(gl_FragCoord.xy) - 0.5;
    col = uGround + light * mask * (1.0 - uGround) + g * 0.018;
  } else {
    // pigment gathers where the wash stops
    float e = length(vec2(lum(texture(uDye, vR).rgb) - lum(texture(uDye, vL).rgb),
                          lum(texture(uDye, vT).rgb) - lum(texture(uDye, vB).rgb)));
    float pool = smoothstep(0.004, 0.09, e);
    // paper tooth: fibres hold more pigment than the valleys between them
    float tooth = fbm(gl_FragCoord.xy * 0.02) * 0.65 + noise(gl_FragCoord.xy * 0.7) * 0.35;
    d *= 0.72 + 0.6 * tooth;
    d *= 1.0 + pool * 0.75;
    d = d / (1.0 + 0.6 * d);
    float mask = smoothstep(0.0, uFade, vUv.y) * smoothstep(1.0, 0.84, vUv.y);
    col = uGround * exp(-d * mask);
  }
  o = vec4(col, 1.0);
}`,
};

interface Program {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}
interface Target {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
}
interface DoubleTarget {
  read: Target;
  write: Target;
  swap(): void;
}

interface Stroke {
  x: number;
  y: number;
  angle: number;
  speed: number;
  turn: number;
  life: number;
  colour: number;
  weight: number;
}

export class Fluid {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private opts: FluidOptions;
  private programs!: Record<keyof typeof FRAG, Program>;
  private velocity!: DoubleTarget;
  private dye!: DoubleTarget;
  private pressure!: DoubleTarget;
  private divergence!: Target;
  private curl!: Target;
  private raf = 0;
  private last = 0;
  private running = false;
  private strokes: Stroke[] = [];
  private nextStroke = 0;
  private idleFor = 10;
  private pointer = { x: 0, y: 0, has: false, travelled: 0, colour: 0 };
  private small: boolean;
  ok = true;

  constructor(canvas: HTMLCanvasElement, opts: FluidOptions) {
    this.canvas = canvas;
    this.opts = opts;
    this.small = Math.min(window.innerWidth, window.innerHeight) < 700;
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) {
      this.ok = false;
      this.gl = gl as WebGL2RenderingContext;
      return;
    }
    this.gl = gl;
    gl.disable(gl.BLEND);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = this.compile(gl.VERTEX_SHADER, VERT);
    this.programs = {} as Record<keyof typeof FRAG, Program>;
    for (const key of Object.keys(FRAG) as (keyof typeof FRAG)[]) {
      this.programs[key] = this.link(vs, this.compile(gl.FRAGMENT_SHADER, FRAG[key]));
    }
    this.resize();
    this.pointer.colour = Math.floor(Math.random() * INK_COUNT);
  }

  /* ---------- gl plumbing ---------- */

  private compile(type: number, src: string) {
    const gl = this.gl;
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      this.ok = false;
    }
    return s;
  }

  private link(vs: WebGLShader, fs: WebGLShader): Program {
    const gl = this.gl;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "aPos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      this.ok = false;
    }
    const uniforms: Program["uniforms"] = {};
    const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(program, i)!.name;
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    return { program, uniforms };
  }

  private target(w: number, h: number, internal: number, format: number, filter: number): Target {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h };
  }

  private double(w: number, h: number, internal: number, format: number, filter: number): DoubleTarget {
    let a = this.target(w, h, internal, format, filter);
    let b = this.target(w, h, internal, format, filter);
    return {
      get read() {
        return a;
      },
      get write() {
        return b;
      },
      swap() {
        [a, b] = [b, a];
      },
    };
  }

  private free(t?: Target) {
    if (!t) return;
    this.gl.deleteTexture(t.tex);
    this.gl.deleteFramebuffer(t.fbo);
  }

  private use(name: keyof typeof FRAG, texelW: number, texelH: number) {
    const p = this.programs[name];
    this.gl.useProgram(p.program);
    this.gl.uniform2f(p.uniforms.uTexel, 1 / texelW, 1 / texelH);
    return p.uniforms;
  }

  private bind(unit: number, t: Target) {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, t.tex);
    return unit;
  }

  private blit(t: Target | null) {
    const gl = this.gl;
    if (t) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.viewport(0, 0, t.w, t.h);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /* ---------- sizing ---------- */

  resize() {
    if (!this.ok) return;
    const gl = this.gl;
    const dpr = Math.min(window.devicePixelRatio || 1, this.small ? 1.25 : 1.5);
    const w = Math.max(2, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(2, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width === w && this.canvas.height === h && this.dye) return;
    this.canvas.width = w;
    this.canvas.height = h;

    const aspect = w / h;
    const size = (base: number) =>
      aspect > 1
        ? { w: Math.round(base * aspect), h: base }
        : { w: base, h: Math.round(base / aspect) };
    const sim = size(this.small ? 96 : 144);
    const dye = size(this.small ? 512 : 900);

    for (const t of [this.velocity, this.dye, this.pressure]) {
      this.free(t?.read);
      this.free(t?.write);
    }
    this.free(this.divergence);
    this.free(this.curl);

    this.velocity = this.double(sim.w, sim.h, gl.RG16F, gl.RG, gl.LINEAR);
    this.dye = this.double(dye.w, dye.h, gl.RGBA16F, gl.RGBA, gl.LINEAR);
    this.pressure = this.double(sim.w, sim.h, gl.R16F, gl.RED, gl.NEAREST);
    this.divergence = this.target(sim.w, sim.h, gl.R16F, gl.RED, gl.NEAREST);
    this.curl = this.target(sim.w, sim.h, gl.R16F, gl.RED, gl.NEAREST);
  }

  /* ---------- painting ---------- */

  private colour(index: number, amount: number): RGB {
    if (this.opts.mode === "night") {
      const c = LIGHTS[index % LIGHTS.length];
      return [c[0] * amount, c[1] * amount, c[2] * amount];
    }
    // absorbance: a full-strength wash transmits exactly the ink colour
    const c = INKS[index % INKS.length];
    return [-Math.log(c[0]) * amount, -Math.log(c[1]) * amount, -Math.log(c[2]) * amount];
  }

  /** x, y in 0..1 from the bottom-left. dx, dy in uv per frame. */
  splat(x: number, y: number, dx: number, dy: number, colour: RGB, radius: number, force = 5200) {
    if (!this.ok) return;
    const gl = this.gl;
    const aspect = this.canvas.width / this.canvas.height;
    let u = this.use("splat", this.velocity.read.w, this.velocity.read.h);
    gl.uniform1i(u.uTarget, this.bind(0, this.velocity.read));
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform2f(u.uPoint, x, y);
    gl.uniform3f(u.uColor, dx * force, dy * force, 0);
    gl.uniform1f(u.uRadius, radius * (aspect > 1 ? aspect : 1));
    this.blit(this.velocity.write);
    this.velocity.swap();

    u = this.use("splat", this.dye.read.w, this.dye.read.h);
    gl.uniform1i(u.uTarget, this.bind(0, this.dye.read));
    gl.uniform1f(u.uAspect, aspect);
    gl.uniform2f(u.uPoint, x, y);
    gl.uniform3f(u.uColor, colour[0], colour[1], colour[2]);
    gl.uniform1f(u.uRadius, radius * (aspect > 1 ? aspect : 1));
    this.blit(this.dye.write);
    this.dye.swap();
  }

  /** A drop of ink that opens outward. */
  blot(x: number, y: number, colourIndex = this.pointer.colour) {
    const c = this.colour(colourIndex, this.opts.mode === "night" ? 0.3 : 0.16);
    const n = 7;
    const spin = Math.random() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = spin + (i / n) * Math.PI * 2;
      this.splat(x, y, Math.cos(a) * 0.012, Math.sin(a) * 0.012, c, 0.0016);
    }
    this.idleFor = 0;
  }

  pointerMove(x: number, y: number) {
    const p = this.pointer;
    if (!p.has) {
      p.x = x;
      p.y = y;
      p.has = true;
      return;
    }
    const dx = x - p.x;
    const dy = y - p.y;
    p.x = x;
    p.y = y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.0006 || dist > 0.4) return;
    p.travelled += dist;
    if (p.travelled > 0.55) {
      p.travelled = 0;
      p.colour = (p.colour + 1 + Math.floor(Math.random() * 2)) % INK_COUNT;
      this.opts.onColour?.(p.colour);
    }
    const night = this.opts.mode === "night";
    const amount = Math.min(0.05 + dist * 6, night ? 0.4 : 0.2);
    this.splat(x, y, dx, dy, this.colour(p.colour, amount), night ? 0.0011 : 0.0009);
    this.idleFor = 0;
  }

  pointerLeave() {
    this.pointer.has = false;
  }

  private spawnStroke(first = false) {
    const edge = Math.random();
    const s: Stroke = {
      x: edge < 0.5 ? (Math.random() < 0.5 ? -0.02 : 1.02) : 0.15 + Math.random() * 0.7,
      y: edge < 0.5 ? 0.25 + Math.random() * 0.6 : Math.random() < 0.5 ? 0.12 : 1.02,
      angle: 0,
      speed: 0.32 + Math.random() * 0.3,
      turn: (Math.random() - 0.5) * 3.2,
      life: 0.9 + Math.random() * 0.9,
      colour: Math.floor(Math.random() * INK_COUNT),
      weight: first ? 1.25 : 0.8 + Math.random() * 0.5,
    };
    // aim roughly at the middle of the sheet
    s.angle = Math.atan2(0.55 - s.y + (Math.random() - 0.5) * 0.5, 0.5 - s.x + (Math.random() - 0.5) * 0.6);
    this.strokes.push(s);
  }

  private paintStrokes(dt: number) {
    const night = this.opts.mode === "night";
    this.idleFor += dt;
    this.nextStroke -= dt;
    if (!this.opts.reducedMotion && this.nextStroke <= 0 && this.idleFor > 1.6 && this.strokes.length < 2) {
      this.spawnStroke();
      this.nextStroke = 2.2 + Math.random() * 2.6;
    }
    for (const s of this.strokes) {
      s.angle += s.turn * dt;
      s.turn += (Math.random() - 0.5) * 6 * dt;
      const vx = Math.cos(s.angle) * s.speed * dt;
      const vy = Math.sin(s.angle) * s.speed * dt;
      s.x += vx;
      s.y += vy;
      s.life -= dt;
      const taper = Math.min(1, s.life * 2.5);
      const amount = (night ? 0.16 : 0.075) * s.weight * taper * Math.min(dt * 60, 2);
      this.splat(s.x, s.y, vx, vy, this.colour(s.colour, amount), (night ? 0.0012 : 0.0009) * s.weight);
    }
    this.strokes = this.strokes.filter((s) => s.life > 0 && s.x > -0.1 && s.x < 1.1 && s.y > -0.1 && s.y < 1.1);
  }

  /** The opening gesture: a few confident strokes across the sheet. */
  flourish() {
    for (let i = 0; i < 3; i++) this.spawnStroke(true);
    this.nextStroke = 2.5;
  }

  /* ---------- simulation ---------- */

  private step(dt: number) {
    const gl = this.gl;
    const v = this.velocity;
    const sw = v.read.w;
    const sh = v.read.h;
    const night = this.opts.mode === "night";

    let u = this.use("curl", sw, sh);
    gl.uniform1i(u.uVelocity, this.bind(0, v.read));
    this.blit(this.curl);

    u = this.use("vorticity", sw, sh);
    gl.uniform1i(u.uVelocity, this.bind(0, v.read));
    gl.uniform1i(u.uCurl, this.bind(1, this.curl));
    gl.uniform1f(u.uStrength, night ? 16 : 9);
    gl.uniform1f(u.uDt, dt);
    this.blit(v.write);
    v.swap();

    u = this.use("divergence", sw, sh);
    gl.uniform1i(u.uVelocity, this.bind(0, v.read));
    this.blit(this.divergence);

    u = this.use("scale", sw, sh);
    gl.uniform1i(u.uTexture, this.bind(0, this.pressure.read));
    gl.uniform1f(u.uValue, 0.8);
    this.blit(this.pressure.write);
    this.pressure.swap();

    u = this.use("pressure", sw, sh);
    gl.uniform1i(u.uDivergence, this.bind(0, this.divergence));
    const iterations = this.small ? 12 : 18;
    for (let i = 0; i < iterations; i++) {
      gl.uniform1i(u.uPressure, this.bind(1, this.pressure.read));
      this.blit(this.pressure.write);
      this.pressure.swap();
    }

    u = this.use("gradient", sw, sh);
    gl.uniform1i(u.uPressure, this.bind(0, this.pressure.read));
    gl.uniform1i(u.uVelocity, this.bind(1, v.read));
    this.blit(v.write);
    v.swap();

    u = this.use("advect", sw, sh);
    gl.uniform2f(u.uVelTexel, 1 / sw, 1 / sh);
    gl.uniform1i(u.uVelocity, this.bind(0, v.read));
    gl.uniform1i(u.uSource, this.bind(0, v.read));
    gl.uniform1f(u.uDt, dt);
    gl.uniform1f(u.uDissipation, night ? 0.5 : 0.85);
    this.blit(v.write);
    v.swap();

    u = this.use("advect", this.dye.read.w, this.dye.read.h);
    gl.uniform2f(u.uVelTexel, 1 / sw, 1 / sh);
    gl.uniform1i(u.uVelocity, this.bind(0, v.read));
    gl.uniform1i(u.uSource, this.bind(1, this.dye.read));
    gl.uniform1f(u.uDt, dt);
    gl.uniform1f(u.uDissipation, night ? 0.42 : 0.3);
    this.blit(this.dye.write);
    this.dye.swap();
  }

  private render() {
    const gl = this.gl;
    const u = this.use("display", this.dye.read.w, this.dye.read.h);
    gl.uniform1i(u.uDye, this.bind(0, this.dye.read));
    gl.uniform3f(u.uGround, ...this.opts.ground);
    gl.uniform1f(u.uNight, this.opts.mode === "night" ? 1 : 0);
    gl.uniform1f(u.uFade, this.opts.mode === "night" ? 0.3 : 0.2);
    this.blit(null);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 1 / 30) || 1 / 60;
    this.last = now;
    this.resize();
    this.paintStrokes(dt);
    this.step(dt);
    this.render();
    this.raf = requestAnimationFrame(this.frame);
  };

  start() {
    if (!this.ok || this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    if (!this.ok) return;
    // Free what we allocated but keep the context: the canvas may be mounted again.
    for (const t of [this.velocity, this.dye, this.pressure]) {
      this.free(t?.read);
      this.free(t?.write);
    }
    this.free(this.divergence);
    this.free(this.curl);
    for (const p of Object.values(this.programs)) this.gl.deleteProgram(p.program);
  }
}
