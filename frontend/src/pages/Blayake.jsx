import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import axios from "axios";
import { ArrowUpRight, Plus, Minus, Sparkles, Bot, Workflow, Globe2, Zap, ArrowRight } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ---------------- Data ---------------- */
const NAV = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

const SERVICES = [
  {
    id: "01",
    title: "AI Automation",
    icon: Workflow,
    span: "md:col-span-8",
    blurb:
      "Bespoke automations that connect your tools, eliminate repetitive ops, and reclaim hundreds of hours every quarter.",
    tags: ["n8n", "Make", "Zapier", "Custom Python"],
  },
  {
    id: "02",
    title: "AI Content Systems",
    icon: Sparkles,
    span: "md:col-span-4",
    blurb: "Production engines for short-form, long-form and branded social — running 24/7.",
    tags: ["GPT", "Claude", "Veo"],
  },
  {
    id: "03",
    title: "Custom AI Chatbots",
    icon: Bot,
    span: "md:col-span-4",
    blurb: "Trained on your business. Deployed to your site, WhatsApp & support stack.",
    tags: ["RAG", "Tools", "Voice"],
  },
  {
    id: "04",
    title: "Website Development",
    icon: Globe2,
    span: "md:col-span-8",
    blurb:
      "Conversion-focused, performant, motion-rich websites engineered to turn visitors into pipeline.",
    tags: ["Next.js", "React", "Framer Motion", "Webflow"],
  },
];

const STATS = [
  { value: "150+", label: "Projects Shipped" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24/7", label: "Always-on Systems" },
  { value: "10×", label: "Avg. Throughput" },
];

const PROCESS = [
  { n: "01", t: "Discover", d: "Strategy sprint to map ops, gaps, and the highest-leverage AI bets." },
  { n: "02", t: "Design", d: "Wire systems & interfaces. Define data, models, and human handoffs." },
  { n: "03", t: "Build", d: "Ship in 2-week cycles. Production code, observable, version-controlled." },
  { n: "04", t: "Deploy", d: "Go-live, monitor, iterate. We stay on as your AI engineering partner." },
];

const CASES = [
  {
    client: "OAKBRIDGE / FINTECH",
    title: "Reduced underwriting cycle by 71%",
    img: "https://images.unsplash.com/photo-1773236376238-bde8e75c7506?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    metric: "71%",
    metricLabel: "faster decisions",
  },
  {
    client: "NORTHWIND / SAAS",
    title: "AI support deflected 62% of tickets",
    img: "https://images.unsplash.com/photo-1680992046626-418f7e910589?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    metric: "62%",
    metricLabel: "ticket deflection",
  },
  {
    client: "STUDIO MERIDIAN / DTC",
    title: "Doubled organic content output, halved cost",
    img: "https://images.unsplash.com/photo-1765046255479-669cf07a0230?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
    metric: "2.1×",
    metricLabel: "content velocity",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Blayake didn't sell us AI — they engineered a quiet machine that runs our ops while we sleep. Cleanest team we've worked with.",
    name: "Marcus Halden",
    role: "COO, Oakbridge Capital",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
  },
  {
    quote:
      "Six weeks in, our content engine had outproduced our previous year. Strategy + craft + speed in one team.",
    name: "Iris Tanaka",
    role: "Head of Brand, Studio Meridian",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
  },
  {
    quote:
      "They treated our LLM stack like real software — observability, evals, on-call. Night and day vs. our last vendor.",
    name: "Priya Achar",
    role: "VP Engineering, Northwind",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
  },
];

const FAQ = [
  { q: "How long does a typical engagement run?", a: "Most projects ship a first production system in 4–6 weeks. We then move to retainer or staff-aug for ongoing iteration." },
  { q: "Do you work with non-technical founders?", a: "Yes. Half of our clients have no in-house engineering. We bring strategy, build, and a maintenance plan you can actually own." },
  { q: "Which models and stacks do you use?", a: "We're stack-agnostic — OpenAI, Anthropic, Gemini, open-source Llama variants, plus the orchestration layer that fits your data and budget." },
  { q: "Will my data leave our infrastructure?", a: "Only if you want it to. We design private deployments, on-prem options, and zero-retention API configurations by default." },
  { q: "What does pricing look like?", a: "Fixed-price builds typically range $12k–$60k. Retainers start at $6k/mo. We send a clear scope before any commitment." },
];

/* ---------------- Helpers ---------------- */
function useReveal() {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  };
}

