"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/**
 * Renders a Lottie animation from `/public/lottie/<src>.json` when present;
 * otherwise renders the SVG `fallback`. Existing SVG illustrations keep working
 * out of the box — drop a Lottie JSON file at the expected path to upgrade.
 *
 * The fetch result is cached in a module-level map so each path only loads once
 * per page session.
 *
 * Conventions:
 * - Place JSON files at `public/lottie/<name>.json`
 * - Pass `src="/lottie/hero.json"` here
 * - 404 / parse errors silently fall back to the SVG component
 */
const cache = new Map<string, object | null>();

export function LottieOrFallback({
  src,
  fallback,
  className,
  loop = true,
  autoplay = true,
}: {
  src: string;
  fallback: ReactNode;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}) {
  const [data, setData] = useState<object | null | undefined>(() =>
    cache.has(src) ? cache.get(src) : undefined,
  );
  const cancelled = useRef(false);

  useEffect(() => {
    if (cache.has(src)) return;
    cancelled.current = false;
    (async () => {
      try {
        const res = await fetch(src, { cache: "force-cache" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = (await res.json()) as object;
        cache.set(src, json);
        if (!cancelled.current) setData(json);
      } catch {
        cache.set(src, null);
        if (!cancelled.current) setData(null);
      }
    })();
    return () => {
      cancelled.current = true;
    };
  }, [src]);

  // First render before fetch resolves: show fallback so there's no layout shift.
  if (data === undefined || data === null) {
    return <>{fallback}</>;
  }

  return (
    <div className={className} aria-hidden>
      <Lottie animationData={data} loop={loop} autoplay={autoplay} />
    </div>
  );
}
