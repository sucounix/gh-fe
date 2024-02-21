import { getActualYearOfPeriod } from "./getActualYearOfPeriod";

describe("getActualYearOfPeriod", () => {
  const timeframe = [
    {
      year: "2021",
      annual: [
        { status: "enabled" },
        { status: "disabled" },
        { status: "enabled" },
      ],
      "semi-annual": [
        { status: "disabled" },
        { status: "enabled" },
        { status: "enabled" },
      ],
      quarterly: [
        { name: "Q1" },
        { name: "Q2" },
        { name: "Q3" },
        { name: "Q4" },
      ],
    },
    {
      year: "2022",
      annual: [
        { status: "enabled" },
        { status: "disabled" },
        { status: "enabled" },
      ],
      "semi-annual": [
        { status: "enabled" },
        { status: "disabled" },
        { status: "enabled" },
      ],
      quarterly: [
        { name: "Q1" },
        { name: "Q2" },
        { name: "Q3" },
        { name: "Q4" },
      ],
    },
  ];

  it("should return the actual year when frequency_period is 'annual'", () => {
    const newValues = {
      year_range: "2022",
      frequency_period: "annual",
    };

    const actualYear = getActualYearOfPeriod(newValues, timeframe);

    expect(actualYear).toEqual({ status: "enabled" });
  });

  it("should return the actual year when frequency_period is not 'annual'", () => {
    const newValues = {
      year_range: "2022",
      frequency_period: "quarterly",
      period: "Q3",
    };

    const actualYear = getActualYearOfPeriod(newValues, timeframe);

    expect(actualYear).toEqual({ name: "Q3" });
  });

  it("should return the last enabled year from semi-annual when frequency_period is 'annual' and semi-annual data exists", () => {
    const newValues = {
      year_range: "2021",
      frequency_period: "annual",
    };

    const actualYear = getActualYearOfPeriod(newValues, timeframe);

    expect(actualYear).toEqual({ status: "enabled" });
  });

  it("should return the year when frequency_period is 'annual' and year_range does not include slash", () => {
    const newValues = {
      year_range: "2021",
      frequency_period: "annual",
    };

    const actualYear = getActualYearOfPeriod(newValues, timeframe);

    expect(actualYear).toEqual({ status: "enabled" });
  });
});
