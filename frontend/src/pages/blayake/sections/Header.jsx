import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LogoLockup } from "@/components/Logo";
import { NAV } from "@/pages/blayake/data";

export default function Header() {
  return (
    <motion.header
      data-testid="site-header"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pill-nav rounded-full px-2 py-2 flex items-center gap-1"
    >
      <a
        href="#top"
        data-testid="brand-logo"
        data-cursor="hover"
        className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/[0.04] transition-colors"
      >
        <LogoLockup markSize={28} textSize={15} textColor="#fff" />
      </a>
      {NAV.map((n) => (
        <a
          key={n.href}
          href={n.href}
          data-cursor="hover"
          data-testid={`nav-${n.label.toLowerCase()}`}
          className="px-4 py-2 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          {n.label}
        </a>
      ))}
      <a
        href="#contact"
        data-testid="header-cta-book"
        data-cursor="hover"
        className="ml-1 inline-flex items-center gap-1.5 bg-white text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition"
      >
        Book a Call
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </motion.header>
  );
}
