import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import axios from "axios";
import { ArrowUpRight, Plus, Minus, ArrowRight, Sparkles, Bot, Workflow, Globe2 } from "lucide-react";
import Cursor, { Magnetic } from "@/components/Cursor";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/* ---------------- Data ---------------- */
const NAV = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    n: "01",
    title: "AI Automation",
    icon: Workflow,
    blurb: "Bespoke automations that connect your stack and reclaim hundreds of hours every quarter.",
    img: "https://images.unsplash.com/photo-1773236376238-bde8e75c7506?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    n: "02",
    title: "Custom Chatbots",
    icon: Bot,
    blurb: "AI assistants trained on your business — deployed to your site, WhatsApp, and support stack.",
    img: "https://images.unsplash.com/photo-1680992046626-418f7e910589?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    n: "03",
    title: "Content Engines",
    icon: Sparkles,
    blurb: "Production engines for short-form, long-form and branded social — running 24/7.",
    img: "https://images.unsplash.com/photo-1765046255479-669cf07a0230?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    n: "04",
    title: "Websites",
    icon: Globe2,
    blurb: "Conversion-focused, motion-rich websites engineered to turn visitors into pipeline.",
    img: "https://images.unsplash.com/photo-1689028294160-e78a88abcb19?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
];

const WORK = [
  { client: "OAKBRIDGE / FINTECH", title: "Underwriting cycle, –71%", year: "2026" },
  { client: "NORTHWIND / SAAS", title: "AI support deflected 62% of tickets", year: "2025" },
  { client: "STUDIO MERIDIAN / DTC", title: "Doubled organic content, halved cost", year: "2025" },
];

const FAQ = [
  { q: "How fast can you ship?", a: "Most projects ship a first production system in 4–6 weeks. Then we move to retainer or staff-aug." },
  { q: "Which models do you use?", a: "Stack-agnostic — OpenAI, Anthropic, Gemini, open-source Llama variants, plus the orchestration that fits your data." },
  { q: "What does pricing look like?", a: "Fixed-price builds typically range $12k–$60k. Retainers start at $6k/mo. Clear scope before any commitment." },
];

