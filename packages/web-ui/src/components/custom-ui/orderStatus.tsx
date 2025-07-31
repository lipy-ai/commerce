import type { ORDER_STATUS } from "@lipy/server/db/schema";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { useViewport } from "@lipy/web-ui/contexts/viewport";

export function OrderStatus({
  status,
  size,
}: {
  status: (typeof ORDER_STATUS)[number];
  size?: "sm" | "default" | "lg";
}) {
  const { isMobile } = useViewport();
  return (
    <Badge
      className="capitalize w-fit"
      size={size ? size : isMobile ? "default" : "lg"}
      variant={
        status === "created" ||
        status === "awaiting_customer_confirmation" ||
        status === "packed" ||
        status === "out_for_delivery" ||
        status === "return_requested"
          ? "warning"
          : status === "refunded" || status === "replaced"
            ? "info"
            : status === "canceled"
              ? "destructive"
              : "success"
      }
      appearance={"outline"}
    >
      {status?.replaceAll("_", " ")}
    </Badge>
  );
}
