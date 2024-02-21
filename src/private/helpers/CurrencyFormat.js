import {
  handleCurrencyPrecision,
  handleCurrencySymbol,
} from "./handleCurrency";

export const formatCurrency = (number, currencyCode) => {
  if (number === null || number === 0 || number === "-") return "-";
  if (number < 0)
    return `(${handleCurrencySymbol(currencyCode)} ${new Intl.NumberFormat(
      `en`,
      {
        maximumFractionDigits: handleCurrencyPrecision(currencyCode),
        minimumFractionDigits: handleCurrencyPrecision(currencyCode),
        currencySign: "accounting",
      }
    ).format(Math.abs(number))})`;
  return `${handleCurrencySymbol(currencyCode)} ${new Intl.NumberFormat(`en`, {
    maximumFractionDigits: handleCurrencyPrecision(currencyCode),
    minimumFractionDigits: handleCurrencyPrecision(currencyCode),
    currencySign: "accounting",
  }).format(number)}`;
};
