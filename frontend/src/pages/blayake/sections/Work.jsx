import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { WORK } from "@/pages/blayake/data";

function WorkRow({ item, index, active, onActivate }) {
  const isActive = active === index;
  const dim = active !== null && !isActive;

  const handleEnter = useCallback(() => onActivate(index), [onActivate, index]);

  return (
    <motion.a
      href="#contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      animate={{ opacity: dim ? 0.3 : 1 }}
      transition={{
        duration: 0.55,
        delay: active === null ? index * 0.06 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      data-testid={`work-row-${index}`}
      data-cursor="view"
      data-cursor-label="View"
      className="group flex items-center justify-between gap-6 py-7 md:py-9 border-b border-white/[0.08] px-1"
    >
      <div className="flex items-center gap-6 md:gap-10 min-w-0">
        <span className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/40 hidden md:block w-12">
          0{index + 1}
        </span>
        <div className="min-w-0">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
            {item.client}
          </div>
          <motion.h3
            animate={{ x: isActive ? 14 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-2xl md:text-4xl tracking-tight leading-[1.05] truncate"
          >
            {item.title}
          </motion.h3>
        </div>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        <span className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/40 hidden sm:block">
          {item.year}
        </span>
        <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
    </motion.a>
  );
}

function WorkPreview({ active, x, y }) {
  const current = active !== null ? WORK[active] : null;
  return (
    <motion.div
      aria-hidden
      style={{ x, y, translateX: "32px", translateY: "32px" }}
      animate={{ opacity: active !== null ? 1 : 0, scale: active !== null ? 1 : 0.9 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute top-0 left-0 w-44 aspect-[4/3] rounded-xl overflow-hidden hidden lg:block z-20 shadow-[0_24px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
    >
      {WORK.map((w, i) => (
        <motion.img
          key={w.id}
          src={w.img}
          alt=""
          loading="lazy"
          animate={{ opacity: active === i ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono-tech text-[8px] uppercase tracking-[0.18em] text-white/95">
        <span className="truncate">{current ? current.year : ""}</span>
        <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
      </div>
    </motion.div>
  );
}

export default function Work() {
  const [active, setActive] = useState(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 26, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 200, damping: 26, mass: 0.5 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40]);

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
    <section
      id="work"
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-white/40 mb-5">
        / Selected work
      </div>
      <motion.h2
        style={{ y: titleY }}
        className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[0.95] max-w-3xl mb-16 text-balance"
      >
        Receipts, <span className="text-white/40">not promises.</span>
      </motion.h2>

      <div
        ref={containerRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative border-t border-white/[0.08]"
      >
        {WORK.map((w, i) => (
          <WorkRow key={w.id} item={w} index={i} active={active} onActivate={setActive} />
        ))}
        <WorkPreview active={active} x={sx} y={sy} />
      </div>
    </section>
  );
}
