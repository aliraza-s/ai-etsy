import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "./section";
import { DefinitionBlock } from "./definition-block";
import { HowItWorks } from "./how-it-works";
import { FeatureGrid } from "./feature-grid";
import { Faq } from "./faq";
import { Cta } from "./cta";
import { RelatedTools } from "./related-tools";
import { ComparisonTable } from "./comparison-table";
import { SITE } from "@/lib/seo/site";
import { relatedTools, type ToolMeta } from "@/lib/content/tools";
import type { ToolPageContent } from "@/lib/content/tool-pages";

/**
 * The marketing sections rendered below the hero on every tool page.
 * The hero is page-specific (it may embed a live tool), so it lives in the page.
 */
export function ToolMarketingSections({
  tool,
  content,
}: {
  tool: ToolMeta;
  content: ToolPageContent;
}) {
  const isFree = tool.category === "free";
  const trustSignals = isFree
    ? ["100% free", "No signup required", "No credit card"]
    : [
        `${tool.credits} ${tool.credits === 1 ? "credit" : "credits"} per run`,
        "Free plan available",
        "Cancel anytime",
      ];

  return (
    <>
      <Section>
        <DefinitionBlock
          heading={content.definition.heading}
          definition={content.definition.body}
          stats={content.definition.stats}
        />
      </Section>

      <Section className="bg-secondary/30">
        <SectionHeader eyebrow="Who it's for" title={`The ${tool.name} is built for…`} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {content.personas.map((persona) => (
            <li
              key={persona.title}
              className="border-border bg-card text-card-foreground rounded-xl border p-6"
            >
              <h3 className="text-foreground text-base font-semibold">{persona.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{persona.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="How it works"
          title={`How to use the ${tool.name}`}
          description="Three steps. Under 30 seconds end-to-end."
        />
        <div className="mt-12 sm:mt-16">
          <HowItWorks
            steps={content.steps.map((s, i) => ({
              title: `${i + 1}. ${s.title}`,
              body: s.body,
            }))}
          />
        </div>
      </Section>

      <Section className="bg-secondary/30">
        <SectionHeader eyebrow="Before / After" title="Real input, real output" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          <ExampleCard label={content.example.before.label} lines={content.example.before.lines} />
          <ExampleCard
            label={content.example.after.label}
            lines={content.example.after.lines}
            highlight
          />
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Features"
          title={`What makes ${SITE.name}'s ${tool.name} different`}
        />
        <div className="mt-12">
          <FeatureGrid features={content.features} />
        </div>
      </Section>

      <Section className="bg-secondary/30">
        <SectionHeader
          eyebrow="Comparison"
          title={`${SITE.name} vs the alternatives`}
          description="How this tool compares to doing it manually or using a generic AI chatbot."
        />
        <div className="mx-auto mt-12 max-w-4xl">
          <ComparisonTable
            columns={[
              { label: SITE.name, highlight: true },
              { label: "Manual / spreadsheets" },
              { label: "Generic ChatGPT" },
            ]}
            rows={content.comparison.rows}
          />
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="FAQ" title={`${tool.name} questions, answered`} />
        <div className="mx-auto mt-12 max-w-3xl">
          <Faq items={content.faq} />
        </div>
      </Section>

      <Section className="bg-secondary/30">
        <SectionHeader
          eyebrow="Related tools"
          title="Pair it with another Craftly tool"
          description="Most sellers use generators together — tags + titles + descriptions are a workflow, not a single step."
        />
        <div className="mt-12">
          <RelatedTools
            tools={relatedTools(tool.slug).map((t) => ({
              href: `/tools/${t.slug}`,
              title: t.name,
              body: t.tagline,
            }))}
          />
        </div>
      </Section>

      <Section>
        <Cta
          title={
            isFree
              ? `Use the ${tool.name} free — no signup`
              : `Try the ${tool.name} on the free plan`
          }
          body={
            isFree
              ? "Open the tool, paste your input, get your answer. No card, no email, no fuss."
              : `15 credits a month on the free plan — that covers about ${Math.floor(15 / Math.max(tool.credits, 1))} runs of this tool.`
          }
          primary={{
            href: "/signin",
            label: isFree ? "Open the tool" : "Start free",
          }}
          secondary={{ href: "/tools", label: "See all tools" }}
          trustSignals={trustSignals}
        />
      </Section>
    </>
  );
}

function ExampleCard({
  label,
  lines,
  highlight,
}: {
  label: string;
  lines: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "border-primary/40 bg-card text-card-foreground rounded-xl border p-6"
          : "border-border bg-card text-card-foreground rounded-xl border p-6"
      }
    >
      <p className="text-muted-foreground font-mono text-xs font-medium tracking-wider uppercase">
        {label}
      </p>
      <ul className="mt-3 space-y-1.5">
        {lines.map((line, i) => (
          <li
            key={i}
            className={
              highlight
                ? "bg-primary/10 text-foreground rounded px-2 py-1 font-mono text-sm"
                : "text-foreground font-mono text-sm"
            }
          >
            {line}
          </li>
        ))}
      </ul>
      {highlight && (
        <Link
          href="/signin"
          className="text-primary mt-5 inline-flex items-center gap-1 text-xs font-medium"
        >
          Try it on your listing
          <ArrowRight className="size-3" aria-hidden />
        </Link>
      )}
    </div>
  );
}
