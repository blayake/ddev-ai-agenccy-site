import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/Cursor";
import { SERVICES } from "@/pages/blayake/data";

function ServiceRow({ service, index, active, onActivate }) {
  const Icon = service.icon;
  const isActive = active === index;
  const dim = active !== null && !isActive;

  const handleClick = useCallback(() => {
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleEnter = useCallback(() => onActivate(index), [onActivate, index]);

  return (
    <motion.button
      type="button"
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      onClick={handleClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: dim ? 0.25 : 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: active === null ? index * 0.06 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      data-testid={`service-row-${service.n}`}
      data-cursor="view"
      data-cursor-label="Discover"
      className="relative w-full text-left flex items-center justify-between gap-6 py-6 md:py-8 border-b border-white/[0.08]"
    >
      <span
        className={`font-mono-tech text-[11px] md:text-xs uppercase tracking-[0.22em] w-12 md:w-16 shrink-0 transition-colors ${
          isActive ? "text-white" : "text-white/35"
        }`}
      >
        {service.n}
      </span>
      <div className="flex-1 min-w-0">
        <motion.h3
          animate={{ x: isActive ? 12 : 0, letterSpacing: isActive ? "-0.04em" : "-0.045em" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black text-3xl md:text-5xl lg:text-6xl tracking-tighter leading-[1] truncate"
        >
          {service.title}
        </motion.h3>
        <AnimatePresence>
          {isActive && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 14 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/55 text-sm md:text-base max-w-xl leading-relaxed overflow-hidden"
            >
              {service.blurb}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <span className="hidden lg:inline-block font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/40 mr-4 whitespace-nowrap">
        {service.tag}
      </span>
      <span
        className={`shrink-0 w-12 h-12 rounded-full grid place-items-center transition-all duration-500 ${
          isActive
            ? "bg-white text-black scale-110"
            : "bg-white/[0.04] text-white/60 border border-white/10"
        }`}
      >
        <Icon className="w-4 h-4" strokeWidth={1.7} />
      </span>
    </motion.button>
  );
}

function PreviewCard({ active, x, y }) {
  const current = active !== null ? SERVICES[active] : null;
  return (
    <motion.div
      aria-hidden
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{ opacity: active !== null ? 1 : 0, scale: active !== null ? 1 : 0.92 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute top-0 left-0 w-72 md:w-96 aspect-[4/5] rounded-2xl overflow-hidden hidden md:block z-20"
    >
      {SERVICES.map((s, i) => (
        <motion.img
          key={s.n}
          src={s.img}
          alt=""
          loading="lazy"
          animate={{ opacity: active === i ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/90">
        <span>/ {current ? current.n : "00"}</span>
        <span className="inline-flex items-center gap-1">
          {current ? current.tag : ""}
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const [active, setActive] = useState(null);
  const containerRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 220, damping: 26, mass: 0.5 });

  const onMove = useCallback(
    (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    },
    [mx, my]
  );

  const onLeave = useCallback(() => setActive(null), []);

  return (
    <section id="services" className="relative py-28 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-12 md:mb-16">
        <div>
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-white/40 mb-5">
            / Services — 05
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[0.95] max-w-2xl text-balance">
            Five disciplines. <span className="text-white/40">Built for launch.</span>
          </h2>
        </div>
        <p className="max-w-sm text-white/60 leading-relaxed">
          Everything you need to launch, grow, and automate — from the website to the words to the
          videos that sell it.
        </p>
      </div>

      <div
        ref={containerRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative border-t border-white/[0.08]"
        data-testid="services-index"
      >
        {SERVICES.map((s, i) => (
          <ServiceRow key={s.n} service={s} index={i} active={active} onActivate={setActive} />
        ))}
        <PreviewCard active={active} x={sx} y={sy} />
      </div>

      <div className="mt-14 flex items-center justify-between gap-6 flex-wrap">
        <p className="font-mono-tech text-[11px] uppercase tracking-[0.22em] text-white/40">
          / Hover any row — drag-style cursor reveals the canvas.
        </p>
        <Magnetic strength={0.18}>
          <a
            href="#contact"
            data-cursor="hover"
            data-testid="services-cta"
            className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-sm font-medium px-5 py-3 rounded-full transition-colors"
          >
            Brief us on yours
            <ArrowRight className="w-4 h-4" />
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
