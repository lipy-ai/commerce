import { authClient } from "@lipy/lib/providers/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Settings2, UserCircle2, Users } from "lucide-react";

import SettingsCard from "@lipy/web-ui/components/custom-ui/settingsCard";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import type { ReactNode } from "react";

const generalInfo = [
  {
    title: "General Info",
    icon: UserCircle2,
    url: "/store/general",
  },
  {
    title: "Store Policies",
    icon: Settings2,
    url: "/store/policies",
  },
  {
    title: "Store Discounts",
    icon: Settings2,
    url: "/store/discounts",
  },
  {
    title: "Store Taxes",
    icon: Settings2,
    url: "/store/taxes",
  },
  {
    title: "Store Staff",
    icon: Users,
    url: "/store/staff",
  },
];

export function StoreNav({ children }: { children?: ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const { isMobile } = useViewport();
  if (isPending) return <Spinner />;

  if (children && isMobile) return children;

  return (
    <div className="flex flex-1">
      <div
        className={cn(
          "max-w-sm px-4 py-8 space-y-8 border-r flex-1",
          !children && "max-w-2xl border-r-0"
        )}
      >
        {data && (
          <div className="flex items-center gap-4 p-2">
            <Avatar className="size-12 rounded">
              <AvatarImage src={data?.user.image || ""} alt="" />
              <AvatarFallback className="">
                <UserCircle2 width={40} height={75} strokeWidth={1.5} />
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold text-xl">
                {data?.user.name || "Hello, User"}
              </h1>
              <p className="text-muted-foreground text-base">
                {data?.user.email || ""}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2 max-w-2xl w-full">
          <SettingsCard items={generalInfo} />
        </div>
      </div>
      {children && <div className="flex-1 flex flex-col">{children}</div>}
    </div>
  );
}
