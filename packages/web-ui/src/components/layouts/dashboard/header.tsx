"use client";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export const DashboardHeader = ({
  title,
  children,
  titleChildren,
  hideBackBtn,
  className,
}: {
  title?: string;
  children?: ReactNode;
  titleChildren?: ReactNode;
  className?: string;
  hideBackBtn?: boolean;
}) => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const onBack = (e: any) => {
    e.preventDefault();
    canGoBack ? router.history.back() : router.navigate({ to: "/" });
    return false;
  };

  return (
    <div className="sticky top-0 z-5 bg-background print:hidden">
      <div
        className={cn(
          "flex justify-between gap-4 w-full p-3 items-center bg-card lg:bg-accent/30 h-14 border-b",
          className
        )}
      >
        <div className="flex items-center flex-shrink min-w-0 gap-2">
          {!hideBackBtn && (
            <Link
              to={"/"}
              onClick={onBack}
              viewTransition={{ types: ["slide-right"] }}
            >
              <ArrowLeft className="stroke-2" />
            </Link>
          )}

          <div className="flex items-center min-w-0 gap-2">
            <h1 className="font-semibold text-lg lg:text-xl leading-none py-2 truncate">
              {title}
            </h1>
            {titleChildren}
          </div>
        </div>

        <div className="flex-1 flex justify-end gap-4">{children}</div>
      </div>
    </div>
  );
};
