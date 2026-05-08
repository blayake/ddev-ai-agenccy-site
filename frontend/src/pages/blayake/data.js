import { Code2, Layers, Film, Sparkles, PenLine } from "lucide-react";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const NAV = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export const SERVICES = [
  {
    n: "01",
    title: "Website Creation",
    icon: Layers,
    tag: "Design + Build",
    blurb:
      "Landing pages, portfolios, full sites with payments and bookings — fast, clear, and built to convert.",
    img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
  {
    n: "02",
    title: "SaaS Development",
    icon: Code2,
    tag: "Web Apps + APIs",
    blurb:
      "Full SaaS platforms with login, database, payments, and dashboards. Real product, ready for real users.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
  {
    n: "03",
    title: "Short-Form Content",
    icon: Film,
    tag: "Reels · TikToks · Shorts",
    blurb:
      "Daily Reels, TikToks and Shorts for your brand — fully edited, captioned, and ready to post.",
    img: "https://images.unsplash.com/photo-1626218174358-7769486f0e91?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
  {
    n: "04",
    title: "AI Video Ads",
    icon: Sparkles,
    tag: "Generated + Edited",
    blurb:
      "Ready-to-run ad videos with AI actors, scripts and editing — no filming, no studio, no excuses.",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
  {
    n: "05",
    title: "Copywriting",
    icon: PenLine,
    tag: "Words That Sell",
    blurb:
      "We write the words for your site, ads, and product so people understand what you offer and act on it.",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
];

export const WORK = [
  {
    id: "oakbridge",
    client: "OAKBRIDGE / FINTECH",
    title: "Underwriting cycle, –71%",
    year: "2026",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
  {
    id: "northwind",
    client: "NORTHWIND / SAAS",
    title: "AI support deflected 62% of tickets",
    year: "2025",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
  {
    id: "meridian",
    client: "STUDIO MERIDIAN / DTC",
    title: "Doubled organic content, halved cost",
    year: "2025",
    img: "https://images.unsplash.com/photo-1626218174358-7769486f0e91?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
  {
    id: "halcyon",
    client: "HALCYON LABS / HEALTH",
    title: "Patient triage automated end-to-end",
    year: "2024",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  },
];

export const FAQ = [
  {
    id: "speed",
    q: "How fast can you ship?",
    a: "Most projects ship a first production system in 4–6 weeks. Then we move to retainer or staff-aug.",
  },
  {
    id: "models",
    q: "Which models do you use?",
    a: "Stack-agnostic — OpenAI, Anthropic, Gemini, open-source Llama variants, plus the orchestration that fits your data.",
  },
  {
    id: "pricing",
    q: "What does pricing look like?",
    a: "Fixed-price builds typically range $12k–$60k. Retainers start at $6k/mo. Clear scope before any commitment.",
  },
];

export const MARQUEE_LABELS = ["AI", "AUTOMATION", "DESIGN", "BUILD", "CONTENT", "DEPLOY", "RESULTS"];

export const MARQUEE_IMGS = [
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  "https://images.unsplash.com/photo-1633899306328-c5e70574aaa2?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
];

export const HERO_IMG =
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";

export const REEL_IMG =
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?crop=entropy&cs=srgb&fm=jpg&q=85&w=2200";
