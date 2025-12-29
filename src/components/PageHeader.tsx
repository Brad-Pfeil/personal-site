import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  subtitle,
  right,
  className
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white/95 md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">{subtitle}</p> : null}
      </div>
      {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
    </div>
  );
}


