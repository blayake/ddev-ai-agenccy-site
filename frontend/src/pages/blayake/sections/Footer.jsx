import { LogoMark, Wordmark } from "@/components/Logo";

const SOCIALS = [
  { id: "x", label: "@blayake on X", href: "https://x.com/blayake", external: true, testid: "footer-x" },
  {
    id: "email",
    label: "teamblayake.agency@gmail.com",
    href: "mailto:teamblayake.agency@gmail.com",
    external: false,
    testid: "footer-email",
  },
];

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-6 px-6 md:px-12 border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-0 md:items-end justify-between pb-12">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark size={34} />
            <Wordmark size={20} />
          </div>
          <p className="mt-4 text-white/50 text-sm max-w-xs leading-relaxed">
            A senior team building bespoke AI systems for operators who refuse to be ignored.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 font-mono-tech text-[11px] uppercase tracking-[0.22em] text-white/50">
          {SOCIALS.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target={s.external ? "_blank" : undefined}
              rel={s.external ? "noopener noreferrer" : undefined}
              className="link-underline"
              data-cursor="hover"
              data-testid={s.testid}
            >
              {s.label}
            </a>
          ))}
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
