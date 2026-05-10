import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/Cursor";
import { REEL_IMG } from "@/pages/blayake/data";

export default function StudioReel() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  // Faster horizontal swipe — completes during the middle 45% of the section scroll
  const titleX = useTransform(scrollYProgress, [0.25, 0.7], ["18%", "-32%"]);
  const overlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.45, 0.7]);

  return (
    <section
      ref={ref}
      className="relative h-[80vh] md:h-screen w-full overflow-hidden my-12 md:my-20"
      data-testid="studio-reel"
    >
      <motion.img
        src={REEL_IMG}
        alt=""
        loading="lazy"
        style={{ y: bgY }}
        className="absolute inset-[-10%] w-[120%] h-[120%] object-cover grayscale"
      />
      <motion.div style={{ opacity: overlay }} className="absolute inset-0 bg-black" />

      <div className="absolute inset-0 grid place-items-center px-6 overflow-hidden">
        <motion.div
          style={{ x: titleX }}
          className="font-display font-black text-[18vw] leading-[0.85] tracking-[-0.05em] whitespace-nowrap text-white/90 select-none"
        >
          BUILT IN PUBLIC.
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end gap-6">
        <div className="max-w-md text-white/70 leading-relaxed text-sm md:text-base">
          A small studio that publishes its work, its process, and the receipts.
        </div>
        <Magnetic strength={0.2}>
          <a
            href="#work"
            data-cursor="hover"
            data-testid="reel-cta"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-5 py-3 rounded-full"
          >
            See work
            <ArrowRight className="w-4 h-4" />
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
