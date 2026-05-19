import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Prose } from "@/components/blog/prose";
import { JsonLd } from "@/components/marketing/json-ld";
import { Cta } from "@/components/marketing/cta";
import { Section } from "@/components/marketing/section";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { BLOG_POSTS, BLOG_BY_SLUG, relatedBlogPosts } from "@/lib/content/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_BY_SLUG[slug];
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE.url}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_BY_SLUG[slug];
  if (!post) notFound();

  const related = relatedBlogPosts(slug, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${SITE.url}/blog/${post.slug}/opengraph-image`,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/icon` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}` },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <JsonLd
        data={[
          articleSchema,
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden /> All posts
        </Link>

        <header className="mt-8">
          <ul className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
            <li>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </li>
            <li aria-hidden>·</li>
            <li className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden /> {post.readingMinutes} min read
            </li>
            <li aria-hidden>·</li>
            <li className="inline-flex items-center gap-1.5">
              <User className="size-3.5" aria-hidden /> {post.author}
            </li>
          </ul>
          <h1 className="text-foreground mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="bg-muted text-muted-foreground rounded px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase"
              >
                {tag}
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-10">
          <Prose>{post.body}</Prose>
        </div>

        <footer className="border-border/60 mt-16 border-t pt-6 text-sm">
          <p className="text-muted-foreground">
            Published {formatDate(post.date)} by {post.author}.{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Spot an error or have a question? Tell us.
            </Link>
          </p>
        </footer>
      </article>

      {related.length > 0 && (
        <Section className="py-12 sm:py-16">
          <h2 className="text-muted-foreground mb-6 font-mono text-xs font-medium tracking-wider uppercase">
            Keep reading
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="border-border bg-card hover:border-primary/40 group block h-full rounded-xl border p-5 transition-colors"
                >
                  <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                    {formatDate(r.date)} · {r.readingMinutes} min
                  </p>
                  <h3 className="text-foreground group-hover:text-primary mt-2 text-base leading-snug font-semibold transition-colors">
                    {r.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section className="py-12 sm:py-16">
        <Cta
          title={
            <>
              Try the tools
              <br className="hidden sm:block" /> the post talks about
            </>
          }
          body="Free tier, 15 credits/month, no credit card. Most posts on this blog reference at least one tool — sign in and try them on a real listing."
          primary={{ href: "/signin", label: "Get started — it's free" }}
          secondary={{ href: "/tools", label: "Browse the toolkit" }}
          trustSignals={["No Etsy API", "No card required", "Cancel any time"]}
        />
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
