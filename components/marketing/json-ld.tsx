export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // SECURITY: this content is built from our own data files at build time —
      // never from user input — so dangerouslySetInnerHTML is safe here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
