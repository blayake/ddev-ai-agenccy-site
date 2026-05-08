import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ } from "@/pages/blayake/data";

function FaqItem({ item, index, isOpen, onToggle }) {
  const handleClick = useCallback(() => onToggle(index), [onToggle, index]);
  return (
    <div className="border-b border-white/[0.08]">
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
        data-testid={`faq-toggle-${index}`}
        data-cursor="hover"
        aria-expanded={isOpen}
      >
        <span className="font-display font-semibold text-lg md:text-xl tracking-tight group-hover:text-white transition-colors">
          {item.q}
        </span>
        <span className="shrink-0 w-9 h-9 border border-white/10 grid place-items-center rounded-full group-hover:border-white/40 transition-colors">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 text-white/60 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);
  const handleToggle = useCallback(
    (i) => setOpen((cur) => (cur === i ? -1 : i)),
    []
  );
  return (
    <section className="relative py-28 md:py-32 px-6 md:px-12 max-w-3xl mx-auto">
      <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-white/40 mb-5">
        / FAQ
      </div>
      <h2 className="font-display font-black text-4xl md:text-5xl tracking-tighter leading-[0.95] mb-12 text-balance">
        Things people ask <span className="text-white/40">before signing.</span>
      </h2>
      <div className="border-t border-white/[0.08]">
        {FAQ.map((f, i) => (
          <FaqItem key={f.id} item={f} index={i} isOpen={open === i} onToggle={handleToggle} />
        ))}
      </div>
    </section>
  );
}
