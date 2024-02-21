import { handleCurrencyPrecision } from "./handleCurrency";

export const formatNumber = (number, currencyCode) => {
  if (number === null || number === 0 || number === "-") return "-";
  if (number < 0)
    return `(${new Intl.NumberFormat(`en`, {
      maximumFractionDigits: handleCurrencyPrecision(currencyCode),
      minimumFractionDigits: handleCurrencyPrecision(currencyCode),
      currencySign: "accounting",
    }).format(Math.abs(number))})`;

  return `${new Intl.NumberFormat(`en`, {
    maximumFractionDigits: handleCurrencyPrecision(currencyCode),
    minimumFractionDigits: handleCurrencyPrecision(currencyCode),
    currencySign: "accounting",
  }).format(number)}`;
};
