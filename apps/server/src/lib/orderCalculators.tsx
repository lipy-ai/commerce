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
  const itemsTotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const maxItemsTotal = items.reduce(
    (sum, item) => sum + (item.maxPrice ?? item.price) * item.qty,
    0
  );

  let maxDiscountTotal = 0;
  let discountTotal = 0;
  const maxTaxTotal = 0;
  let taxTotal = 0;

  for (const d of discounts) {
    let maxAmount = Number(d.amount);
    let amount = Number(d.amount);

    if (d.sum === "percent") {
      amount = (itemsTotal * amount) / 100;
      maxAmount = (maxItemsTotal * amount) / 100;
    }

    discountTotal = discountTotal + amount;
    maxDiscountTotal = maxDiscountTotal + maxAmount;
  }

  for (const t of taxes) {
    let maxAmount = Number(t.amount);
    let amount = Number(t.amount);
    if (t.sum === "percent") {
      amount = (itemsTotal * amount) / 100;
      maxAmount = (maxItemsTotal * amount) / 100;
    }
    maxDiscountTotal = maxTaxTotal + maxAmount;
    taxTotal = taxTotal + amount;
  }

  const totalAmount = itemsTotal + taxTotal - discountTotal;
  const maxTotalAmount = maxItemsTotal + maxTaxTotal - maxDiscountTotal;

  return {
    itemTotalAmount: itemsTotal,
    maxItemTotalAmount: maxItemsTotal,
    totalDiscountAmount: discountTotal,
    totalTaxAmount: taxTotal,
    totalAmount,
    amountSaved: maxTotalAmount - totalAmount,
  };
}
