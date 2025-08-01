import type { posProductApi } from "@lipy/lib/api";
import type { InferResponseType } from "hono/client";
import { AddInventory } from "./addInventory";

export type ProductType = InferResponseType<
  typeof posProductApi.index.$get
>["items"][number];

export type ValueType = Array<{
  inventoryId: string;
  quantity: number;
}>;
export function ProductCard({
  variant,
  product,
  setterValue,
  setterFn,
}: {
  variant?: "default" | "horizontal";
  product: ProductType;
  setterValue?: ValueType;
  setterFn?: (v: ValueType) => void;
}) {
  const currentVariant = variant || "default";
  switch (currentVariant) {
    case "default":
      return (
        <div>
          <div className="relative">
            <div className="relative aspect-square">
              <img
                src={product.thumbnail ?? ""}
                alt={product.title ?? ""}
                className="size-full object-cover rounded-xl bg-accent/30"
              />
              {product?.variants[0].stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                  <span className="text-primary-foreground text-lg font-semibold">
                    Out of stock
                  </span>
                </div>
              )}

              <div className="absolute right-1 bottom-1">
                <AddInventory
                  product={product}
                  setterValue={setterValue}
                  setterFn={setterFn}
                />
              </div>
            </div>
          </div>
        </div>
      );
  }
}
