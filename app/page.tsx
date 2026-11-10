import { Cursor, Nav, Preloader } from "@/components/Chrome";
import { About, Archive, Contact, Hero, Path, Toolbox, Works } from "@/components/Sections";
import { Stage } from "@/components/Stage";

export default function Home() {
  return (
    <Stage>
      <Preloader />
      <Nav />
      <Cursor />
      <div className="grain" aria-hidden />
      <main>
        <Hero />
        <About />
        <Works />
        <Archive />
        <Toolbox />
        <Path />
      </main>
      <Contact />
    </Stage>
  );
}
