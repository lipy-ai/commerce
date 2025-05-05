import * as React from "react";

import { cn } from "@web-ui/lib/utils";

function Textarea({
  className,
  noStyle,
  ...props
}: React.ComponentProps<"textarea"> & { noStyle?: boolean }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-background focus-within:border-ring focus-within:ring-ring flex items-center overflow-hidden rounded-md border focus-within:outline-none focus-within:ring-1 p-2",
        noStyle && "border-none bg-transparent rounded-none",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
