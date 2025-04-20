import { type ReactNode } from "react";

import { cn } from "@web-ui/lib/utils";

export const DashboardBody = ({
  children,
  className,
  noPadding,
}: {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}) => {
  return (
    <div className={cn("flex-1 flex flex-col", noPadding && "p-0", className)}>
      {children}
    </div>
  );
};
