import type { Metadata } from "next";
import { ListingAnalyzerClient } from "./client";

export const metadata: Metadata = { title: "Listing Analyzer" };

export default function Page() {
  return <ListingAnalyzerClient />;
}
