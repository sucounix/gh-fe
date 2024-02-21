import { trendAnalysisReportChartItem } from "../view-report/dummy-data/ViewReportDummyData";
import { isAstraButtonEnabled } from "./Helper";

describe("isAstraButtonEnabled", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('should return false if item type is "chart" and chart_item is not valid', () => {
    const item = {
      type: "chart",
      chart_item: {
        is_valid: false,
      },
    };

    expect(isAstraButtonEnabled(item)).toBe(false);
  });

  it('should return true if item type is "chart" and chart_item type is "breakeven" and breakeven exists', () => {
    const item = {
      type: "chart",
      chart_item: {
        is_valid: true,
        type: "breakeven",
        value: {
          data: {
            revenue: 66000000.0,
            total_cost: 32421253.37,
            fixed_cost: 3495003.37,
            contribution_margin: 56.17234848484849,
            margin_of_safety: 59778071.48130416,
            display_message: false,
          },
        },
      },
    };
    expect(isAstraButtonEnabled(item)).toBe(true);
  });

  it('should return false if item type is "chart" and chart_item type is "breakeven" and breakeven does not exist', () => {
    const item = {
      type: "chart",
      chart_item: {
        is_valid: true,
        type: "breakeven",
        value: {
          data: { revenue: 0 },
        },
      },
    };

    expect(isAstraButtonEnabled(item)).toBe(false);
  });

  it('should return true if item type is "chart" and chart_item type is "waterfall" and rows length is greater than 0', () => {
    const item = {
      type: "chart",
      chart_item: {
        is_valid: true,
        type: "waterfall",
        value: {
          data: {
            rows: [1, 2, 3],
          },
        },
      },
    };

    expect(isAstraButtonEnabled(item)).toBe(true);
  });

  it('should return false if item type is "chart" and chart_item type is "waterfall" and rows length is 0', () => {
    const item = {
      type: "chart",
      chart_item: {
        is_valid: true,
        type: "waterfall",
        value: {
          data: {
            rows: [],
          },
        },
      },
    };

    expect(isAstraButtonEnabled(item)).toBe(false);
  });

  it("should return true if item is chart and type not breakeven or waterfall and valid", () => {
    expect(isAstraButtonEnabled(trendAnalysisReportChartItem)).toBe(true);
  });

  it('should return false if item type is "table" and table_item is not valid', () => {
    const item = {
      type: "table",
      table_item: {
        is_valid: false,
      },
    };

    expect(isAstraButtonEnabled(item)).toBe(false);
  });

  it('should return true if item type is "table" and table_item rows length is greater than 0', () => {
    const item = {
      type: "table",
      table_item: {
        is_valid: true,
        value: {
          rows: [1, 2, 3],
        },
      },
    };

    expect(isAstraButtonEnabled(item)).toBe(true);
  });

  it('should return false if item type is "table" and table_item rows length is 0', () => {
    const item = {
      type: "table",
      table_item: {
        is_valid: true,
        value: {
          rows: [],
        },
      },
    };

    expect(isAstraButtonEnabled(item)).toBe(false);
  });

  it("should return true for any other item type", () => {
    const item = {
      type: "other",
    };

    expect(isAstraButtonEnabled(item)).toBe(true);
  });
});
