import type { BlogPost } from "../blog";
import {
  Callout,
  H2,
  H3,
  LI,
  Lead,
  OL,
  P,
  Stat,
  StatGrid,
  ToolMention,
  UL,
} from "@/components/blog/prose";

export const whyListingsStall: BlogPost = {
  slug: "why-etsy-listings-stall",
  title: "Why your Etsy listing stops getting views (and the 4-step fix)",
  description:
    "Almost every Etsy listing has a 'stall pattern' — strong launch, gradual decline, then dead air. Here's what's happening, why Etsy does it, and how to break the pattern.",
  author: "Craftly Team",
  date: "2026-05-04",
  readingMinutes: 8,
  tags: ["etsy-seo", "listing-quality", "diagnostics"],
  accent: "teal",
  excerpt:
    "Almost every Etsy listing has a stall pattern: strong opening week, gradual decline, then dead air around day 60. It's not a bug — it's how Etsy's relevance system rewards freshness. Here's what's happening and the 4-step fix.",
  body: (
    <>
      <Lead>
        Almost every Etsy listing has a <strong>stall pattern</strong>: strong opening week, gradual
        decline, then near-zero impressions by day 60. It&apos;s not a bug. It&apos;s how
        Etsy&apos;s relevance ranking system rewards freshness — and once you understand the signal
        Etsy is looking for, breaking the pattern is straightforward.
      </Lead>

      <P>
        We see this in roughly 80% of the listings we audit. Sellers blame algorithm changes,
        seasonal slumps, competitor moves. Sometimes those are real. Most of the time the listing
        itself isn&apos;t sending the &quot;still relevant&quot; signals Etsy needs to keep showing
        it.
      </P>

      <H2 id="stall-pattern">The stall pattern, in numbers</H2>

      <P>The shape we see again and again, with 30-day impression counts:</P>

      <UL>
        <LI>
          <strong>Days 1–7:</strong> 200–800 impressions. Etsy is exploring — testing whether the
          listing converts, whether buyers favorite it, whether it deserves more reach.
        </LI>
        <LI>
          <strong>Days 8–30:</strong> 100–300 impressions. Initial novelty bonus fades. Etsy is now
          ranking the listing on pure relevance + conversion signals.
        </LI>
        <LI>
          <strong>Days 30–60:</strong> 20–80 impressions. The listing is competing against newer
          listings with the same keywords. If it&apos;s not converting better than they are, it
          loses position.
        </LI>
        <LI>
          <strong>Day 60+:</strong> &lt;20 impressions/day. The listing is now in the long tail —
          shown only to buyers who type extremely specific phrases that exactly match its title +
          tags.
        </LI>
      </UL>

      <StatGrid>
        <Stat value="~7d" label="opening exploration window" />
        <Stat value="~30d" label="freshness bonus half-life" />
        <Stat value="~60d" label="stall point for most listings" />
      </StatGrid>

      <H2 id="why">Why Etsy does this</H2>

      <P>
        Etsy is constantly recruiting new sellers and new listings. To do that, it has to give every
        new listing a fair shot to prove it converts — which means borrowing exposure from existing
        listings that have already had their chance. The exploration window in days 1–7 is exactly
        that. After day 30, Etsy assumes it knows your conversion rate well enough to rank you on
        relevance alone.
      </P>

      <P>
        This is fine if your conversion rate is high. It&apos;s catastrophic if your title or tags
        are just slightly off — because you&apos;ll never accumulate the impressions you need to
        improve them.
      </P>

      <H2 id="fix">The 4-step fix</H2>

      <P>
        Breaking the stall doesn&apos;t require relisting (which loses your accumulated favorites
        and reviews). It requires sending Etsy a fresh signal that the listing is still actively
        maintained.
      </P>

      <H3>1. Run a full audit before you change anything</H3>
      <P>
        Open <ToolMention slug="listing-analyzer" label="Listing Analyzer" /> with your title, tags,
        and description. The 5-axis score tells you whether the stall is a content problem (low
        title-SEO, weak tags, generic description) or a market problem (good content but saturated
        category). The fix is completely different for each, so don&apos;t skip this.
      </P>

      <H3>2. Rewrite the weakest axis only</H3>
      <P>
        Don&apos;t rewrite everything at once. You won&apos;t know which change moved the needle.
        Start with the lowest-scoring axis:
      </P>
      <UL>
        <LI>
          Low title-SEO → run <ToolMention slug="title-generator" label="Title Generator" /> with
          your existing description.
        </LI>
        <LI>
          Low tag relevance → run <ToolMention slug="tag-generator" label="Tag Generator" /> with
          your title.
        </LI>
        <LI>
          Low description quality → run{" "}
          <ToolMention slug="description-generator" label="Description Generator" /> with your
          product bullets.
        </LI>
      </UL>

      <H3>3. Edit, save, wait 7 days</H3>
      <P>
        Etsy reads the edit as a freshness signal. You get a smaller version of the days-1–7
        exploration bonus. After 7 days, check your stats. If impressions are climbing, leave it
        alone. If not, change the second-weakest axis.
      </P>

      <H3>4. Re-run the audit monthly</H3>
      <P>
        Set a recurring reminder. Markets shift, competitor titles change, seasonal phrases come and
        go. A monthly <ToolMention slug="shop-analyzer" label="Shop Analyzer" /> pass plus a
        quarterly listing-by-listing audit keeps you ahead of stalls instead of reacting to them.
      </P>

      <Callout tone="info" title="The Q4 caveat">
        From mid-October through December, the freshness signal weighs less heavily because the
        whole marketplace is in gift-shopping mode and conversion signals dominate. If your listing
        is going to stall, it usually stalls in Q1 — that&apos;s your window to fix it.
      </Callout>

      <H2 id="when-to-relist">When relisting actually makes sense</H2>

      <P>
        We&apos;re generally against full relisting because you lose social proof. But a few cases
        do justify it:
      </P>

      <OL>
        <LI>
          The listing has fewer than 10 favorites and zero reviews. You aren&apos;t losing much
          social proof, and a fresh listing benefits from the full days-1–7 exploration bonus.
        </LI>
        <LI>
          You&apos;re changing the product category or core attributes (e.g. the &quot;type&quot;
          attribute) — that&apos;s effectively a different listing anyway.
        </LI>
        <LI>
          The product itself has been substantially redesigned and the old listing&apos;s photos /
          description no longer represent it.
        </LI>
      </OL>

      <P>
        In every other case, edit-in-place is the right move. The freshness signal from an edit is
        weaker than a new listing, but you keep your favorites, reviews, and historical conversion
        data — all of which feed into your shop&apos;s overall ranking.
      </P>

      <Callout tone="success" title="The TL;DR">
        Stalls happen because Etsy&apos;s freshness bonus expires around day 30, after which you
        rank on relevance alone. Audit, fix the weakest axis, edit (don&apos;t relist), wait a week,
        repeat. Most stalled listings come back within 2–3 audit cycles.
      </Callout>
    </>
  ),
};
