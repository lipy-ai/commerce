import { env } from "@envClient";
import { merchantStoreApi } from "@lipy/lib/api";
import { useStore } from "@lipy/lib/hooks/use-store";
import {
  apiQueryOptions,
  useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import SettingsCard from "@lipy/web-ui/components/custom-ui/settingsCard";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { CopyButton } from "@lipy/web-ui/components/ui/copy-button";
import { Dialog, DialogContent } from "@lipy/web-ui/components/ui/dialog";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { Switch } from "@lipy/web-ui/components/ui/switch";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { getStoreStatus } from "@lipy/web-ui/lib/helper";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Download,
  Landmark,
  QrCode,
  ScrollText,
  Share2,
  Store,
  Tag,
  UserCircle2,
  Users,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

export function StoreNav({ children }: { children?: ReactNode }) {
  const { data, isPending, isFetching } = useStore();
  const { isMobile } = useViewport();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const updateMutation = useAPIMutation(merchantStoreApi.index, "$patch", {
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: apiQueryOptions(merchantStoreApi.index, "$get", {}).queryKey,
      });
      toast.success("Status updated");
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data) {
      const { isOpen } = getStoreStatus(
        data.openingHour,
        data.closingHour,
        data.status
      );
      setIsStoreOpen(isOpen);
    }
  }, [isFetching]);

  const onSubmit = async (json: any) => {
    await updateMutation.mutateAsync({ json });
  };

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
          <DialogContent className="p-0">
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
            <div className="flex items-start gap-4 bg-card -mx-4 -mt-8 px-4 py-8 justify-between border-b">
              <div>
                <h1 className="font-semibold text-xl">
                  {data?.name || "Hello, User"}
                </h1>
                <p className="text-muted-foreground">{data?.email || ""}</p>
                <p className="pt-2">{data?.phone}</p>
              </div>

              <div className="relative">
                <Avatar
                  className="size-20 rounded-full"
                  onClick={() => setOpen(true)}
                >
                  <AvatarImage src={data?.image || ""} alt={data.name} />
                  <AvatarFallback className="bg-background">
                    <Store width={36} height={36} strokeWidth={1.5} />
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    isStoreOpen ? "bg-green-500 " : "bg-muted-foreground",
                    "absolute top-2 right-2 w-3 h-3  rounded-full ring ring-card"
                  )}
                ></div>
                <Button
                  className="absolute right-0 bottom-0 rounded-full"
                  size={"icon-sm"}
                  onClick={() => setOpen(true)}
                >
                  <QrCode />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-w-2xl w-full">
            <Card className="rounded-xl border border-border/20 shadow-xs">
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {isStoreOpen ? "Close" : "Open"} store
                    </p>
                    <p className="text-muted-foreground">
                      You can change the status anytime.
                    </p>
                  </div>

                  <Switch
                    checked={isStoreOpen}
                    onCheckedChange={(v) => {
                      onSubmit({ status: v ? "open" : "closed" });
                    }}
                    className="cursor-pointer"
                    disabled={updateMutation.isPending}
                  />
                </div>
              </CardContent>
            </Card>
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

  const handleDownload = () => {
    const svg = document.getElementById("qrCodeId") as SVGSVGElement | null;
    if (!svg) return;

    const exportSize = 1024; // target size for downloaded image
    const padding = 40; // padding around QR in the final PNG

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const img = new Image();
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = exportSize + padding * 2;
      canvas.height = exportSize + padding * 2;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image scaled to 1024×1024 inside the padding
        ctx.drawImage(img, padding, padding, exportSize, exportSize);

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = (data?.name || "my-shop") + ".png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="flex flex-col justify-center items-center bg-card space-y-4 py-8">
      <div className="flex items-center gap-2 justify-center">
        <Avatar className="size-8 rounded-full">
          <AvatarImage src={data?.image || ""} alt={data?.name} />
          <AvatarFallback>
            <Store />
          </AvatarFallback>
        </Avatar>
        <h1 className="font-semibold text-lg">{data?.name}</h1>
      </div>

      {/* Render QR as SVG (default) */}
      <QRCode
        id="qrCodeId"
        value={`${env.WEB_URL}/share?sid=${data?.id}`}
        size={200}
      />

      <div className="text-center w-full">
        <div className="flex gap-1 items-center justify-center">
          <a
            href={`${env.WEB_URL}/share?sid=${data?.id}`}
            target="_blank"
            rel="noreferrer"
            className="line-clamp-1 max-w-54"
          >
            {`${env.WEB_URL}/share?sid=${data?.id}`}
          </a>
          <CopyButton value={`${env.WEB_URL}/share?sid=${data?.id}`} />
        </div>
        <div className="flex items-center gap-2 justify-center">
          <p className="font-semibold">Store QR Code</p>
          <Button size="icon" variant="ghost" onClick={handleDownload}>
            <Download />
          </Button>
        </div>
      </div>
    </div>
  );
};
