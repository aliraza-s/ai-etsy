import type { Metadata } from "next";
import { TagGeneratorClient } from "./client";

export const metadata: Metadata = { title: "Tag Generator" };

export default function Page() {
  return <TagGeneratorClient />;
}
