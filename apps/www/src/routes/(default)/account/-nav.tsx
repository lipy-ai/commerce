import { env } from "@envClient";
import { authClient } from "@lipy/lib/providers/auth";
import SettingsCard from "@lipy/web-ui/components/custom-ui/settingsCard";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { shareContent } from "@lipy/web-ui/lib/share";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Info,
  LogOut,
  MapPin,
  Share2,
  ShoppingBag,
  Store,
  UserCircle2,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

const yourInfo = [
  {
    icon: ShoppingBag,
    title: "Your Orders",
    url: "/account/orders",
  },
  {
    icon: UserCircle2,
    title: "Profile",
    url: "/account/profile",
  },
  {
    icon: MapPin,
    title: "Saved Addresses",
    url: "/account/addresses",
  },
];

const moreInfo: {
  title: string;
  icon: any;
  url?: string;
  type?: "link" | "button";
  handleFunction?: () => Promise<string>;
}[] = [
  {
    title: "Start your own shop",
    icon: Store,
    url: env.MERCHANT_URL,
    type: "link",
  },
  {
    title: "Share the app",
    icon: Share2,
    type: "button",
    handleFunction: () =>
      shareContent({
        title: "Lipy Commerce",
        text: "Hey, Check out this app!",
        url: env.WEB_URL,
      }),
  },
  {
    title: "General Info",
    icon: Info,
    url: "/",
    type: "link",
  },
  {
    title: "Logout",
    icon: LogOut,
    url: "/logout",
    type: "link",
  },
];
export function AccountNav({ children }: { children?: ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const { isMobile } = useViewport();
  if (isPending) return <Spinner />;

  const filteredMoreInfo = data
    ? moreInfo
    : moreInfo.filter((item) => item.title !== "Logout");

  if (children && isMobile)
    return <div className="flex flex-1 flex-col">{children}</div>;

  return (
    <div className="flex flex-1 ">
      <div className="flex-1 md:max-w-md border-r ">
        <div
          className={cn(
            "p-4 md:p-8 space-y-8 sticky md:top-28 ",
            !children && "max-w-2xl border-r-0"
          )}
        >
          {data ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarImage
                    src={data?.user.image || ""}
                    alt={data.user.name}
                  />
                  <AvatarFallback className="bg-secondary/20">
                    <UserRound className="size-12 fill-secondary text-secondary mt-3" />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-xl font-semibold ">
                    {data?.user.name || "Hello, User"}
                  </h1>
                  <p className="text-muted-foreground ">
                    {data?.user.email || ""}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Your Information</Label>
                <SettingsCard items={yourInfo} />
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-4">
              <h1 className="font-bold text-xl"> Hi 👋</h1>
              <p className="text-muted-foreground font-normal">
                Discover and shop from your favorite local businesses online.
                Join our community today and support local commerce.
              </p>
              <Link
                to="/login"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "flex items-center justify-between"
                )}
              >
                Log In / Sign up
                <ChevronRight />
              </Link>
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-base">General</Label>
            <SettingsCard items={filteredMoreInfo} />
          </div>
        </div>
      </div>
      {children && (
        <div className="flex-1 flex flex-col bg-card">{children}</div>
      )}
    </div>
  );
}
