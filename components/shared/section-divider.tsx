import { cn } from "@/lib/utils";

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex items-center justify-center py-8", className)}>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}
