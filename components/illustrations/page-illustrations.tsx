import { cn } from "@/lib/utils";

/**
 * Page-topic inline-SVG illustrations.
 *
 * Each one is a brand-tinted, CSS-keyframe-animated SVG sized to drop into a
 * Hero or Section block. All respect `prefers-reduced-motion`. Designed to
 * be replaced with Lottie JSON later via the `<LottieOrFallback>` shim.
 */

const SHARED_STYLES = `
  @keyframes pi-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes pi-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
  @keyframes pi-pulse { 0%,100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.04); } }
  @keyframes pi-shimmer { 0% { stroke-dashoffset: 24; } 100% { stroke-dashoffset: 0; } }
  @keyframes pi-blink { 0%,55%,100% { opacity: 1; } 60%,95% { opacity: 0.25; } }
  @keyframes pi-bar { 0% { transform: scaleY(0.4); } 100% { transform: scaleY(1); } }
  @media (prefers-reduced-motion: reduce) { .pi-anim { animation: none !important; } }
`;

function IllustrationShell({
  children,
  className,
  ratio = "aspect-[5/4]",
}: {
  children: React.ReactNode;
  className?: string;
  ratio?: string;
}) {
  return (
    <div className={cn("relative isolate w-full max-w-md", ratio, className)} aria-hidden>
      <style>{SHARED_STYLES}</style>
      <svg viewBox="0 0 400 320" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="pi-soft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.585 0.12 191)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(0.77 0.16 70)" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="pi-teal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.585 0.12 191)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.585 0.12 191)" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="pi-amber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.14 70)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.82 0.14 70)" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="160" rx="180" ry="120" fill="url(#pi-soft)" />
        {children}
      </svg>
    </div>
  );
}

/** /pricing — three stacked plan cards with a check-up gradient halo. */
export function PricingIllustration({ className }: { className?: string }) {
  return (
    <IllustrationShell className={className}>
      <g
        className="pi-anim"
        style={{ animation: "pi-float 5s ease-in-out infinite", animationDelay: "-1s" }}
      >
        <rect
          x="78"
          y="106"
          width="100"
          height="148"
          rx="14"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <text
          x="128"
          y="138"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="var(--muted-foreground)"
        >
          FREE
        </text>
        <text
          x="128"
          y="170"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="22"
          fontWeight="700"
          fill="var(--foreground)"
        >
          $0
        </text>
        <line x1="92" y1="190" x2="164" y2="190" stroke="var(--border)" strokeWidth="1" />
        <rect
          x="92"
          y="200"
          width="60"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
          opacity="0.35"
        />
        <rect
          x="92"
          y="212"
          width="48"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
          opacity="0.3"
        />
        <rect
          x="92"
          y="224"
          width="56"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
          opacity="0.3"
        />
      </g>

      <g className="pi-anim" style={{ animation: "pi-float 5s ease-in-out infinite" }}>
        <rect
          x="148"
          y="80"
          width="108"
          height="180"
          rx="14"
          fill="url(#pi-teal)"
          stroke="oklch(0.585 0.12 191)"
          strokeOpacity="0.5"
        />
        <text
          x="202"
          y="112"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="white"
          opacity="0.85"
        >
          PRO
        </text>
        <text
          x="202"
          y="148"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="26"
          fontWeight="700"
          fill="white"
        >
          $5.99
        </text>
        <line
          x1="166"
          y1="170"
          x2="238"
          y2="170"
          stroke="white"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
        <rect x="166" y="184" width="70" height="4" rx="2" fill="white" opacity="0.8" />
        <rect x="166" y="196" width="58" height="4" rx="2" fill="white" opacity="0.55" />
        <rect x="166" y="208" width="64" height="4" rx="2" fill="white" opacity="0.55" />
        <rect x="166" y="220" width="50" height="4" rx="2" fill="white" opacity="0.55" />
        <g
          className="pi-anim"
          style={{
            animation: "pi-pulse 2.4s ease-in-out infinite",
            transformOrigin: "202px 240px",
          }}
        >
          <rect x="170" y="234" width="64" height="14" rx="7" fill="white" />
        </g>
      </g>

      <g
        className="pi-anim"
        style={{ animation: "pi-float 5s ease-in-out infinite", animationDelay: "-2s" }}
      >
        <rect
          x="226"
          y="106"
          width="100"
          height="148"
          rx="14"
          fill="var(--card)"
          stroke="var(--border)"
        />
        <text
          x="276"
          y="138"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="oklch(0.82 0.14 70)"
        >
          MAX
        </text>
        <text
          x="276"
          y="170"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="22"
          fontWeight="700"
          fill="var(--foreground)"
        >
          $11.99
        </text>
        <line x1="240" y1="190" x2="312" y2="190" stroke="var(--border)" strokeWidth="1" />
        <rect
          x="240"
          y="200"
          width="64"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
          opacity="0.35"
        />
        <rect
          x="240"
          y="212"
          width="56"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
          opacity="0.3"
        />
        <rect
          x="240"
          y="224"
          width="60"
          height="4"
          rx="2"
          fill="var(--muted-foreground)"
          opacity="0.3"
        />
      </g>
    </IllustrationShell>
  );
}

