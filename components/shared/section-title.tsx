import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({ title, subtitle, centered = false, className }: SectionTitleProps) {
  return (
    <div className={cn("mb-10 md:mb-14", centered && "text-center", className)}>
      <div className={cn("flex flex-col", centered ? "items-center" : "items-start")}>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h2>
        <div className="section-divider" />
      </div>
      {subtitle && (
        <p className={cn("text-lg text-muted-foreground max-w-3xl mt-4", centered && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
