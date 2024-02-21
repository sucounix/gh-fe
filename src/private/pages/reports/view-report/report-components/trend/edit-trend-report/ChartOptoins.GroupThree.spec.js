import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ChartOptions from "./ChartOptions";

const mockChart = {
  display_type: "line",
  show_moving_average: false,
};

it('should render the popover with data-testid "chart-popup"', () => {
  render(
    <ChartOptions
      chart={mockChart}
      chartIndex={0}
      handleMovingAvgChange={() => {}}
      handleChartTypeChange={() => {}}
    />
  );

  const popover = screen.getByTestId("chart-popup");

  expect(popover).toBeInTheDocument();
});

it('should render the chart type options with data-testid "chart-type-line-btn" and "chart-type-bar-btn"', () => {
  render(
    <ChartOptions
      chart={mockChart}
      chartIndex={0}
      handleMovingAvgChange={() => {}}
      handleChartTypeChange={() => {}}
    />
  );
  const popover = screen.getByTestId("chart-popup");
  fireEvent.click(popover);
  const lineChartBtn = screen.getByTestId("chart-type-line-btn");
  const barChartBtn = screen.getByTestId("chart-type-bar-btn");

  expect(lineChartBtn).toBeInTheDocument();
  expect(barChartBtn).toBeInTheDocument();
});

it('should render the moving average checkbox with data-testid "moving-average-ch"', () => {
  render(
    <ChartOptions
      chart={mockChart}
      chartIndex={0}
      handleMovingAvgChange={() => {}}
      handleChartTypeChange={() => {}}
    />
  );
  const popover = screen.getByTestId("chart-popup");
  fireEvent.click(popover);
  const movingAvgCheckbox = screen.getByTestId("moving-average-ch");

  expect(movingAvgCheckbox).toBeInTheDocument();
});

it("should call handleChartTypeChange when the line chart option is clicked", () => {
  const mockHandleChartTypeChange = jest.fn();

  render(
    <ChartOptions
      chart={mockChart}
      chartIndex={0}
      handleMovingAvgChange={() => {}}
      handleChartTypeChange={mockHandleChartTypeChange}
    />
  );
  const popover = screen.getByTestId("chart-popup");
  fireEvent.click(popover);

  const lineChartBtn = screen.getByTestId("chart-type-line-btn");
  fireEvent.click(lineChartBtn);

  expect(mockHandleChartTypeChange).toHaveBeenCalledWith("line", 0);
});

it("should call handleChartTypeChange when the bar chart option is clicked", () => {
  const mockHandleChartTypeChange = jest.fn();

  render(
    <ChartOptions
      chart={mockChart}
      chartIndex={0}
      handleMovingAvgChange={() => {}}
      handleChartTypeChange={mockHandleChartTypeChange}
    />
  );
  const popover = screen.getByTestId("chart-popup");
  fireEvent.click(popover);

  const barChartBtn = screen.getByTestId("chart-type-bar-btn");
  fireEvent.click(barChartBtn);

  expect(mockHandleChartTypeChange).toHaveBeenCalledWith("bar", 0);
});
