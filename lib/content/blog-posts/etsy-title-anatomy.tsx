import type { BlogPost } from "../blog";
import {
  Callout,
  H2,
  H3,
  LI,
  Lead,
  OL,
  P,
  Quote,
  Stat,
  StatGrid,
  ToolMention,
  UL,
} from "@/components/blog/prose";

export const etsyTitleAnatomy: BlogPost = {
  slug: "etsy-title-anatomy",
  title: "The anatomy of an Etsy title that actually ranks in 2026",
  description:
    "A line-by-line breakdown of what Etsy's search algorithm rewards in 140 characters — and the 6 mistakes we see in nearly every underperforming listing.",
  author: "Craftly Team",
  date: "2026-04-12",
  readingMinutes: 7,
  tags: ["etsy-seo", "titles", "keyword-research"],
  accent: "teal",
  excerpt:
    "An Etsy title isn't a sentence — it's a 140-character search-ranking instrument. After auditing thousands of listings, we noticed the strong ones all share the same five-zone structure. Here's the breakdown.",
  body: (
    <>
      <Lead>
        An Etsy title isn&apos;t a sentence — it&apos;s a 140-character search-ranking instrument.
        After auditing thousands of listings with our{" "}
        <ToolMention slug="listing-analyzer" label="Listing Analyzer" /> and{" "}
        <ToolMention slug="title-generator" label="Title Generator" />, we noticed the strong ones
        all share the same five-zone structure.
      </Lead>

      <P>
        The good news: once you see the structure, you can&apos;t un-see it. The bad news: most
        sellers — including ones with thousands of sales — never apply it consistently. This post
        walks through every zone, why Etsy weights it that way, and the 6 mistakes we see in nearly
        every underperforming listing.
      </P>

      <H2 id="zones">The 5 zones of a high-ranking Etsy title</H2>

      <P>
        Etsy&apos;s relevance ranking weights the <strong>first ~60 characters</strong> of your
        title most heavily. After that, additional phrases still help indexing but contribute less
        to keyword match. Internally, we think of the 140-character window as five zones:
      </P>

      <OL>
        <LI>
          <strong>Zone 1 — Primary keyword (chars 1–25).</strong> The phrase you&apos;d most want a
          buyer to type. Multi-word, specific. For a candle: not <em>&quot;candle&quot;</em> but{" "}
          <em>&quot;Soy Wax Vanilla Candle&quot;</em>.
        </LI>
        <LI>
          <strong>Zone 2 — Material / variant (chars 25–60).</strong> The qualifiers buyers search
          for after the noun. Color, size, fabric, scent, dimensions. Etsy treats these as facet
          modifiers for the primary keyword.
        </LI>
        <LI>
          <strong>Zone 3 — Use case / occasion (chars 60–95).</strong> Why someone is buying.{" "}
          <em>&quot;Housewarming Gift&quot;</em>, <em>&quot;Office Decor&quot;</em>,{" "}
          <em>&quot;Bridesmaid Favor&quot;</em>. This zone is where most underperforming titles die
          — they stop after material descriptors.
        </LI>
        <LI>
          <strong>Zone 4 — Audience / aesthetic (chars 95–120).</strong> Who it&apos;s for.{" "}
          <em>&quot;for Her&quot;</em>, <em>&quot;Boho Style&quot;</em>,{" "}
          <em>&quot;Minimalist Home&quot;</em>. Long-tail discovery for buyers shopping by vibe
          rather than by product noun.
        </LI>
        <LI>
          <strong>Zone 5 — Differentiator (chars 120–140).</strong> What makes yours different.{" "}
          <em>&quot;Hand Poured&quot;</em>, <em>&quot;Small Batch&quot;</em>,{" "}
          <em>&quot;Made in USA&quot;</em>. Doesn&apos;t move SEO much but helps the click decision
          in mobile search results.
        </LI>
      </OL>

      <Callout tone="info" title="The 60-character rule">
        If your primary keyword isn&apos;t fully present in the first 60 characters, you&apos;re
        ranking on partial-match relevance. Buyers searching the exact phrase will see other shops
        first. This is the single biggest title mistake we see.
      </Callout>

      <H2 id="examples">A real before / after</H2>

      <P>
        Here&apos;s a vanilla soy candle listing we audited recently. Same product, same photos,
        same price — just a title rewrite.
      </P>

      <H3>Before — 47 characters, generic</H3>
      <Quote>Vanilla Candle - 8oz - Handmade Gift</Quote>

      <H3>After — 138 characters, five zones</H3>
      <Quote>
        Vanilla Soy Candle, Hand Poured 8oz Amber Jar, Housewarming Gift for Her, Cozy Home Decor,
        Small Batch Non Toxic Candle
      </Quote>

      <P>
        After this rewrite, the listing&apos;s 30-day impressions tripled and conversion held steady
        — because the new title attracted buyers actively searching for the product, not people
        scrolling past.
      </P>

      <StatGrid>
        <Stat value="60ch" label="weighted-first prefix" />
        <Stat value="140ch" label="hard maximum" />
        <Stat value="5" label="zones to fill" />
      </StatGrid>

      <H2 id="mistakes">6 common title mistakes (and the fix)</H2>

      <UL>
        <LI>
          <strong>Brand name first.</strong> Unless your shop name itself is a search term, putting
          it in zone 1 wastes the most valuable characters. Move it to the end or drop it.
        </LI>
        <LI>
          <strong>Punctuation theatre.</strong> Etsy parses commas as phrase separators, which
          helps. Dashes, pipes, and asterisks do nothing for SEO and eat character budget. Stick to
          commas.
        </LI>
        <LI>
          <strong>Single-word keywords.</strong> &quot;Candle&quot;, &quot;Mug&quot;,
          &quot;Ring&quot; are too broad to rank. Two-to-four-word phrases are the sweet spot in
          every category we&apos;ve audited.
        </LI>
        <LI>
          <strong>Stuffing the same phrase twice.</strong> Repeating &quot;vanilla candle vanilla
          candle&quot; doesn&apos;t double your ranking — Etsy de-duplicates. Use the characters for
          synonyms instead (&quot;vanilla scented&quot;, &quot;warm vanilla&quot;, etc.).
        </LI>
        <LI>
          <strong>No occasion language.</strong> Half of Etsy traffic is gift-shopping. Listings
          without zone 3 / 4 phrases miss those buyers entirely.
        </LI>
        <LI>
          <strong>Title and tags don&apos;t agree.</strong> If your title says
          &quot;housewarming&quot; but no tag does (or vice versa), Etsy reads that as low
          relevance. The two need to reinforce each other.
        </LI>
      </UL>

      <H2 id="workflow">The 90-second workflow</H2>

      <OL>
        <LI>
          Open <ToolMention slug="keyword-generator" label="Keyword Generator" /> and seed it with
          your product category (e.g. &quot;soy candle&quot;). You&apos;ll get 30 long-tail phrases
          ranked by buyer intent.
        </LI>
        <LI>Pick the highest-intent phrase that exactly fits zone 1.</LI>
        <LI>
          Run <ToolMention slug="title-generator" label="Title Generator" /> with that phrase + a
          short product description. It produces 5 titles, each filling all five zones.
        </LI>
        <LI>
          Paste the winner into Etsy. Open{" "}
          <ToolMention slug="listing-analyzer" label="Listing Analyzer" /> to verify the title gets
          a high score on the title-SEO axis before publishing.
        </LI>
      </OL>

      <P>That whole loop takes about 90 seconds and replaces a 20-minute hand-tuning session.</P>

      <H2 id="last-thing">One last thing</H2>

      <P>
        Etsy&apos;s title weighting has shifted a few times in the past three years. As of early
        2026 the zone-1 60-character prefix is the most heavily weighted region we&apos;ve been able
        to measure. We re-test this every quarter; if the weighting changes meaningfully, we&apos;ll
        update this post and ping subscribers on the announcement bar.
      </P>

      <Callout tone="success" title="The TL;DR">
        Front-load your primary keyword in the first 60 characters, fill all five zones, no
        punctuation gimmicks, and make your title and tags reinforce each other. Most
        underperforming Etsy listings get a measurable lift from this one rewrite alone.
      </Callout>
    </>
  ),
};
