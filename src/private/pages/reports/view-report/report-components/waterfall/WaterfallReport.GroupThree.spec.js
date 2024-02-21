import React from "react";
import { render, screen } from "@testing-library/react";
import WaterfallReport from "./WaterfallReport";

const mockChartData = {
  chart_item: {
    title: "Test Waterfall Report",
    frequency_period: "month",
    period: "January 2023",
    params: {
      view_name: "Cash Flow (CFO - CFI - CFF)",
    },
    value: {
      data: {
        rows: [
          { category: "Net Income", value: 1000 },
          { category: "Depreciation", value: 200 },
          { category: "Change in Accounts Receivable", value: -100 },
          { category: "Change in Accounts Payable", value: 50 },
          { category: "Cash from Operations", value: 1150 },
          { category: "Capital Expenditures", value: -300 },
          { category: "Net Free Cash Flow", value: 850 },
        ],
      },
    },
  },
};

it("should render the waterfall report with Cash Flow (CFO - CFI - CFF) chart", () => {
  render(<WaterfallReport item={mockChartData} />);

  const headerTitle = screen.getByTestId("header-title-id");
  const headerSubtitle = screen.getByTestId("header-subtitle-id");
  const waterfallChart = screen.getByRole("img");

  expect(headerTitle).toBeInTheDocument();
  expect(headerSubtitle).toBeInTheDocument();
  expect(waterfallChart).toBeInTheDocument();
});

it("should render the waterfall report with Uses & Sources of Cash Flow chart", () => {
  const mockChartDataWithUsesSourcesView = {
    ...mockChartData,
    chart_item: {
      ...mockChartData.chart_item,
      params: {
        view_name: "Uses & Sources of Cash Flow",
      },
    },
  };

  render(<WaterfallReport item={mockChartDataWithUsesSourcesView} />);

  const headerTitle = screen.getByTestId("header-title-id");
  const headerSubtitle = screen.getByTestId("header-subtitle-id");
  const waterfallChart = screen.getByRole("img");

  expect(headerTitle).toBeInTheDocument();
  expect(headerSubtitle).toBeInTheDocument();
  expect(waterfallChart).toBeInTheDocument();
});

it("should render the waterfall report with Net free cash flow chart", () => {
  const mockChartDataWithNetFreeCashFlowView = {
    ...mockChartData,
    chart_item: {
      ...mockChartData.chart_item,
      params: {
        view_name: "Net free cash flow",
      },
    },
  };

  render(<WaterfallReport item={mockChartDataWithNetFreeCashFlowView} />);

  const headerTitle = screen.getByTestId("header-title-id");
  const headerSubtitle = screen.getByTestId("header-subtitle-id");
  const waterfallChart = screen.getByRole("img");

  expect(headerTitle).toBeInTheDocument();
  expect(headerSubtitle).toBeInTheDocument();
  expect(waterfallChart).toBeInTheDocument();
});

it("should render an empty view when there is no data", () => {
  const mockChartDataWithEmptyData = {
    ...mockChartData,
    chart_item: {
      ...mockChartData.chart_item,
      value: {
        data: {
          rows: [],
        },
      },
    },
  };

  render(<WaterfallReport item={mockChartDataWithEmptyData} />);

  const emptyView = screen.getByRole("img");

  expect(emptyView).toBeInTheDocument();
});
