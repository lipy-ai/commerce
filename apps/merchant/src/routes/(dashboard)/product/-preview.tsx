import type { merchantProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { DrawerDialogSwitcher } from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { cn } from "@lipy/web-ui/lib/utils";
import type { InferResponseType } from "hono/client";
import { useState } from "react";

type Response = InferResponseType<
  typeof merchantProductApi.index.$get
>["items"][0]["products"][0];

export function ProductPreview({
  product,
  children,
}: {
  product: Response;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <DrawerDialogSwitcher
        open={open}
        onOpenChange={setOpen}
        trigger={children}
        className="max-h-[65%]"
      >
        <img
          src={product.thumbnail || "/assets/placeholder-image.svg"}
          className="w-full h-54 object-contain  rounded-xl bg-accent"
          alt={product.title || ""}
        />

        <p className="text-xl font-semibold pt-4">{product.title}</p>

        <p>{product.summary}</p>

        {product.variants && product.variants.length > 0 && (
          <Card className="border-2 rounded-xl my-8">
            <CardHeader className="bg-background -m-4 p-4 border-b rounded-t-xl">
              <CardTitle>Variants ({product.variants.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 py-3">
              {product.variants.map((v) => (
                <div key={v.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{v.unit}</p>

                    <p
                      className={cn(
                        v.inStock ? "text-green-600" : "text-destructive"
                      )}
                    >
                      {v.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>

                  <p className="font-medium">
                    {formatAmount("inr", v?.price || 0)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </DrawerDialogSwitcher>
    </div>
  );
}
