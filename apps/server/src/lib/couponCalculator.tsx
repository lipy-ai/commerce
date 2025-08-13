import type { DBTypes } from "@/db";
import type { SUM_TYPE } from "@/db/schema";

type Coupon = DBTypes["coupons"];
type Discount = Array<{
  name: string;
  amount: number;
  sum: (typeof SUM_TYPE)[number];
}>;
export const couponCalculator = (
  coupons: Coupon[],
  itemsTotalAmount?: number,
  deliveryFee?: number
) => {
  const discounts: Discount = [];

  for (const coupon of coupons) {
    if (coupon.type === "amount-off") {
      if (
        itemsTotalAmount &&
        coupon.minimumOrderValue &&
        itemsTotalAmount >= coupon.minimumOrderValue
      ) {
        discounts.push({
          name: coupon.title,
          amount: coupon?.discountValue,
          sum: coupon.discountType,
        } as Discount[0]);
      }
    }

    if (coupon.type === "free-delivery") {
      if (
        deliveryFee &&
        coupon.minimumOrderValue &&
        itemsTotalAmount &&
        itemsTotalAmount >= coupon.minimumOrderValue
      ) {
        deliveryFee = 0;
      }
    }
  }

  return { discounts, deliveryFee };
};