/** /tools/niche-finder — radar / compass scanning across clusters. */
export function NicheIllustration({ className }: { className?: string }) {
  return (
    <IllustrationShell className={className}>
      <circle
        cx="200"
        cy="160"
        r="110"
        fill="none"
        stroke="oklch(0.585 0.12 191)"
        strokeOpacity="0.2"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <circle
        cx="200"
        cy="160"
        r="74"
        fill="none"
        stroke="oklch(0.585 0.12 191)"
        strokeOpacity="0.25"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <circle
        cx="200"
        cy="160"
        r="40"
        fill="none"
        stroke="oklch(0.585 0.12 191)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Sweeping radar arm */}
      <g
        className="pi-anim"
        style={{
          animation: "pi-spin 8s linear infinite",
          transformOrigin: "200px 160px",
        }}
      >
        <path
          d="M 200 160 L 200 50 A 110 110 0 0 1 308 175 Z"
          fill="oklch(0.585 0.12 191)"
          fillOpacity="0.1"
        />
        <line x1="200" y1="160" x2="200" y2="50" stroke="oklch(0.585 0.12 191)" strokeWidth="1.5" />
      </g>

      {/* Detected clusters */}
      <Cluster cx={140} cy={90} r={9} color="oklch(0.82 0.14 70)" delay="-0.5s" />
      <Cluster cx={262} cy={102} r={11} color="oklch(0.585 0.12 191)" delay="-1.2s" />
      <Cluster cx={290} cy={210} r={8} color="oklch(0.82 0.14 70)" delay="-1.8s" />
      <Cluster cx={130} cy={224} r={10} color="oklch(0.585 0.12 191)" delay="-0.2s" />
      <Cluster cx={200} cy={160} r={6} color="oklch(0.585 0.12 191)" delay="0s" />

      {/* Center compass */}
      <circle
        cx="200"
        cy="160"
        r="6"
        fill="var(--background)"
        stroke="oklch(0.585 0.12 191)"
        strokeWidth="2"
      />
    </IllustrationShell>
  );
}

function Cluster({
  cx,
  cy,
  r,
  color,
  delay,
}: {
  cx: number;
  cy: number;
  r: number;
  color: string;
  delay: string;
}) {
  return (
    <g
      className="pi-anim"
      style={{ animation: "pi-pulse 2.4s ease-in-out infinite", animationDelay: delay }}
    >
      <circle cx={cx} cy={cy} r={r + 4} fill={color} fillOpacity="0.18" />
      <circle cx={cx} cy={cy} r={r} fill={color} />
    </g>
  );
}

