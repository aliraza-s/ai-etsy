import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import { Section } from "@/components/marketing/section";
import { JsonLd } from "@/components/marketing/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { BLOG_POSTS } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: `Field-tested tactics for Etsy sellers — title structure, tag strategy, listing diagnostics. From the ${SITE.name} team.`,
  alternates: {
    canonical: `${SITE.url}/blog`,
    types: { "application/rss+xml": `${SITE.url}/blog/feed.xml` },
  },
  openGraph: {
    title: `Blog — ${SITE.name}`,
    description: "Field-tested tactics for Etsy sellers.",
    url: `${SITE.url}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  const [featured, ...rest] = posts;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />

      <Section className="pt-16 pb-8 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-primary font-mono text-xs font-medium tracking-wider uppercase">
            Blog
          </p>
          <h1 className="text-foreground mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Field-tested Etsy SEO, written by people who run shops.
          </h1>
          <p className="text-muted-foreground mt-4 text-base text-balance sm:text-lg">
            Specific tactics, not generic advice. Updated as the platform changes.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/blog/feed.xml"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
            >
              <Rss className="size-3.5" aria-hidden /> RSS feed
            </Link>
          </div>
        </div>
      </Section>

      {featured && (
        <Section className="py-8 sm:py-12">
          <Link
            href={`/blog/${featured.slug}`}
            className="border-border bg-card hover:border-primary/40 group grid items-stretch gap-0 overflow-hidden rounded-2xl border lg:grid-cols-[1.3fr_1fr]"
          >
            <div className="p-8 sm:p-10">
              <p className="text-primary font-mono text-xs font-medium tracking-wider uppercase">
                Featured · {formatDate(featured.date)}
              </p>
              <h2 className="text-foreground group-hover:text-primary mt-3 text-2xl font-semibold tracking-tight transition-colors sm:text-3xl">
                {featured.title}
              </h2>
              <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                {featured.excerpt}
              </p>
              <p className="text-muted-foreground mt-5 inline-flex items-center gap-2 font-mono text-xs">
                {featured.readingMinutes} min read · by {featured.author}
                <ArrowRight className="text-primary size-3.5" aria-hidden />
              </p>
            </div>
            <div
              className={`hidden items-center justify-center p-8 lg:flex ${
                featured.accent === "amber"
                  ? "from-accent/20 via-card to-accent/5 bg-gradient-to-br"
                  : "from-primary/20 via-card to-primary/5 bg-gradient-to-br"
              }`}
            >
              <span className="text-muted-foreground/40 font-mono text-7xl font-bold">
                {String(BLOG_POSTS.length - posts.indexOf(featured)).padStart(2, "0")}
              </span>
            </div>
          </Link>
        </Section>
      )}

      <Section className="py-8 sm:py-12">
        <h2 className="text-muted-foreground mb-6 font-mono text-xs font-medium tracking-wider uppercase">
          More posts
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {rest.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="border-border bg-card hover:border-primary/40 group block h-full rounded-xl border p-6 transition-colors"
              >
                <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                  {formatDate(post.date)} · {post.readingMinutes} min
                </p>
                <h3 className="text-foreground group-hover:text-primary mt-2 text-lg leading-snug font-semibold transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{post.excerpt}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <li
                      key={tag}
                      className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
