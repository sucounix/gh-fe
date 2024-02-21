import currencies from "./currencies.json";

export const handleCurrencySymbol = (code) => {
  let targetCurrency = currencies.find((currency) => currency.code === code);
  return targetCurrency.symbol;
};

export const handleCurrencyPrecision = (code) => {
  let targetCurrency = currencies.find((currency) => currency.code === code);
  return targetCurrency.decimalDigits;
};
