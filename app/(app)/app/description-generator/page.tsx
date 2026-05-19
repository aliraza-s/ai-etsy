import type { Metadata } from "next";
import { DescriptionGeneratorClient } from "./client";

export const metadata: Metadata = { title: "Description Generator" };

export default function Page() {
  return <DescriptionGeneratorClient />;
}