/* ---------------- UI ---------------- */
function Header() {
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
        className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full hover:bg-white/[0.04] transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-white grid place-items-center">
          <span className="text-black font-display font-black text-[10px] leading-none">B</span>
        </div>
        <span className="font-display font-bold text-sm tracking-tight">Blayake</span>
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

function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center px-6 md:px-12 pt-32 pb-20 max-w-7xl mx-auto">
      <div className="absolute top-1/4 right-0 w-[640px] h-[640px] halo pointer-events-none -z-0" />

      <div className="relative w-full">
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

        <h1 className="font-display font-black tracking-[-0.04em] leading-[0.92] text-[14vw] md:text-[10vw] lg:text-[8.4vw] text-balance">
          <span className="reveal-line"><span style={{ animationDelay: "0.05s" }}>Quiet machines.</span></span>
          <br />
          <span className="reveal-line">
            <span style={{ animationDelay: "0.18s" }} className="text-white/35">Loud results.</span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 max-w-xl text-white/60 text-base md:text-lg leading-relaxed"
        >
          Blayake is a senior team of engineers and designers building bespoke AI systems —
          automations, chatbots, content engines and the websites that put them to work.
        </motion.p>

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
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["AI AUTOMATION", "CUSTOM LLMS", "RAG", "WORKFLOW", "CONTENT", "EVALS", "DEPLOY"];
  const stream = [...items, ...items, ...items];
  return (
    <div className="border-y border-white/[0.06] py-7 overflow-hidden">
      <div className="marquee-track gap-14 px-8 items-center">
        {stream.map((it, i) => (
          <span
            key={i}
            className="font-display font-black text-3xl md:text-5xl tracking-tighter text-white/10 whitespace-nowrap inline-flex items-center gap-14"
          >
            {it}
            <span className="text-white/20 text-2xl">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="relative py-28 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-8 flex-wrap mb-16">
        <div>
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-white/40 mb-5">
            / Services
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[0.95] max-w-2xl text-balance">
            Four disciplines. <span className="text-white/40">One operating system.</span>
          </h2>
        </div>
        <p className="max-w-sm text-white/60 leading-relaxed">
          We design, build, and operate the AI infrastructure that quietly does the work behind your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.article
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative glass rounded-3xl p-3 overflow-hidden"
              data-testid={`service-card-${s.n}`}
              data-cursor="hover"
            >
              <div className="card-img-frame relative aspect-[16/10] rounded-2xl overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/60">
                  <span>/ {s.n}</span>
                </div>
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md grid place-items-center group-hover:bg-white group-hover:text-black transition-colors">
                  <Icon className="w-4 h-4" strokeWidth={1.6} />
                </div>
              </div>
              <div className="p-5 pt-6">
                <h3 className="font-display font-bold text-2xl tracking-tight mb-2.5">{s.title}</h3>
                <p className="text-white/55 leading-relaxed text-[15px]">{s.blurb}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="relative py-28 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-white/40 mb-5">
        / Selected work
      </div>
      <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[0.95] max-w-3xl mb-16 text-balance">
        Receipts, <span className="text-white/40">not promises.</span>
      </h2>
      <div className="border-t border-white/[0.08]">
        {WORK.map((w, i) => (
          <motion.a
            key={w.title}
            href="#contact"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            data-testid={`work-row-${i}`}
            data-cursor="view"
            data-cursor-label="View"
            className="group flex items-center justify-between gap-6 py-7 md:py-9 border-b border-white/[0.08] hover:bg-white/[0.02] transition-colors px-1"
          >
            <div className="flex items-center gap-6 md:gap-10 min-w-0">
              <span className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/40 hidden md:block w-12">
                0{i + 1}
              </span>
              <div className="min-w-0">
                <div className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
                  {w.client}
                </div>
                <h3 className="font-display font-bold text-2xl md:text-4xl tracking-tight leading-[1.05] truncate group-hover:translate-x-2 transition-transform duration-500">
                  {w.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <span className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/40 hidden sm:block">
                {w.year}
              </span>
              <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative py-28 md:py-32 px-6 md:px-12 max-w-3xl mx-auto">
      <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-white/40 mb-5">
        / FAQ
      </div>
      <h2 className="font-display font-black text-4xl md:text-5xl tracking-tighter leading-[0.95] mb-12 text-balance">
        Things people ask <span className="text-white/40">before signing.</span>
      </h2>
      <div className="border-t border-white/[0.08]">
        {FAQ.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="border-b border-white/[0.08]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                data-testid={`faq-toggle-${i}`}
                data-cursor="hover"
                aria-expanded={isOpen}
              >
                <span className="font-display font-semibold text-lg md:text-xl tracking-tight group-hover:text-white transition-colors">
                  {f.q}
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
                    <p className="pb-6 pr-12 text-white/60 leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    try {
      await axios.post(`${API}/leads`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: form.message.trim() || null,
      });
      setStatus({ state: "success", msg: "Got it. We'll be in touch within 24 hours." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went wrong. Please try again.";
      setStatus({ state: "error", msg: typeof msg === "string" ? msg : "Validation error." });
    }
  };

  const fieldCls =
    "w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/40 outline-none rounded-2xl px-5 py-4 text-white placeholder:text-white/30 transition-colors";

  return (
    <section id="contact" className="relative py-28 md:py-40 px-6 md:px-12 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-white/40 mb-5">
          / Let's build
        </div>
        <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-[0.92] text-balance">
          Let's build the <br /> <span className="text-white/40 italic font-medium">future.</span>
        </h2>
        <p className="mt-6 text-white/60 max-w-md mx-auto leading-relaxed">
          Drop your details below and we'll get back to you within 24 hours.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono-tech text-[11px] uppercase tracking-[0.22em]">
          <a
            href="mailto:teamblayake.agency@gmail.com"
            data-cursor="hover"
            data-testid="contact-email"
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-white/80 hover:text-white hover:border-white/25 transition"
          >
            teamblayake.agency@gmail.com
          </a>
          <a
            href="https://x.com/blayake"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            data-testid="contact-x"
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-white/80 hover:text-white hover:border-white/25 transition"
          >
            @blayake on X
          </a>
        </div>
      </div>

      <form onSubmit={submit} className="mt-14 glass rounded-3xl p-6 md:p-8 space-y-4" data-testid="contact-form">
        <div>
          <label className="block font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">Full Name</label>
          <input required value={form.name} onChange={update("name")} className={fieldCls} placeholder="e.g. Julian Anderson" data-testid="form-name" data-cursor="hover" />
        </div>
        <div>
          <label className="block font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">Email Address</label>
          <input required type="email" value={form.email} onChange={update("email")} className={fieldCls} placeholder="julian@visionary.ai" data-testid="form-email" data-cursor="hover" />
        </div>
        <div>
          <label className="block font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">Phone Number</label>
          <input type="tel" value={form.phone} onChange={update("phone")} className={fieldCls} placeholder="+1 (415) 867-5309" data-testid="form-phone" data-cursor="hover" />
        </div>
        <div>
          <label className="block font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">What are you trying to build?</label>
          <textarea rows={3} value={form.message} onChange={update("message")} className={`${fieldCls} resize-none`} placeholder="A quick line about your idea, stack, or stuck-point." data-testid="form-message" data-cursor="hover" />
        </div>
        <Magnetic strength={0.12} className="block w-full">
          <button
            type="submit"
            disabled={status.state === "loading"}
            data-testid="form-submit"
            data-cursor="hover"
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-semibold px-6 py-4 rounded-full hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            {status.state === "loading" ? "Sending…" : "Submit Request"}
            {status.state !== "loading" && <ArrowRight className="w-4 h-4" />}
          </button>
        </Magnetic>
        <div className="text-center font-mono-tech text-[10px] uppercase tracking-[0.22em] min-h-[1rem]" data-testid="form-status">
          {status.state === "success" && <span className="text-emerald-400">{status.msg}</span>}
          {status.state === "error" && <span className="text-red-400">{status.msg}</span>}
        </div>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative pt-16 pb-6 px-6 md:px-12 border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-0 md:items-end justify-between pb-12">
        <div>
          <div className="font-display font-bold text-xl">Blayake</div>
          <p className="mt-3 text-white/50 text-sm max-w-xs leading-relaxed">
            A senior team building bespoke AI systems for operators who refuse to be ignored.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 font-mono-tech text-[11px] uppercase tracking-[0.22em] text-white/50">
          <a href="https://x.com/blayake" target="_blank" rel="noopener noreferrer" className="link-underline" data-cursor="hover" data-testid="footer-x">@blayake on X</a>
          <a href="#" className="link-underline" data-cursor="hover" data-testid="footer-linkedin">LinkedIn</a>
          <a href="#" className="link-underline" data-cursor="hover" data-testid="footer-instagram">Instagram</a>
          <a href="mailto:teamblayake.agency@gmail.com" className="link-underline" data-cursor="hover" data-testid="footer-email">teamblayake.agency@gmail.com</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 pt-6 border-t border-white/[0.06]">
        <div className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/40">
          © 2026 Blayake Agency
        </div>
        <div className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/40">
          All systems go
        </div>
      </div>
      <div aria-hidden className="select-none mt-6 -mb-[3vw]">
        <div className="font-display font-black text-[22vw] leading-[0.85] tracking-[-0.06em] text-white/[0.04] whitespace-nowrap text-center">
          BLAYAKE
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Page ---------------- */
export default function Blayake() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  // Lenis smooth scroll
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

  // Warm the API
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white dot-grid grain">
      {/* Custom cursor (auto-disabled on touch) */}
      <Cursor />

      {/* Soft halos */}
      <div className="fixed top-1/4 -right-40 w-[640px] h-[640px] halo pointer-events-none -z-0" />
      <div className="fixed bottom-1/3 -left-40 w-[520px] h-[520px] halo pointer-events-none -z-0 opacity-70" />

      {/* Scroll progress */}
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
          <Work />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
