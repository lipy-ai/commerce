import { publicShopApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import type { ReactNode } from "react";
import { StoreHeroSection } from "./-storeHeroSection";

export function StoreNav({
  children,
  storeHandle,
}: {
  children?: ReactNode;
  storeHandle: string;
}) {
  const { isMobile } = useViewport();
  const { data } = useAPIQuery(
    publicShopApi[":handle"],
    "$get",
    {
      param: { handle: storeHandle },
    },
    {
      placeholderData: (p) => p,
    }
  );

  if (children && isMobile)
    return <div className="flex-1 flex flex-col">{children}</div>;
  return (
    <div className="flex flex-1">
      <div className="flex-1 md:max-w-sm border-r">
        <div
          className={cn(
            "p-4 md:py-8 space-y-8 sticky top-28 ",
            !children && "max-w-2xl border-r-0"
          )}
        >
          {data && <StoreHeroSection storeInfo={data} />}
        </div>
      </div>
      {children && (
        <div className="flex-1 flex flex-col bg-card">{children}</div>
      )}
    </div>
  );
}