/* ---------------- Components ---------------- */
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 backdrop-blur-xl bg-ink-900/70 border-b border-ink-600"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3" data-testid="brand-logo">
          <div className="w-9 h-9 bg-tangerine flex items-center justify-center rounded-sm">
            <span className="text-ink-900 font-display font-black text-lg leading-none">B</span>
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold tracking-tight text-base">BLAYAKE</div>
            <div className="font-mono-tech text-[9px] tracking-[0.32em] text-ink-300 uppercase">
              AI Systems / Est. 2024
            </div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-10 font-mono-tech text-[11px] uppercase tracking-[0.22em] text-ink-300">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="link-underline hover:text-ink-100 transition-colors" data-testid={`nav-${n.label.toLowerCase()}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          data-testid="header-cta-book"
          className="group inline-flex items-center gap-2 bg-tangerine hover:bg-tangerine-hover text-ink-900 font-mono-tech text-[11px] font-bold uppercase tracking-[0.22em] px-5 py-3 rounded-sm transition-all hover:-translate-y-0.5"
        >
          Book a Call
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-24 md:pt-32 pb-24 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] ember pointer-events-none" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-ink-500 rounded-sm px-3 py-1.5 mb-10 font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300"
            data-testid="availability-badge"
          >
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-tangerine animate-ping opacity-60" />
              <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-tangerine" />
            </span>
            Booking Q1 / 2026 — 2 slots open
          </motion.div>

          <h1 className="font-display font-black text-[14vw] md:text-[9vw] lg:text-[7.4vw] leading-[0.88] tracking-[-0.04em]">
            <span className="reveal-line"><span style={{ animationDelay: "0.05s" }}>We engineer</span></span>
            <br />
            <span className="reveal-line"><span style={{ animationDelay: "0.18s" }}>autonomous</span></span>{" "}
            <span className="reveal-line"><span style={{ animationDelay: "0.28s" }} className="text-tangerine italic font-medium">growth.</span></span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 max-w-xl text-ink-300 text-base md:text-lg leading-relaxed"
          >
            Blayake is a small, senior team of engineers and designers building bespoke AI systems
            for ambitious operators — automations, content engines, custom chatbots, and the
            websites that put them to work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href="#contact"
              data-testid="hero-cta-start"
              className="group inline-flex items-center gap-2 bg-tangerine hover:bg-tangerine-hover text-ink-900 font-mono-tech text-[11px] font-bold uppercase tracking-[0.22em] px-6 py-4 rounded-sm transition-all hover:-translate-y-0.5"
            >
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#work"
              data-testid="hero-cta-work"
              className="inline-flex items-center gap-2 border border-ink-500 hover:border-tangerine hover:text-tangerine font-mono-tech text-[11px] font-bold uppercase tracking-[0.22em] px-6 py-4 rounded-sm transition-colors"
            >
              See Selected Work
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <HeroPanel />
        </div>
      </div>
    </section>
  );
}

