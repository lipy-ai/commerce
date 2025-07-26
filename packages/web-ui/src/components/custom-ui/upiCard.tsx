import { Button } from "@lipy/web-ui/components/ui/button";
import { CopyButton } from "@lipy/web-ui/components/ui/copy-button";
import { Label } from "@lipy/web-ui/components/ui/label";
import { cn } from "@lipy/web-ui/lib/utils";
import { Info } from "lucide-react";

import QRCode from "react-qr-code";

export function UPIQRCode({
  upi,
  name,
  className,
}: {
  upi: string;
  name: string;
  className?: string;
}) {
  const val = `upi://pay?pa=${upi}&pn=${name}`;
  return (
    <div
      className={cn(
        "bg-card p-8 overflow-hidden border drop-shadow-xs rounded w-fit flex flex-col justify-center items-center space-y-4 m-auto transition-all",
        className
      )}
    >
      <img src="/assets/upi-bhim.svg" alt="Upi" width={150} />

      <div className="relative">
        <QRCode
          title={name}
          value={val}
          level="H"
          className={cn("transition-all w-full", !upi && "blur")}
        />
        {!upi && (
          <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-all">
            <Button
              variant={"outline"}
              size={"sm"}
              className="rounded-full w-fit text-sm text-muted-foreground"
            >
              <Info className="size-4" />
              <span>No UPI</span>
            </Button>
          </span>
        )}
      </div>

      <div className={cn("text-center transition-all", !upi && "hidden")}>
        <Label className="flex items-center gap-1 text-muted-foreground">
          {upi}
          <CopyButton value={val} />
        </Label>
        <p className="text-base">{name}</p>
      </div>
    </div>
  );
}
