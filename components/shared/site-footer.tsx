import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Craftly";

const FOOTER_GROUPS = [
  {
    heading: "Tools",
    links: [
      { href: "/tools/tag-generator", label: "Tag Generator" },
      { href: "/tools/title-generator", label: "Title Generator" },
      { href: "/tools/keyword-generator", label: "Keyword Generator" },
      { href: "/tools/description-generator", label: "Description Generator" },
      { href: "/tools/listing-analyzer", label: "Listing Analyzer" },
      { href: "/tools/shop-analyzer", label: "Shop Analyzer" },
    ],
  },
  {
    heading: "Free",
    links: [
      { href: "/tools/fee-calculator", label: "Fee Calculator" },
      { href: "/tools/events-calendar", label: "Events Calendar" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/refund-policy", label: "Refund Policy" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-border/60 bg-background mt-24 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-foreground mb-3 text-sm font-semibold">{group.heading}</h3>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="border-border/60 text-muted-foreground mt-10 border-t pt-6 text-xs">
          &copy; {new Date().getFullYear()} {APP_NAME}. Not affiliated with, endorsed by, or
          sponsored by Etsy, Inc. &quot;Etsy&quot; is a trademark of Etsy, Inc.
        </p>
      </div>
    </footer>
  );
}
