/**
 * "Hear colour": each ink has a note. A tiny plucked voice on Web Audio,
 * tuned to the miyako-bushi scale so any sequence of colours sounds like koto.
 */

const NOTES = [293.66, 311.13, 392.0, 440.0, 466.16, 587.33]; // D4 E♭4 G4 A4 B♭4 D5

type Listener = () => void;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
const listeners = new Set<Listener>();

function ensure() {
  if (ctx) return;
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = 0.5;

  // a short echo, so notes hang in the room for a moment
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.31;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const damp = ctx.createBiquadFilter();
  damp.type = "lowpass";
  damp.frequency.value = 1800;
  master.connect(ctx.destination);
  master.connect(delay);
  delay.connect(damp);
  damp.connect(feedback);
  feedback.connect(delay);
  damp.connect(ctx.destination);
}

export const sound = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  get enabled() {
    return enabled;
  },
  toggle() {
    enabled = !enabled;
    if (enabled) {
      ensure();
      void ctx!.resume();
      [0, 2, 3, 5].forEach((n, i) => setTimeout(() => sound.pluck(n, 0.7), i * 110));
    }
    listeners.forEach((fn) => fn());
  },
  pluck(index: number, velocity = 1) {
    if (!enabled || !ctx || !master) return;
    const t = ctx.currentTime;
    const freq = NOTES[((index % NOTES.length) + NOTES.length) % NOTES.length];
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.22 * velocity, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

    const body = ctx.createOscillator();
    body.type = "triangle";
    body.frequency.value = freq;
    const shimmer = ctx.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.value = freq * 2.003;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.35, t);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    body.connect(gain);
    shimmer.connect(shimmerGain).connect(gain);
    gain.connect(master);
    body.start(t);
    shimmer.start(t);
    body.stop(t + 1.7);
    shimmer.stop(t + 1.7);
  },
};
