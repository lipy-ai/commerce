/**
 * Format an amount with currency symbol and remove decimal if it's .00.
 *
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR').
 * @param {number} amount - The amount to format.
 * @returns {string} - The formatted amount as a string.
 */
export const formatAmount = (
  currency: string,
  amount: number,
  opts?: { fractionDigits?: number }
): string => {
  // Use Intl.NumberFormat to format the amount with the specified currency
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency: currency || "USD",
    minimumFractionDigits: opts?.fractionDigits || (amount % 1 !== 0 ? 2 : 0), // Set minimumFractionDigits based on whether there's a decimal part
  })
    .format(amount)
    .replace(/-/, "- ")

  return formattedAmount
}

export const currencySymbol = (currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  })
    .formatToParts(1)
    .find((part) => part.type === "currency")?.value
}
