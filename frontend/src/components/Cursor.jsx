import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Custom cursor:
 *  - small white dot (mix-blend-difference) for precision
 *  - large ring with mass/spring for trailing
 *  - "magnetic" snap + scale on elements with [data-cursor="hover"]
 *  - "view" label expansion on [data-cursor="view"]
 */
export default function Cursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  // Springs for the ring (slower, gives a trailing feel)
  const ringSpringX = useSpring(ringX, { stiffness: 220, damping: 22, mass: 0.4 });
  const ringSpringY = useSpring(ringY, { stiffness: 220, damping: 22, mass: 0.4 });

  const [variant, setVariant] = useState("default"); // default | hover | view | hidden
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(true);

  // Disable on touch / coarse pointers
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const findCursorTarget = (el) => {
      let n = el;
      while (n && n !== document.body) {
        if (n.dataset && n.dataset.cursor) return n;
        if (n.tagName === "A" || n.tagName === "BUTTON" || n.getAttribute?.("role") === "button") {
          return n;
        }
        n = n.parentElement;
      }
      return null;
    };

    const onOver = (e) => {
      const t = findCursorTarget(e.target);
      if (!t) {
        setVariant("default");
        setLabel("");
        return;
      }
      const v = t.dataset?.cursor;
      const lbl = t.dataset?.cursorLabel;
      if (v === "view") {
        setVariant("view");
        setLabel(lbl || "View");
      } else if (v === "hide") {
        setVariant("hidden");
        setLabel("");
      } else {
        setVariant("hover");
        setLabel("");
      }
    };

    const onLeaveWindow = () => setVariant("hidden");
    const onEnterWindow = () => setVariant("default");

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
    };
  }, [enabled, dotX, dotY, ringX, ringY]);

  if (!enabled) return null;

  const ringScale =
    variant === "view" ? 3.4 : variant === "hover" ? 1.8 : variant === "hidden" ? 0 : 1;
  const dotScale = variant === "hover" || variant === "view" ? 0 : 1;

  return (
    <>
      {/* Ring (trailing, larger) */}
      <motion.div
        className="cursor-ring"
        style={{ x: ringSpringX, y: ringSpringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: ringScale, opacity: variant === "hidden" ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.4 }}
        data-testid="cursor-ring"
      >
        {variant === "view" && (
          <span className="absolute inset-0 grid place-items-center font-mono-tech text-[10px] uppercase tracking-[0.18em] text-white">
            {label}
          </span>
        )}
      </motion.div>

      {/* Dot (precise, instant) */}
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: dotScale, opacity: variant === "hidden" ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 24 }}
        data-testid="cursor-dot"
      />
    </>
  );
}

/** Magnetic wrapper — attracts a child element toward the cursor on hover. */
export function Magnetic({ children, strength = 0.3, className = "", ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.3 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * strength);
    y.set(my * strength);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
      {...props}
    >
      {children}
    </motion.span>
  );
}
