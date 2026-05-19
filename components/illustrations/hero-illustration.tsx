import { cn } from "@/lib/utils";

/**
 * Hero illustration — animated SVG.
 *
 * Architected as a drop-in: swap for a `<Lottie>` component later by replacing
 * the SVG markup. Animations use CSS keyframes (no JS), respect
 * `prefers-reduced-motion`, and use brand CSS variables (primary/accent).
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative isolate aspect-[4/3] w-full max-w-md", className)} aria-hidden>
      <style>{`
        @keyframes craftly-orbit { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes craftly-pulse { 0%,100% { transform: scale(1); opacity: 0.85; } 50% { transform: scale(1.06); opacity: 1; } }
        @keyframes craftly-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes craftly-shimmer { 0%,100% { stroke-dashoffset: 0; } 50% { stroke-dashoffset: -40; } }
        @keyframes craftly-fade { 0% { opacity: 0; } 100% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .craftly-anim { animation: none !important; }
        }
      `}</style>
      <svg viewBox="0 0 400 300" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="hero-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.585 0.12 191)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(0.77 0.16 70)" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="card-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--card)" />
            <stop offset="100%" stopColor="var(--background)" />
          </linearGradient>
          <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" />
            <feOffset dy="2" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.18" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft background blob */}
        <ellipse cx="200" cy="150" rx="180" ry="120" fill="url(#hero-gradient)" />

        {/* Orbit ring */}
        <g
          className="craftly-anim"
          style={{
            transformOrigin: "200px 150px",
            animation: "craftly-orbit 24s linear infinite",
          }}
        >
          <circle
            cx="200"
            cy="150"
            r="110"
            fill="none"
            stroke="oklch(0.585 0.12 191)"
            strokeOpacity="0.25"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <circle cx="310" cy="150" r="4" fill="oklch(0.77 0.16 70)" />
        </g>

        {/* Central card — "listing" */}
        <g
          className="craftly-anim"
          style={{ animation: "craftly-float 6s ease-in-out infinite" }}
          filter="url(#card-shadow)"
        >
          <rect
            x="135"
            y="95"
            width="130"
            height="110"
            rx="12"
            fill="url(#card-gradient)"
            stroke="var(--border)"
            strokeWidth="1"
          />
          {/* Image placeholder */}
          <rect
            x="147"
            y="107"
            width="106"
            height="44"
            rx="6"
            fill="oklch(0.585 0.12 191)"
            fillOpacity="0.12"
          />
          {/* Sparkle inside */}
          <g
            className="craftly-anim"
            style={{
              transformOrigin: "200px 129px",
              animation: "craftly-pulse 2.4s ease-in-out infinite",
            }}
          >
            <path
              d="M200 119 L203 127 L211 130 L203 133 L200 141 L197 133 L189 130 L197 127 Z"
              fill="oklch(0.585 0.12 191)"
            />
          </g>
          {/* Text lines */}
          <rect
            x="147"
            y="161"
            width="70"
            height="6"
            rx="3"
            fill="var(--muted-foreground)"
            opacity="0.4"
          />
          <rect
            x="147"
            y="173"
            width="92"
            height="5"
            rx="2.5"
            fill="var(--muted-foreground)"
            opacity="0.25"
          />
          <rect
            x="147"
            y="184"
            width="58"
            height="5"
            rx="2.5"
            fill="var(--muted-foreground)"
            opacity="0.25"
          />
        </g>

        {/* Floating tag chip — top left */}
        <g
          className="craftly-anim"
          style={{
            animation: "craftly-float 5s ease-in-out infinite",
            animationDelay: "-1.2s",
          }}
        >
          <rect
            x="56"
            y="62"
            width="78"
            height="26"
            rx="13"
            fill="var(--card)"
            stroke="var(--border)"
          />
          <circle cx="68" cy="75" r="3.5" fill="oklch(0.77 0.16 70)" />
          <rect
            x="78"
            y="71"
            width="46"
            height="8"
            rx="3"
            fill="var(--muted-foreground)"
            opacity="0.55"
          />
        </g>

        {/* Floating tag chip — bottom right */}
        <g
          className="craftly-anim"
          style={{
            animation: "craftly-float 4.5s ease-in-out infinite",
            animationDelay: "-2.4s",
          }}
        >
          <rect
            x="262"
            y="210"
            width="92"
            height="26"
            rx="13"
            fill="var(--card)"
            stroke="var(--border)"
          />
          <circle cx="274" cy="223" r="3.5" fill="oklch(0.585 0.12 191)" />
          <rect
            x="284"
            y="219"
            width="60"
            height="8"
            rx="3"
            fill="var(--muted-foreground)"
            opacity="0.55"
          />
        </g>

        {/* AI prompt bubble — top right */}
        <g
          className="craftly-anim"
          style={{
            animation: "craftly-pulse 3.6s ease-in-out infinite",
            transformOrigin: "315px 90px",
          }}
        >
          <rect
            x="280"
            y="72"
            width="70"
            height="36"
            rx="10"
            fill="oklch(0.585 0.12 191)"
            fillOpacity="0.12"
            stroke="oklch(0.585 0.12 191)"
            strokeOpacity="0.4"
          />
          <text
            x="315"
            y="95"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="600"
            fill="oklch(0.585 0.12 191)"
          >
            ai ✨
          </text>
        </g>

        {/* Connecting line — animated dash */}
        <path
          className="craftly-anim"
          d="M 315 108 Q 280 130 220 140"
          fill="none"
          stroke="oklch(0.585 0.12 191)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          style={{ animation: "craftly-shimmer 3s linear infinite" }}
        />
      </svg>
    </div>
  );
}
