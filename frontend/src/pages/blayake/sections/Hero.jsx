import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/Cursor";
import { HERO_IMG } from "@/pages/blayake/data";

function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 mb-10 font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/70"
      data-testid="availability-badge"
    >
      <span className="relative inline-flex w-1.5 h-1.5">
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
        <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </span>
      Booking Q1 / 2026 — 2 slots
    </motion.div>
  );
}

function HeroTitle() {
  return (
    <h1 className="font-display font-black tracking-[-0.04em] leading-[0.92] text-[14vw] md:text-[10vw] lg:text-[8vw] text-balance">
      <span className="reveal-line"><span style={{ animationDelay: "0.05s" }}>Quiet machines.</span></span>
      <br />
      <span className="reveal-line">
        <span style={{ animationDelay: "0.18s" }} className="text-white/35">Loud results.</span>
      </span>
    </h1>
  );
}

function HeroCtas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.05, duration: 0.5 }}
      className="mt-10 flex flex-wrap gap-3 items-center"
    >
      <Magnetic strength={0.25}>
        <a
          href="#contact"
          data-testid="hero-cta-start"
          data-cursor="hover"
          className="group inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-white/90 transition"
        >
          Start a project
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </Magnetic>
      <Magnetic strength={0.18}>
        <a
          href="#work"
          data-testid="hero-cta-work"
          data-cursor="hover"
          className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-sm font-medium px-6 py-3.5 rounded-full transition-colors"
        >
          Selected work
        </a>
      </Magnetic>
    </motion.div>
  );
}

function HeroVisual({ y, scale }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-5 relative aspect-[3/4] rounded-3xl overflow-hidden hidden lg:block"
      data-testid="hero-visual"
      data-cursor="hover"
    >
      <motion.img
        src={HERO_IMG}
        alt="Blayake studio"
        loading="eager"
        style={{ y, scale }}
        className="absolute inset-[-10%] w-[120%] h-[120%] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
        <span className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/80">/ STUDIO_001</span>
        <span className="glass rounded-full px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/80">REC ●</span>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
        <div>
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/60 mb-1">Now shipping</div>
          <div className="font-display font-bold text-2xl tracking-tight">v3 · Autonomous Ops</div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-white/80" />
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-screen flex items-center px-6 md:px-12 pt-32 pb-20 max-w-7xl mx-auto"
    >
      <div className="absolute top-1/4 right-0 w-[640px] h-[640px] halo pointer-events-none -z-0" />
      <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <motion.div className="lg:col-span-7" style={{ y: titleY, opacity: titleOpacity }}>
          <HeroBadge />
          <HeroTitle />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-10 max-w-xl text-white/60 text-base md:text-lg leading-relaxed"
          >
            Blayake is a senior team of engineers and designers building bespoke AI systems —
            automations, chatbots, content engines and the websites that put them to work.
          </motion.p>
          <HeroCtas />
        </motion.div>
        <HeroVisual y={imgY} scale={imgScale} />
      </div>
    </section>
  );
}
