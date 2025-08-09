import { env } from "@envClient";
import type { merchantStoreApi } from "@lipy/lib/api";
import { useStore } from "@lipy/lib/hooks/use-store";
import SettingsCard from "@lipy/web-ui/components/custom-ui/settingsCard";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@lipy/web-ui/components/ui/dialog";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import type { InferResponseType } from "hono/client";
import {
  Landmark,
  QrCode,
  ScrollText,
  Store,
  Tag,
  UserCircle2,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import QRCode from "react-qr-code";

const generalInfo = [
  {
    title: "General Info",
    icon: UserCircle2,
    url: "/store/general",
  },
  {
    title: "Staff",
    icon: Users,
    url: "/store/staff",
  },
  {
    title: "Policies",
    icon: ScrollText,
    url: "/store/policies",
  },
  {
    title: "Payments",
    icon: Landmark,
    url: "/store/payments",
  },
  {
    title: "Coupons",
    icon: Tag,
    url: "/store/coupons",
  },
];

type Response = InferResponseType<typeof merchantStoreApi.index.$get>;
export function StoreNav({ children }: { children?: ReactNode }) {
  const { data, isPending } = useStore();
  const { isMobile } = useViewport();
  if (isPending) return <Spinner />;

  if (children && isMobile)
    return <div className="p-4 bg-card  flex-1">{children}</div>;

  return (
    <div className="flex flex-1 ">
      <div className="flex-1 md:max-w-sm border-r min-h-screen">
        <div
          className={cn(
            "px-4 py-4 md:py-8 space-y-8 sticky top-10 ",
            !children && "max-w-2xl border-r-0"
          )}
        >
          {data && (
            <div className="flex items-center gap-4 p-2">
              {/* <Avatar className="size-16 rounded-full">
                <AvatarImage src={data?.image || ""} alt={data.name} />
                <AvatarFallback className="">
                  <Store width={30} height={30} strokeWidth={1.5} />
                </AvatarFallback>
              </Avatar> */}

              <ShopQr data={data} />

              <div>
                <h1 className="font-semibold text-xl">
                  {data?.name || "Hello, User"}
                </h1>
                <p className="text-muted-foreground">
                  {data?.email || data?.phone}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2 max-w-2xl w-full">
            <SettingsCard items={generalInfo} />
          </div>
        </div>
      </div>
      {children && (
        <div className="flex-1 flex flex-col bg-card p-8">{children}</div>
      )}
    </div>
  );
}

const ShopQr = ({ data }: { data: Response }) => {
  return (
    <Dialog>
      <DialogTrigger className="relative">
        <Avatar className="size-16 rounded-full">
          <AvatarImage src={data?.image || ""} alt={data.name} />
          <AvatarFallback className="">
            <Store width={30} height={30} strokeWidth={1.5} />
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0  rounded-full p-0.5 border-2 border-background bg-tertiary">
          <QrCode />
        </div>
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <div className="flex items-center gap-2 justify-center">
          <Avatar className="size-8 rounded-full">
            <AvatarImage src={data?.image || ""} alt={data.name} />
            <AvatarFallback className="">
              <Store />
            </AvatarFallback>
          </Avatar>
          <h1 className="font-semibold text-lg">{data?.name}</h1>
        </div>

        <QRCode value={`${env.WEB_URL}/${data?.handle}`} className="w-full" />
        <DialogFooter>
          <a
            href={`${env.WEB_URL}/${data?.handle}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs"
          >
            {`${env.WEB_URL}/${data?.handle}`}
          </a>
          <p className="text-center "> Scan the QR to start shopping</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
