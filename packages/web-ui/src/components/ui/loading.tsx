import { cn } from "@lipy/web-ui/lib/utils";

export default function Loading({
  title = "",
  description = "",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "m-auto flex flex-1 flex-col space-y-1 items-center justify-center lg:min-h-[calc(100vh-160px)] ",
        className
      )}
    >
      {title && <h1 className="text-xl font-medium">{title}</h1>}
      {description && (
        <h1 className="text-md text-muted-foreground">{description}</h1>
      )}
      <div className="loader" />
    </div>
  );
}
