import React from "react";
import { render, screen } from "@testing-library/react";
import TrendAnalysisChart from "./TrendAnalysisChart";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("TrendAnalysisChart", () => {
  const chartData = [
    { name: "Jan", value: 100 },
    { name: "Feb", value: 200 },
    { name: "Mar", value: 150 },
  ];
  const currentYAxisUnits = new Set(["Percentage", "Number"]);
  const isLine = jest.fn();
  const isShowMovingAvg = jest.fn();
  const getColor = jest.fn();

  it("renders the chart with data", () => {
    window.ResizeObserver = ResizeObserver;

    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi: {
            selectedMetricsTA: ["Revenue"],
          },
        }}
      >
        <TrendAnalysisChart
          chartData={chartData}
          currentYAxisUnits={currentYAxisUnits}
          isLine={isLine}
          isShowMovingAvg={isShowMovingAvg}
          getColor={getColor}
        />
      </CompanyPreferencesApiContext.Provider>
    );

    expect(screen.getByTestId("chart_view")).toBeInTheDocument();
  });

  it("renders the chart without data", () => {
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi: {
            selectedMetricsTA: [],
          },
        }}
      >
        <TrendAnalysisChart
          chartData={chartData}
          currentYAxisUnits={currentYAxisUnits}
          isLine={isLine}
          isShowMovingAvg={isShowMovingAvg}
          getColor={getColor}
        />
      </CompanyPreferencesApiContext.Provider>
    );

    expect(screen.queryByTestId("chart_view")).not.toBeInTheDocument();
  });
});
