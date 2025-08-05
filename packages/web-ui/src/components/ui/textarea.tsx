import { cn } from "@lipy/web-ui/lib/utils";
import type * as React from "react";
export type TextareaProps = React.ComponentProps<"textarea"> & {
  noStyle?: boolean;
  size?: "sm" | "default";
};
function Textarea({ className, noStyle, size, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input text-base bg-background focus-within:border-ring focus-within:ring-ring flex items-center overflow-hidden rounded-md border focus-within:outline-none focus-within:ring-1 p-2",
        noStyle && "border-none bg-transparent rounded-none",
        size === "sm" && "text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
