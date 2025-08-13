import type { DBTypes } from "@/db";
import type { SUM_TYPE } from "@/db/schema";

type Coupon = DBTypes["coupons"];
type Discount = Array<{
  name: string;
  amount: number;
  sum: (typeof SUM_TYPE)[number];
}>;
export const couponCalculator = (coupons: Coupon[]) => {
  const discounts: Discount = [];

  for (const coupon of coupons) {
    if (coupon.type === "amount-off") {
      discounts.push({
        name: coupon.title,
        amount: coupon?.discountValue,
        sum: coupon.discountType,
      } as Discount[0]);
    }
  }

  return discounts;
};
