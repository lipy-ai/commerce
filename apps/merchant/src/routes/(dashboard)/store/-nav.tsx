import { env } from "@envClient";
import { useStore } from "@lipy/lib/hooks/use-store";
import SettingsCard from "@lipy/web-ui/components/custom-ui/settingsCard";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
import { CopyButton } from "@lipy/web-ui/components/ui/copy-button";
import { Dialog, DialogContent } from "@lipy/web-ui/components/ui/dialog";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import {
  Landmark,
  QrCode,
  ScrollText,
  Share2,
  Store,
  Tag,
  UserCircle2,
  Users,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import QRCode from "react-qr-code";

export function StoreNav({ children }: { children?: ReactNode }) {
  const { data, isPending } = useStore();
  const { isMobile } = useViewport();
  const [open, setOpen] = useState(false);
  if (isPending) return <Spinner />;

  if (children && isMobile)
    return <div className="p-4 bg-card  flex-1">{children}</div>;

  const generalInfo: Parameters<typeof SettingsCard>[0]["items"] = [
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
    {
      title: "Share Your Store",
      type: "button",
      icon: Share2,
      handleFunction: () => setOpen(true),
    },
  ];

  return (
    <div className="flex flex-1 ">
      <div className="flex-1 md:max-w-sm border-r min-h-screen">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <StoreShareCard />
          </DialogContent>
        </Dialog>
        <div
          className={cn(
            "px-4 py-4 md:py-8 space-y-8 sticky top-10 ",
            !children && "max-w-2xl border-r-0"
          )}
        >
          {data && (
            <div className="flex items-center gap-4 p-2">
              <div className="relative">
                <Avatar
                  className="size-14 rounded-full"
                  onClick={() => setOpen(true)}
                >
                  <AvatarImage src={data?.image || ""} alt={data.name} />
                  <AvatarFallback className="">
                    <Store width={30} height={30} strokeWidth={1.5} />
                  </AvatarFallback>
                </Avatar>
                <Button
                  className="absolute right-0 bottom-0"
                  size={"icon-xs"}
                  onClick={() => setOpen(true)}
                >
                  <QrCode />
                </Button>
              </div>
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

export const StoreShareCard = () => {
  const { data } = useStore();
  return (
    <div className="border flex flex-col justify-center items-center rounded-lg bg-card space-y-4 py-8">
      <div className="flex items-center gap-2 justify-center">
        <Avatar className="size-8 rounded-full">
          <AvatarImage src={data?.image || ""} alt={data?.name} />
          <AvatarFallback className="">
            <Store />
          </AvatarFallback>
        </Avatar>
        <h1 className="font-semibold text-lg">{data?.name}</h1>
      </div>
      <QRCode
        value={`${env.WEB_URL}/share?sid=${data?.id}`}
        className="w-full"
      />
      <div className="text-center w-full">
        <div className="flex gap-1 items-center justify-center">
          <a
            href={`${env.WEB_URL}/${data?.handle}`}
            target="_blank"
            rel="noreferrer"
            className="line-clamp-1 max-w-54"
          >
            {`${env.WEB_URL}/${data?.handle}`}
          </a>
          <CopyButton value={`${env.WEB_URL}/${data?.handle}`} />
        </div>
        <p className="font-semibold">Store QR Code</p>
      </div>
    </div>
  );
};
