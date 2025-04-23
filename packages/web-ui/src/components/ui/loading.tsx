import { cn } from "@web-ui/lib/utils";

export default function Loading({
  title = "Loading...",
  description = "Hold tight, we're processing your request.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "m-auto flex flex-1 flex-col items-center justify-center",
        className
      )}
    >
      <h1 className="text-xl font-medium">{title}</h1>
      <h1 className="text-md text-muted-foreground">{description}</h1>
      <div className="loader" />
    </div>
  );
}