/** /tools/fee-calculator — coin stack + ticker line. */
export function CalculatorIllustration({ className }: { className?: string }) {
  return (
    <IllustrationShell className={className}>
      {/* Receipt card */}
      <g className="pi-anim" style={{ animation: "pi-float 6s ease-in-out infinite" }}>
        <rect
          x="80"
          y="74"
          width="170"
          height="200"
          rx="12"
          fill="var(--card)"
          stroke="var(--border)"
        />
        <rect
          x="96"
          y="92"
          width="80"
          height="6"
          rx="3"
          fill="var(--muted-foreground)"
          opacity="0.55"
        />
        <rect x="96" y="110" width="138" height="3" rx="1.5" fill="var(--border)" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect
              x="96"
              y={124 + i * 24}
              width="74"
              height="4"
              rx="2"
              fill="var(--muted-foreground)"
              opacity="0.4"
            />
            <rect
              x="194"
              y={124 + i * 24}
              width="40"
              height="4"
              rx="2"
              fill="oklch(0.585 0.12 191)"
              opacity={i === 3 ? 1 : 0.5}
            />
          </g>
        ))}
        <line x1="96" y1="224" x2="234" y2="224" stroke="var(--border)" strokeWidth="1" />
        <rect x="96" y="236" width="50" height="5" rx="2.5" fill="var(--foreground)" />
        <rect x="184" y="236" width="50" height="8" rx="3" fill="oklch(0.74 0.16 150)" />
      </g>

      {/* Coin stack */}
      <g
        className="pi-anim"
        style={{
          animation: "pi-float 4.8s ease-in-out infinite",
          animationDelay: "-1.4s",
        }}
      >
        <ellipse cx="300" cy="244" rx="38" ry="10" fill="url(#pi-amber)" />
        <ellipse cx="300" cy="226" rx="34" ry="9" fill="oklch(0.82 0.14 70)" opacity="0.85" />
        <ellipse cx="300" cy="210" rx="30" ry="8" fill="oklch(0.82 0.14 70)" opacity="0.7" />
        <text
          x="300"
          y="216"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="16"
          fontWeight="700"
          fill="white"
        >
          $
        </text>
      </g>
    </IllustrationShell>
  );
}

