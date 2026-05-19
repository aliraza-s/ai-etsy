import type { Metadata } from "next";
import { TitleGeneratorClient } from "./client";

export const metadata: Metadata = { title: "Title Generator" };

export default function Page() {
  return <TitleGeneratorClient />;
}
