import hrn from "hrn";

export const humanReadableNumberOneDecimal = (number) => {
  return `${hrn(number, 1, ["KMBTPEZY".split(""), 1e3])}`;
};
