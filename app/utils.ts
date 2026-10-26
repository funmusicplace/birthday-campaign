export const formatCurrency = (amount: number, currency?: string) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    trailingZeroDisplay: "stripIfInteger",
  });
};
