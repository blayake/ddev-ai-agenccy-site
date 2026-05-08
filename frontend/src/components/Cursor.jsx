import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_RING = { stiffness: 220, damping: 22, mass: 0.4 };
const SPRING_DOT = { stiffness: 500, damping: 24 };
const SCALE_BY_VARIANT = { default: 1, hover: 1.8, view: 3.4, hidden: 0 };
const DOT_SCALE_BY_VARIANT = { default: 1, hover: 0, view: 0, hidden: 0 };

function findCursorTarget(el) {
  let node = el;
  while (node && node !== document.body) {
    if (node.dataset && node.dataset.cursor) return node;
    if (
      node.tagName === "A" ||
      node.tagName === "BUTTON" ||
      node.getAttribute?.("role") === "button"
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function useFinePointer() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return enabled;
}

function useCursorTracking(enabled, dotX, dotY, ringX, ringY, setVariant, setLabel) {
  useEffect(() => {
    if (!enabled) return undefined;

    const move = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
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
  }, [enabled, dotX, dotY, ringX, ringY, setVariant, setLabel]);
}

export default function Cursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  const ringSpringX = useSpring(ringX, SPRING_RING);
  const ringSpringY = useSpring(ringY, SPRING_RING);

  const [variant, setVariant] = useState("default");
  const [label, setLabel] = useState("");
  const enabled = useFinePointer();

  useCursorTracking(enabled, dotX, dotY, ringX, ringY, setVariant, setLabel);

  if (!enabled) return null;

  const ringScale = SCALE_BY_VARIANT[variant] ?? 1;
  const dotScale = DOT_SCALE_BY_VARIANT[variant] ?? 1;
  const isHidden = variant === "hidden";

  return (
    <>
      <motion.div
        className="cursor-ring"
        style={{ x: ringSpringX, y: ringSpringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: ringScale, opacity: isHidden ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.4 }}
        data-testid="cursor-ring"
      >
        {variant === "view" && (
          <span className="absolute inset-0 grid place-items-center font-mono-tech text-[10px] uppercase tracking-[0.18em] text-white">
            {label}
          </span>
        )}
      </motion.div>
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: dotScale, opacity: isHidden ? 0 : 1 }}
        transition={SPRING_DOT}
        data-testid="cursor-dot"
      />
    </>
  );
}

export function Magnetic({ children, strength = 0.3, className = "", ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.3 });

  const handleMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
      y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [x, y, strength]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

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
