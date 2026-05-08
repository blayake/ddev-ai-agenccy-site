/**
 * Blayake brand mark.
 *
 * Concept: a tightened, geometric "B" — two stacked half-pill bowls with a
 * subtle horizontal scan line that nods at the studio's AI/systems work,
 * plus a small "live" indicator dot top-right.
 *
 * Variants:
 *   <LogoMark />       — the square monogram
 *   <Wordmark />       — the text mark
 *   <LogoLockup />     — mark + text in a horizontal lockup
 */

const MARK_VIEWBOX = "0 0 64 64";

export function LogoMark({
  size = 36,
  rounded = 14,
  bg = "#ffffff",
  fg = "#050505",
  dot = true,
  className = "",
  ...rest
}) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      width={size}
      height={size}
      role="img"
      aria-label="Blayake"
      className={className}
      {...rest}
    >
      <rect width="64" height="64" rx={rounded} fill={bg} />
      {/* Geometric "B" */}
      <path
        fill={fg}
        d="
          M17 14
          h15
          c5.6 0 9.4 3.1 9.4 8.2
          c0 3.1-1.6 5.4-4.2 6.6
          c3.4 1 5.6 3.6 5.6 7.4
          c0 5.4-4 8.8-10.2 8.8
          h-15.6
          z
          M22 21.4
          v6.8
          h9.2
          c2.7 0 4.4-1.3 4.4-3.4
          c0-2.1-1.7-3.4-4.4-3.4
          z
          M22 35.4
          v8.2
          h10.2
          c3 0 4.8-1.5 4.8-4.1
          c0-2.6-1.8-4.1-4.8-4.1
          z
        "
      />
      {/* Subtle scan line through the B — system / signal */}
      <rect x="17" y="31.4" width="24.6" height="0.7" fill={bg} opacity="0.55" />
      {dot && <circle cx="50" cy="14" r="3" fill={fg} />}
    </svg>
  );
}

export function Wordmark({ size = 18, color = "currentColor", className = "" }) {
  // Use Cabinet Grotesk + tight tracking + custom letter accent
  return (
    <span
      className={`font-display font-black tracking-[-0.04em] leading-none ${className}`}
      style={{ fontSize: size, color }}
      aria-label="Blayake"
    >
      Bla<span className="italic font-medium" style={{ letterSpacing: "-0.06em" }}>y</span>ake
    </span>
  );
}

export function LogoLockup({
  markSize = 28,
  textSize = 16,
  bg = "#ffffff",
  fg = "#050505",
  textColor = "currentColor",
  caption,
  className = "",
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Blayake — AI Systems Agency">
      <LogoMark size={markSize} bg={bg} fg={fg} />
      <span className="leading-tight flex flex-col">
        <Wordmark size={textSize} color={textColor} />
        {caption && (
          <span
            className="font-mono-tech uppercase tracking-[0.32em] text-white/40"
            style={{ fontSize: Math.max(8, textSize * 0.45) }}
          >
            {caption}
          </span>
        )}
      </span>
    </span>
  );
}

export default LogoMark;
