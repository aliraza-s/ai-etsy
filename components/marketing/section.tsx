import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  containerClassName,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={cn("py-12 sm:py-16 lg:py-20", className)}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  icon,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  /** Optional Lucide icon shown above the eyebrow — adds visual anchor. */
  icon?: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {icon && (
        <span className="bg-primary/10 text-primary ring-primary/20 mb-4 inline-flex size-10 items-center justify-center rounded-xl ring-1">
          {icon}
        </span>
      )}
      {eyebrow && (
        <p className="text-primary inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wider uppercase">
          <span
            aria-hidden
            className="from-primary/0 via-primary/60 to-primary/0 h-px w-6 bg-gradient-to-r"
          />
          {eyebrow}
          <span
            aria-hidden
            className="from-primary/0 via-primary/60 to-primary/0 h-px w-6 bg-gradient-to-r"
          />
        </p>
      )}
      <h2 className="text-foreground mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed text-balance sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
