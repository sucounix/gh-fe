import { formatNumber } from "./NumberFormat";

describe("formatNumber", () => {
  it("should return '-' when number is null", () => {
    const result = formatNumber(null, "USD");
    expect(result).toEqual("-");
  });

  it("should return '-' when number is 0", () => {
    const result = formatNumber(0, "USD");
    expect(result).toEqual("-");
  });

  it("should return '-' when number is '-'", () => {
    const result = formatNumber("-", "USD");
    expect(result).toEqual("-");
  });

  it("should format positive number with correct precision and accounting sign", () => {
    const result = formatNumber(1234.5678, "USD");
    expect(result).toEqual("1,234.57");
  });

  it("should format negative number with correct precision, accounting sign, and parentheses", () => {
    const result = formatNumber(-1234.5678, "USD");
    expect(result).toEqual("(1,234.57)");
  });
});
