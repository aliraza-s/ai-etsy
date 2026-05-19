import { cn } from "@/lib/utils";
import { LottieOrFallback } from "./lottie-or-fallback";

const COMMON_STYLES = `
  @keyframes step-fade-up { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
  @keyframes step-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes step-blink { 0%,55%,100% { opacity: 1; } 60%,95% { opacity: 0; } }
  @keyframes step-cursor { 0%,100% { transform: translateX(0); } 50% { transform: translateX(34px); } }
  @keyframes step-check { 0% { stroke-dashoffset: 24; } 100% { stroke-dashoffset: 0; } }
  @media (prefers-reduced-motion: reduce) { .step-anim { animation: none !important; } }
`;

function StepShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full max-w-[180px]", className)} aria-hidden>
      <style>{COMMON_STYLES}</style>
      <svg viewBox="0 0 200 200" className="h-full w-full">
        {children}
      </svg>
    </div>
  );
}

/** Step 1 — Paste your listing */
export function StepPaste({ className }: { className?: string }) {
  return (
    <LottieOrFallback
      src="/lottie/step-paste.json"
      className={cn("relative aspect-square w-full max-w-[180px]", className)}
      fallback={<StepPasteSvg className={className} />}
    />
  );
}

function StepPasteSvg({ className }: { className?: string }) {
  return (
    <StepShell className={className}>
      <rect
        x="32"
        y="36"
        width="136"
        height="128"
        rx="10"
        fill="var(--card)"
        stroke="var(--border)"
      />
      <rect
        x="44"
        y="50"
        width="60"
        height="6"
        rx="3"
        fill="var(--muted-foreground)"
        opacity="0.5"
      />
      <rect
        x="44"
        y="62"
        width="112"
        height="4"
        rx="2"
        fill="var(--muted-foreground)"
        opacity="0.3"
      />
      <rect
        x="44"
        y="72"
        width="96"
        height="4"
        rx="2"
        fill="var(--muted-foreground)"
        opacity="0.3"
      />
      <rect
        x="44"
        y="82"
        width="104"
        height="4"
        rx="2"
        fill="var(--muted-foreground)"
        opacity="0.3"
      />

      {/* Typing cursor */}
      <g className="step-anim" style={{ animation: "step-cursor 2s ease-in-out infinite" }}>
        <rect
          x="44"
          y="104"
          width="2"
          height="14"
          fill="oklch(0.585 0.12 191)"
          className="step-anim"
          style={{ animation: "step-blink 1.2s ease-in-out infinite" }}
        />
      </g>
      <rect
        x="50"
        y="106"
        width="34"
        height="10"
        rx="2"
        fill="oklch(0.585 0.12 191)"
        opacity="0.18"
      />

      {/* Paste icon corner */}
      <g transform="translate(140,130)">
        <rect x="0" y="0" width="20" height="22" rx="3" fill="oklch(0.77 0.16 70)" opacity="0.18" />
        <rect
          x="4"
          y="-3"
          width="12"
          height="5"
          rx="1.5"
          fill="oklch(0.77 0.16 70)"
          opacity="0.4"
        />
        <rect x="4" y="6" width="12" height="2" rx="1" fill="oklch(0.77 0.16 70)" />
        <rect x="4" y="10" width="8" height="2" rx="1" fill="oklch(0.77 0.16 70)" />
        <rect x="4" y="14" width="10" height="2" rx="1" fill="oklch(0.77 0.16 70)" />
      </g>
    </StepShell>
  );
}

/** Step 2 — AI generates */
export function StepGenerate({ className }: { className?: string }) {
  return (
    <LottieOrFallback
      src="/lottie/step-generate.json"
      className={cn("relative aspect-square w-full max-w-[180px]", className)}
      fallback={<StepGenerateSvg className={className} />}
    />
  );
}

function StepGenerateSvg({ className }: { className?: string }) {
  return (
    <StepShell className={className}>
      <defs>
        <linearGradient id="ai-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.585 0.12 191)" />
          <stop offset="100%" stopColor="oklch(0.77 0.16 70)" />
        </linearGradient>
      </defs>

      <circle
        cx="100"
        cy="100"
        r="56"
        fill="url(#ai-glow)"
        opacity="0.18"
        className="step-anim"
        style={{
          transformOrigin: "100px 100px",
          animation: "step-pulse 2.4s ease-in-out infinite",
        }}
      />
      <circle cx="100" cy="100" r="38" fill="url(#ai-glow)" opacity="0.35" />

      {/* Sparkle */}
      <g
        className="step-anim"
        style={{
          transformOrigin: "100px 100px",
          animation: "step-pulse 1.6s ease-in-out infinite",
        }}
      >
        <path
          d="M100 78 L106 94 L122 100 L106 106 L100 122 L94 106 L78 100 L94 94 Z"
          fill="var(--background)"
        />
      </g>

      {/* Small sparkles */}
      <circle
        cx="60"
        cy="58"
        r="3"
        fill="oklch(0.77 0.16 70)"
        className="step-anim"
        style={{ animation: "step-blink 1.8s ease-in-out infinite" }}
      />
      <circle
        cx="150"
        cy="138"
        r="2.5"
        fill="oklch(0.585 0.12 191)"
        className="step-anim"
        style={{ animation: "step-blink 2.2s ease-in-out infinite", animationDelay: "-0.6s" }}
      />
      <circle
        cx="148"
        cy="62"
        r="2"
        fill="oklch(0.77 0.16 70)"
        className="step-anim"
        style={{ animation: "step-blink 2s ease-in-out infinite", animationDelay: "-1s" }}
      />
    </StepShell>
  );
}

/** Step 3 — Copy and rank */
export function StepRank({ className }: { className?: string }) {
  return (
    <LottieOrFallback
      src="/lottie/step-rank.json"
      className={cn("relative aspect-square w-full max-w-[180px]", className)}
      fallback={<StepRankSvg className={className} />}
    />
  );
}

function StepRankSvg({ className }: { className?: string }) {
  return (
    <StepShell className={className}>
      <rect
        x="36"
        y="44"
        width="128"
        height="112"
        rx="10"
        fill="var(--card)"
        stroke="var(--border)"
      />

      {/* Bar chart */}
      <rect
        x="56"
        y="120"
        width="14"
        height="22"
        rx="2"
        fill="oklch(0.585 0.12 191)"
        opacity="0.4"
      />
      <rect
        x="78"
        y="106"
        width="14"
        height="36"
        rx="2"
        fill="oklch(0.585 0.12 191)"
        opacity="0.6"
      />
      <rect
        x="100"
        y="86"
        width="14"
        height="56"
        rx="2"
        fill="oklch(0.585 0.12 191)"
        opacity="0.8"
      />
      <rect
        x="122"
        y="64"
        width="14"
        height="78"
        rx="2"
        fill="oklch(0.585 0.12 191)"
        className="step-anim"
        style={{
          transformOrigin: "129px 142px",
          animation: "step-fade-up 1.6s ease-out infinite alternate",
        }}
      />

      {/* Trend arrow */}
      <path
        d="M52 132 L74 116 L96 96 L118 76 L138 60"
        fill="none"
        stroke="oklch(0.77 0.16 70)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="120"
        strokeDashoffset="0"
        className="step-anim"
        style={{ animation: "step-check 3s ease-in-out infinite alternate" }}
      />
      <circle cx="138" cy="60" r="4" fill="oklch(0.77 0.16 70)" />
    </StepShell>
  );
}
