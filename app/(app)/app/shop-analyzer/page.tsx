import type { Metadata } from "next";
import { ShopAnalyzerClient } from "./client";

export const metadata: Metadata = { title: "Shop Analyzer" };

export default function Page() {
  return <ShopAnalyzerClient />;
}
