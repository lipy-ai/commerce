import { authClient } from "@lipy/lib/providers/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import {
  Headset,
  LogOut,
  Settings2,
  Share2,
  Store,
  UserCircle2,
  Users,
} from "lucide-react";

import SettingsCard from "@lipy/web-ui/components/custom-ui/settingsCard";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import type { ReactNode } from "react";

const generalInfo = [
  {
    title: "Profile",
    icon: UserCircle2,
    url: "/account/profile",
  },
  {
    title: "My Store",
    icon: Store,
    url: "/store",
  },
  {
    title: "Store Staff",
    icon: Users,
    url: "/store/staff",
  },
  {
    title: "Preferences",
    icon: Settings2,
    url: "/account/preferences",
  },
];

const moreInfo = [
  {
    title: "Refer and Earn",
    icon: Share2,
    url: "/account/referral",
  },
  {
    title: "Customer Support",
    icon: Headset,
    url: "/account/support",
  },
  {
    title: "Logout",
    icon: LogOut,
    url: "/logout",
  },
];

export function AccountNav({ children }: { children?: ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const { isMobile } = useViewport();
  if (isPending) return <Spinner />;

  if (children && isMobile) return <div className="p-4">{children}</div>;

  return (
    <div className="flex flex-1">
      <div
        className={cn(
          "max-w-sm px-4 py-8 space-y-8 border-r flex-1 min-h-screen",
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
          <SettingsCard items={moreInfo} />
        </div>
      </div>
      {children && (
        <div className="flex-1 flex flex-col p-4 p-8 bg-card">{children}</div>
      )}
    </div>
  );
}
