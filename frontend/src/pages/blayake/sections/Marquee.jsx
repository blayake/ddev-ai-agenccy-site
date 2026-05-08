import { MARQUEE_IMGS, MARQUEE_LABELS } from "@/pages/blayake/data";

const STREAMS = 3;

function MarqueeItem({ label, img, k }) {
  return (
    <div className="inline-flex items-center gap-6 shrink-0">
      <div className="w-20 h-12 md:w-28 md:h-16 rounded-lg overflow-hidden glass relative">
        <img
          src={img}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent" />
      </div>
      <span className="font-display font-black text-2xl md:text-4xl tracking-tighter text-white whitespace-nowrap">
        {label}
      </span>
      <span className="text-white/30 text-xl md:text-2xl">/</span>
    </div>
  );
}

export default function Marquee() {
  const stream = Array.from({ length: STREAMS }, (_, s) =>
    MARQUEE_LABELS.map((label, i) => ({
      key: `${label}-s${s}-${i}`,
      label,
      img: MARQUEE_IMGS[i % MARQUEE_IMGS.length],
    }))
  ).flat();

  return (
    <div className="border-y border-white/[0.06] py-5 overflow-hidden bg-black/40">
      <div className="marquee-track gap-6 px-6 items-center">
        {stream.map((it) => (
          <MarqueeItem key={it.key} label={it.label} img={it.img} />
        ))}
      </div>
    </div>
  );
}
