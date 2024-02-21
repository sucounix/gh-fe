import hrn from "hrn";

export const humanReadableNumber = (number) => {
  return `${hrn(number, 2, ["KMBTPEZY".split(""), 1e3])}`;
};