/** /tools/events-calendar — calendar grid with seasonal moments. */
export function CalendarIllustration({ className }: { className?: string }) {
  return (
    <IllustrationShell className={className}>
      <g className="pi-anim" style={{ animation: "pi-float 5.4s ease-in-out infinite" }}>
        <rect
          x="92"
          y="70"
          width="216"
          height="200"
          rx="14"
          fill="var(--card)"
          stroke="var(--border)"
        />
        {/* Header strip */}
        <rect x="92" y="70" width="216" height="32" rx="14" fill="url(#pi-amber)" />
        <rect x="92" y="92" width="216" height="10" fill="url(#pi-amber)" />
        <text
          x="200"
          y="92"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fontWeight="700"
          fill="white"
        >
          2026 · Q4 SHIPPING WINDOW
        </text>

        {/* Day grid */}
        {Array.from({ length: 28 }).map((_, i) => {
          const col = i % 7;
          const row = Math.floor(i / 7);
          const x = 104 + col * 28;
          const y = 122 + row * 32;
          const highlighted = [9, 14, 22].includes(i);
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width="22"
                height="22"
                rx="4"
                fill={highlighted ? "oklch(0.82 0.14 70)" : "var(--background)"}
                stroke="var(--border)"
                strokeWidth="1"
                opacity={highlighted ? 1 : 0.85}
              />
              <text
                x={x + 11}
                y={y + 15}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="9"
                fill={highlighted ? "white" : "var(--muted-foreground)"}
              >
                {i + 1}
              </text>
              {highlighted && (
                <circle
                  cx={x + 18}
                  cy={y + 4}
                  r="2.5"
                  fill="white"
                  className="pi-anim"
                  style={{
                    animation: "pi-blink 1.8s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              )}
            </g>
          );
        })}
      </g>
    </IllustrationShell>
  );
}

/** /blog — open article + reading-time meter. */
export function BlogIllustration({ className }: { className?: string }) {
  return (
    <IllustrationShell className={className}>
      <g className="pi-anim" style={{ animation: "pi-float 5.6s ease-in-out infinite" }}>
        <rect
          x="78"
          y="74"
          width="244"
          height="180"
          rx="12"
          fill="var(--card)"
          stroke="var(--border)"
        />
        {/* Title */}
        <rect x="94" y="92" width="140" height="10" rx="3" fill="var(--foreground)" />
        <rect
          x="94"
          y="108"
          width="200"
          height="6"
          rx="2"
          fill="var(--muted-foreground)"
          opacity="0.6"
        />
        <line x1="94" y1="126" x2="306" y2="126" stroke="var(--border)" strokeWidth="1" />
        {/* Body lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="94"
            y={138 + i * 14}
            width={i === 4 ? 140 : 212}
            height="4"
            rx="2"
            fill="var(--muted-foreground)"
            opacity="0.35"
          />
        ))}
        {/* Pull-quote accent */}
        <rect x="94" y="216" width="2" height="28" fill="oklch(0.585 0.12 191)" />
        <rect
          x="102"
          y="220"
          width="180"
          height="5"
          rx="2"
          fill="var(--foreground)"
          opacity="0.85"
        />
        <rect
          x="102"
          y="232"
          width="120"
          height="5"
          rx="2"
          fill="var(--foreground)"
          opacity="0.5"
        />
      </g>

      {/* Reading-time meter */}
      <g
        className="pi-anim"
        style={{
          animation: "pi-pulse 3s ease-in-out infinite",
          transformOrigin: "320px 116px",
        }}
      >
        <circle
          cx="320"
          cy="116"
          r="22"
          fill="var(--card)"
          stroke="oklch(0.585 0.12 191)"
          strokeWidth="2"
        />
        <text
          x="320"
          y="113"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fontWeight="700"
          fill="oklch(0.585 0.12 191)"
        >
          7
        </text>
        <text
          x="320"
          y="125"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="6"
          fill="var(--muted-foreground)"
        >
          MIN
        </text>
      </g>
    </IllustrationShell>
  );
}

/** /about — small handshake / community grid. */
export function AboutIllustration({ className }: { className?: string }) {
  return (
    <IllustrationShell className={className}>
      {/* People grid */}
      {[
        { cx: 140, cy: 120, color: "oklch(0.585 0.12 191)", delay: "0s" },
        { cx: 200, cy: 100, color: "oklch(0.82 0.14 70)", delay: "-0.6s" },
        { cx: 260, cy: 120, color: "oklch(0.585 0.12 191)", delay: "-1.2s" },
        { cx: 140, cy: 200, color: "oklch(0.82 0.14 70)", delay: "-1.8s" },
        { cx: 200, cy: 220, color: "oklch(0.585 0.12 191)", delay: "-2.4s" },
        { cx: 260, cy: 200, color: "oklch(0.82 0.14 70)", delay: "-3s" },
      ].map((p, i) => (
        <g
          key={i}
          className="pi-anim"
          style={{ animation: "pi-float 5s ease-in-out infinite", animationDelay: p.delay }}
        >
          <circle
            cx={p.cx}
            cy={p.cy}
            r="22"
            fill="var(--card)"
            stroke={p.color}
            strokeWidth="1.5"
          />
          <circle cx={p.cx} cy={p.cy - 4} r="8" fill={p.color} opacity="0.85" />
          <path
            d={`M ${p.cx - 12} ${p.cy + 14} Q ${p.cx} ${p.cy + 6} ${p.cx + 12} ${p.cy + 14}`}
            fill={p.color}
            opacity="0.85"
          />
        </g>
      ))}
      {/* Center pulse — community */}
      <g
        className="pi-anim"
        style={{
          animation: "pi-pulse 2.4s ease-in-out infinite",
          transformOrigin: "200px 160px",
        }}
      >
        <circle cx="200" cy="160" r="14" fill="url(#pi-teal)" />
        <path
          d="M194 160 L198 164 L206 156"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </IllustrationShell>
  );
}

/** /app dashboard — animated bar chart conveying activity at a glance. */
export function ActivityIllustration({ className }: { className?: string }) {
  return (
    <IllustrationShell className={className} ratio="aspect-[5/3]">
      <g className="pi-anim" style={{ animation: "pi-float 5s ease-in-out infinite" }}>
        <rect
          x="60"
          y="56"
          width="280"
          height="200"
          rx="14"
          fill="var(--card)"
          stroke="var(--border)"
        />
        {/* Bars */}
        {[58, 92, 70, 130, 104, 158, 122].map((h, i) => (
          <rect
            key={i}
            x={84 + i * 34}
            y={232 - h}
            width="22"
            height={h}
            rx="4"
            fill={i === 5 ? "url(#pi-teal)" : "oklch(0.585 0.12 191)"}
            opacity={i === 5 ? 1 : 0.45}
            className="pi-anim"
            style={{
              transformOrigin: `${95 + i * 34}px 232px`,
              animation: "pi-bar 1.4s ease-out",
              animationDelay: `${i * 0.08}s`,
              animationFillMode: "both",
            }}
          />
        ))}
        {/* Trend line */}
        <path
          d="M 95 196 L 129 168 L 163 184 L 197 124 L 231 142 L 265 90 L 299 122"
          fill="none"
          stroke="oklch(0.82 0.14 70)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [95, 196],
          [129, 168],
          [163, 184],
          [197, 124],
          [231, 142],
          [265, 90],
          [299, 122],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="oklch(0.82 0.14 70)" />
        ))}
      </g>
    </IllustrationShell>
  );
}
