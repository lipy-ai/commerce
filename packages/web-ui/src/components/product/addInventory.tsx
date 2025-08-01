import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Button } from "../ui/button";
import type { ProductType, ValueType } from "./productCard";
// import { DrawerDialogHeader, DrawerDialogSwitcher, DrawerDialogTitle } from "../custom-ui/drawerDialogSwitcher";
// import { formatAmount } from "@lipy/lib/utils/intl";

export function AddInventory({
  variant,
  product,
  setterValue,
  setterFn,
}: {
  variant?: "primary" | "primary-active";
  product: ProductType;
  setterValue?: ValueType;
  setterFn?: (value: ValueType) => void;
}) {
  const { isMobile } = useViewport();
  const currentVariant = variant || "primary";
  console.log(product, setterValue, setterFn);

  switch (currentVariant) {
    case "primary":
      return (
        <Button
          size={isMobile ? "sm" : "default"}
          variant={"outline"}
          className="text-secondary border border-secondary min-w-16 hover:text-secondary border-b-2 border-r-2 font-medium"
        >
          ADD
        </Button>
      );
  }
}