function HeroPanel() {
  const bars = useMemo(
    () => [
      { l: "Pipeline Automations", v: 94 },
      { l: "Throughput Lift", v: 88 },
      { l: "Cost / Output", v: 41 },
    ],
    []
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative border border-ink-500 bg-ink-800/60 backdrop-blur-md p-7 rounded-sm"
      data-testid="hero-panel"
    >
      <div className="flex items-center justify-between mb-8">
        <span className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">
          / SYSTEM_STATUS.live
        </span>
        <span className="inline-flex items-center gap-2 font-mono-tech text-[10px] uppercase tracking-[0.22em] text-tangerine">
          <span className="w-1.5 h-1.5 rounded-full bg-tangerine animate-pulse" />
          ACTIVE
        </span>
      </div>

      <div className="space-y-7">
        {bars.map((b, i) => (
          <div key={b.l}>
            <div className="flex justify-between font-mono-tech text-[11px] uppercase tracking-[0.18em]">
              <span className="text-ink-200">{b.l}</span>
              <span className="text-tangerine">{b.v}%</span>
            </div>
            <div className="mt-2 h-[2px] bg-ink-500/60 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${b.v}%` }}
                transition={{ duration: 1.2, delay: 0.7 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-tangerine"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-ink-300">
        <div className="border border-ink-500 p-3"><div className="text-ink-100 text-2xl font-display font-bold tracking-tight">42ms</div>p95 latency</div>
        <div className="border border-ink-500 p-3"><div className="text-ink-100 text-2xl font-display font-bold tracking-tight">99.97%</div>uptime / 90d</div>
      </div>
    </motion.div>
  );
}

function Marquee() {
  const items = ["AI AUTOMATION", "CUSTOM LLMS", "RAG", "WORKFLOW DESIGN", "CONTENT ENGINES", "EVALS", "DEPLOY", "OBSERVABILITY"];
  const stream = [...items, ...items, ...items];
  return (
    <div className="border-y border-ink-600 bg-ink-900/60 py-6 overflow-hidden">
      <div className="marquee-track gap-16 px-8">
        {stream.map((it, i) => (
          <span
            key={i}
            className="font-display font-black text-3xl md:text-5xl tracking-tighter text-ink-700 whitespace-nowrap inline-flex items-center gap-16"
          >
            {it}
            <span className="text-tangerine">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ index, kicker, children, className = "" }) {
  return (
    <div className={`mb-14 md:mb-20 ${className}`}>
      <div className="flex items-center gap-3 mb-6 font-mono-tech text-[10px] uppercase tracking-[0.32em] text-tangerine">
        <span>/ {index}</span>
        <span className="text-ink-300">— {kicker}</span>
      </div>
      <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[0.95] max-w-4xl text-balance">
        {children}
      </h2>
    </div>
  );
}

function Services() {
  const reveal = useReveal();
  return (
    <section id="services" className="relative py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <SectionLabel index="01" kicker="Capabilities">
        Four disciplines. <span className="text-ink-400">One operating system</span> for your business.
      </SectionLabel>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.07 }}
              className={`trace-border ${s.span} group relative border border-ink-500 hover:border-tangerine/60 bg-ink-800/40 p-8 md:p-10 rounded-sm transition-all hover:-translate-y-1 overflow-hidden`}
              data-testid={`service-card-${s.id}`}
            >
              <div className="flex items-start justify-between mb-10">
                <span className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">
                  / {s.id}
                </span>
                <Icon className="w-6 h-6 text-ink-300 group-hover:text-tangerine transition-colors" strokeWidth={1.4} />
              </div>
              <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight leading-[1] mb-5">
                {s.title}
              </h3>
              <p className="text-ink-300 max-w-md leading-relaxed">{s.blurb}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-ink-300 border border-ink-500 px-2.5 py-1 rounded-sm">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function Stats() {
  const reveal = useReveal();
  return (
    <section className="relative py-20 md:py-28 px-6 md:px-12 border-y border-ink-600 bg-ink-800/30">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.08 }}
            className={`p-6 md:p-10 ${i !== 0 ? "md:border-l border-ink-600" : ""} ${i < 2 ? "border-b md:border-b-0 border-ink-600" : ""}`}
            data-testid={`stat-${i}`}
          >
            <div className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none">
              {s.value}
            </div>
            <div className="mt-3 font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const reveal = useReveal();
  return (
    <section id="process" className="relative py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <SectionLabel index="02" kicker="The Process">
        From scoping call to <span className="text-tangerine">production</span> in weeks, not quarters.
      </SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-4 border-t border-l border-ink-600">
        {PROCESS.map((p, i) => (
          <motion.div
            key={p.n}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.08 }}
            className="p-8 md:p-10 border-b border-r border-ink-600 group hover:bg-ink-800/40 transition-colors"
            data-testid={`process-step-${p.n}`}
          >
            <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-tangerine mb-10">
              / {p.n}
            </div>
            <h3 className="font-display font-bold text-3xl tracking-tight mb-5">{p.t}</h3>
            <p className="text-ink-300 text-sm leading-relaxed">{p.d}</p>
            <Zap className="w-4 h-4 text-ink-500 mt-8 group-hover:text-tangerine transition-colors" strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CaseStudies() {
  const reveal = useReveal();
  return (
    <section id="work" className="relative py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <SectionLabel index="03" kicker="Selected Work">
        Quiet machines, <span className="text-ink-400">loud results.</span>
      </SectionLabel>

      <div className="space-y-4">
        {CASES.map((c, i) => (
          <motion.a
            key={c.title}
            href="#contact"
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.08 }}
            className="group block border border-ink-500 hover:border-tangerine/60 bg-ink-800/30 rounded-sm overflow-hidden transition-colors"
            data-testid={`case-card-${i}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div className="md:col-span-4 relative aspect-[16/10] md:aspect-auto overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900/70 to-transparent" />
              </div>
              <div className="md:col-span-6 p-8 md:p-10 flex flex-col justify-center">
                <div className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300 mb-4">
                  {c.client}
                </div>
                <h3 className="font-display font-bold text-2xl md:text-4xl tracking-tight leading-[1.05] text-balance">
                  {c.title}
                </h3>
              </div>
              <div className="md:col-span-2 p-8 md:p-10 md:border-l border-ink-500 flex flex-col justify-center items-start md:items-end">
                <div className="font-display font-black text-5xl text-tangerine tracking-tighter leading-none">
                  {c.metric}
                </div>
                <div className="mt-2 font-mono-tech text-[10px] uppercase tracking-[0.22em] text-ink-300">
                  {c.metricLabel}
                </div>
                <ArrowUpRight className="mt-6 w-5 h-5 text-ink-300 group-hover:text-tangerine group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const reveal = useReveal();
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <SectionLabel index="04" kicker="In their words">
        Operators who refuse to <span className="text-ink-400">do it the old way.</span>
      </SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.figure
            key={t.name}
            {...reveal}
            transition={{ ...reveal.transition, delay: i * 0.08 }}
            className="border border-ink-500 bg-ink-800/30 p-7 rounded-sm flex flex-col"
            data-testid={`testimonial-${i}`}
          >
            <div className="font-display text-tangerine text-5xl leading-none mb-4">"</div>
            <blockquote className="text-ink-100 leading-relaxed flex-1">{t.quote}</blockquote>
            <figcaption className="mt-7 flex items-center gap-3 pt-5 border-t border-ink-600">
              <img src={t.avatar} alt={t.name} loading="lazy" className="w-10 h-10 rounded-full object-cover grayscale" />
              <div>
                <div className="font-display font-bold text-sm">{t.name}</div>
                <div className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-ink-300">{t.role}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative py-24 md:py-32 px-6 md:px-12 max-w-3xl mx-auto">
      <SectionLabel index="05" kicker="Questions">
        Things people ask <span className="text-ink-400">before signing.</span>
      </SectionLabel>
      <div className="border-t border-ink-600">
        {FAQ.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="border-b border-ink-600">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                data-testid={`faq-toggle-${i}`}
                aria-expanded={isOpen}
              >
                <span className="font-display font-bold text-lg md:text-xl tracking-tight group-hover:text-tangerine transition-colors">
                  {f.q}
                </span>
                <span className="shrink-0 w-9 h-9 border border-ink-500 grid place-items-center rounded-sm group-hover:border-tangerine group-hover:text-tangerine transition-colors">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-12 text-ink-300 leading-relaxed">{f.a}</p>
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
  const [form, setForm] = useState({ name: "", email: "", company: "", project_type: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || null,
        project_type: form.project_type || null,
        message: form.message.trim(),
      };
      await axios.post(`${API}/leads`, payload);
      setStatus({ state: "success", msg: "Got it. We'll be in touch within 24 hours." });
      setForm({ name: "", email: "", company: "", project_type: "", message: "" });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went wrong. Please try again.";
      setStatus({ state: "error", msg: typeof msg === "string" ? msg : "Validation error." });
    }
  };

  const fieldCls =
    "w-full bg-transparent border-b border-ink-500 focus:border-tangerine outline-none py-3 px-0 font-sans text-ink-100 placeholder:text-ink-400 transition-colors";

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-tangerine mb-6">
            / 06 — Book a Call
          </div>
          <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-[0.92]">
            Ready to <br /> automate the boring?
          </h2>
          <p className="mt-8 text-ink-300 max-w-md leading-relaxed">
            Tell us where you're stuck. We'll send back a 1-page diagnosis within 24 hours — no
            slide deck, no funnel.
          </p>
          <div className="mt-10 space-y-3 font-mono-tech text-[11px] uppercase tracking-[0.22em] text-ink-300">
            <div>HELLO @ BLAYAKE.AGENCY</div>
            <div>REMOTE / LISBON · NYC · BENGALURU</div>
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="contact-form">
          <div>
            <label className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">Name *</label>
            <input required value={form.name} onChange={update("name")} className={fieldCls} placeholder="Jane Doe" data-testid="form-name" />
          </div>
          <div>
            <label className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">Email *</label>
            <input required type="email" value={form.email} onChange={update("email")} className={fieldCls} placeholder="jane@company.com" data-testid="form-email" />
          </div>
          <div>
            <label className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">Company</label>
            <input value={form.company} onChange={update("company")} className={fieldCls} placeholder="Acme Inc." data-testid="form-company" />
          </div>
          <div>
            <label className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">Project Type</label>
            <select value={form.project_type} onChange={update("project_type")} className={`${fieldCls} appearance-none`} data-testid="form-project-type">
              <option value="" className="bg-ink-900">Select…</option>
              <option value="automation" className="bg-ink-900">AI Automation</option>
              <option value="content" className="bg-ink-900">Content System</option>
              <option value="chatbot" className="bg-ink-900">Custom Chatbot</option>
              <option value="website" className="bg-ink-900">Website</option>
              <option value="other" className="bg-ink-900">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">Where are you stuck? *</label>
            <textarea
              required
              minLength={5}
              rows={4}
              value={form.message}
              onChange={update("message")}
              className={`${fieldCls} resize-none`}
              placeholder="Tell us about the problem, your stack, and what success looks like."
              data-testid="form-message"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-between gap-6 pt-4">
            <div className="font-mono-tech text-[10px] uppercase tracking-[0.22em] text-ink-300 min-h-[1rem]" data-testid="form-status">
              {status.state === "loading" && "Sending…"}
              {status.state === "success" && <span className="text-tangerine">{status.msg}</span>}
              {status.state === "error" && <span className="text-red-400">{status.msg}</span>}
            </div>
            <button
              type="submit"
              disabled={status.state === "loading"}
              data-testid="form-submit"
              className="group inline-flex items-center gap-2 bg-tangerine hover:bg-tangerine-hover disabled:opacity-50 text-ink-900 font-mono-tech text-[11px] font-bold uppercase tracking-[0.22em] px-6 py-4 rounded-sm transition-all hover:-translate-y-0.5"
            >
              Send Brief
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative pt-16 pb-6 px-6 md:px-12 border-t border-ink-600 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 pb-16">
        <div className="col-span-2">
          <div className="font-display font-bold text-xl">BLAYAKE</div>
          <p className="mt-4 text-ink-300 text-sm max-w-xs leading-relaxed">
            A senior team building bespoke AI systems for operators who refuse to be ignored.
          </p>
        </div>
        <div>
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300 mb-4">Studio</div>
          <ul className="space-y-2 font-display text-sm">
            <li><a href="#work" className="link-underline">Work</a></li>
            <li><a href="#services" className="link-underline">Services</a></li>
            <li><a href="#process" className="link-underline">Process</a></li>
          </ul>
        </div>
        <div>
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300 mb-4">Social</div>
          <ul className="space-y-2 font-display text-sm">
            <li><a href="#" className="link-underline">Twitter / X</a></li>
            <li><a href="#" className="link-underline">LinkedIn</a></li>
            <li><a href="#" className="link-underline">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6 pt-8 border-t border-ink-600">
        <div className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">
          © 2026 Blayake Agency · All systems go
        </div>
        <div className="font-mono-tech text-[10px] uppercase tracking-[0.28em] text-ink-300">
          Built in-house with Lenis × Framer Motion
        </div>
      </div>
      <div aria-hidden className="-mb-[3vw] mt-8 select-none">
        <div className="font-display font-black text-[22vw] leading-[0.85] tracking-[-0.06em] text-ink-700/70 whitespace-nowrap text-center">
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
      duration: 1.1,
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
    <div className="relative min-h-screen bg-ink-900 text-ink-100 hairline-grid grain">
      {/* Ambient embers */}
      <div className="fixed top-1/3 -right-40 w-[640px] h-[640px] ember pointer-events-none -z-0" />
      <div className="fixed -bottom-40 -left-40 w-[520px] h-[520px] ember pointer-events-none -z-0 opacity-70" />

      {/* Scroll progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-tangerine origin-left z-[60]"
        data-testid="scroll-progress"
      />

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <Stats />
          <Process />
          <CaseStudies />
          <Testimonials />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
