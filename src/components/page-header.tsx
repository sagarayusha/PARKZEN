import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("px-4 pt-6 pb-4 md:px-6", className)}>
      <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-muted-foreground">{description}</p>
      )}
    </header>
  );
}
