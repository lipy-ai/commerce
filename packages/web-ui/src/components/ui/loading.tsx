import { cn } from "@web-ui/lib/utils";

export default function Loading({
  title = "Loading...",
  description = "Hold tight, we're processing your request.",
  className,
  hideDefault = false,
}: {
  title?: string;
  description?: string;
  className?: string;
  hideDefault?: boolean;
}) {
  return (
    <div
      className={cn(
        "m-auto flex flex-1 flex-col space-y-1 items-center justify-center",
        className
      )}
    >
      {!hideDefault && <h1 className="text-xl font-medium">{title}</h1>}
      {!hideDefault && (
        <h1 className="text-md text-muted-foreground">{description}</h1>
      )}
      <div className="loader" />
    </div>
  );
}
