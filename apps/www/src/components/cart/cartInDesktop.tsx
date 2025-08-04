import { Button } from "@lipy/web-ui/components/ui/button";
import { CardTitle } from "@lipy/web-ui/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@lipy/web-ui/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { CartMainContent } from "@/routes/(default)/cart";
import { useCartStore } from "./store";
export function CartInDesktop() {
  const { cart } = useCartStore();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <ShoppingCart className="size-8" />
          <p className="font-medium text-base">{cart.length} items</p>
        </Button>
      </SheetTrigger>

      <SheetContent
        className="overflow-y-auto min-w-[500px] z-500"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <SheetHeader className="bg-card sticky top-0 z-10 border-b">
          <CardTitle className="text-xl font-bold">Your cart</CardTitle>
        </SheetHeader>
        <CartMainContent />
      </SheetContent>
    </Sheet>
  );
}
