import { handleCurrencySymbol } from "./handleCurrency";

export const renderUnit = (type, currencyCode) => {
  if (type === "Monetary") return handleCurrencySymbol(currencyCode);
  if (type === "Percentage") return "%";
  return "";
};
