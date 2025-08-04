import type { SUM_TYPE } from "@/db/schema";
export function orderCalculator({
  items,
  discounts,
  taxes,
}: {
  items: Array<{ price: number; maxPrice?: number; qty: number }>;
  discounts: Array<{ amount: number; sum: (typeof SUM_TYPE)[number] }>;
  taxes: Array<{ amount: number; sum: (typeof SUM_TYPE)[number] }>;
}) {
  const itemTotalAmount = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const maxItemTotalAmount = items.reduce(
    (sum, item) => sum + (item.maxPrice ?? item.price) * item.qty,
    0
  );

  let totalMaxDiscountAmount = 0;
  let totalDiscountAmount = 0;
  let totalMaxTaxAmount = 0;
  let totalTaxAmount = 0;

  for (const t of taxes) {
    let maxAmount = Number(t.amount);
    let amount = Number(t.amount);
    if (t.sum === "percent") {
      amount = (itemTotalAmount * amount) / 100;
      maxAmount = (maxItemTotalAmount * maxAmount) / 100;
    }
    totalMaxTaxAmount = totalMaxTaxAmount + maxAmount;
    totalTaxAmount = totalTaxAmount + amount;
  }

  for (const d of discounts) {
    let maxAmount = Number(d.amount);
    let amount = Number(d.amount);

    if (d.sum === "percent") {
      amount = ((itemTotalAmount + totalTaxAmount) * amount) / 100;
      maxAmount = ((maxItemTotalAmount + totalMaxTaxAmount) * amount) / 100;
    }

    totalDiscountAmount = totalDiscountAmount + amount;
    totalMaxDiscountAmount = totalMaxDiscountAmount + maxAmount;
  }
  const totalAmount = itemTotalAmount + totalTaxAmount - totalDiscountAmount;
  const maxTotalAmount = maxItemTotalAmount + totalMaxTaxAmount;

  return {
    itemTotalAmount,
    maxItemTotalAmount,
    totalDiscountAmount,
    totalTaxAmount,
    totalAmount,
    amountSaved: maxTotalAmount - totalAmount,
  };
}
