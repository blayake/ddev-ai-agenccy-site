import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import axios from "axios";
import Cursor from "@/components/Cursor";
import { API } from "@/pages/blayake/data";
import Header from "@/pages/blayake/sections/Header";
import Hero from "@/pages/blayake/sections/Hero";
import Marquee from "@/pages/blayake/sections/Marquee";
import StudioReel from "@/pages/blayake/sections/StudioReel";
import Services from "@/pages/blayake/sections/Services";
import Work from "@/pages/blayake/sections/Work";
import Faq from "@/pages/blayake/sections/Faq";
import Contact from "@/pages/blayake/sections/Contact";
import Footer from "@/pages/blayake/sections/Footer";

function useLenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

function useApiWarmup() {
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);
}

export default function Blayake() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  useLenisScroll();
  useApiWarmup();

  return (
    <div className="relative min-h-screen bg-[#050505] text-white dot-grid grain">
      <Cursor />
      <div className="fixed top-1/4 -right-40 w-[640px] h-[640px] halo pointer-events-none -z-0" />
      <div className="fixed bottom-1/3 -left-40 w-[520px] h-[520px] halo pointer-events-none -z-0 opacity-70" />

      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-white origin-left z-[60]"
        data-testid="scroll-progress"
      />

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <StudioReel />
          <Work />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
