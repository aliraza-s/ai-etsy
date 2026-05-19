import type { Metadata } from "next";
import { KeywordGeneratorClient } from "./client";

export const metadata: Metadata = { title: "Keyword Generator" };

export default function Page() {
  return <KeywordGeneratorClient />;
}
