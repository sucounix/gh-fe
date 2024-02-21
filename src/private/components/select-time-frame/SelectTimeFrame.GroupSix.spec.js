import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SelectTimeFrame from "./SelectTimeFrame";
import Router from "react-router";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"), // use actual for all non-hook parts
  useParams: jest.fn(),
}));

describe("SelectTimeFrame", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const timeFrameRequestData = {
    timeframe: [
      {
        month: [{ name: "February", status: "enabled", year: "2023/2024" }],
        quarter: [{ name: "Q1", status: "enabled", year: "2023/2024" }],
        "semi-annual": [{ name: "H2", status: "enabled", year: "2023/2024" }],
        year: "2023/2024",
      },
    ],
    initial_value: {
      frequency_period: "month",
      period: "December",
      actual_year: "2023/2024",
      year_range: "2023/2024",
    },
  };

  const mockHandleSelectTimeFrame = jest.fn();
  it("should fire change", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });

    localStorage.setItem(
      `123_freq_timeframe`,
      JSON.stringify({
        frequency_period: "month",
        period: "December",
        actual_year: "2023/2024",
        year_range: "2023/2024",
      })
    );
    render(
      <SelectTimeFrame
        companyFrequency="month"
        timeframe={timeFrameRequestData.timeframe}
        initialValue={timeFrameRequestData.initial_value}
        handleSelectTimeFrame={mockHandleSelectTimeFrame}
      />
    );

    fireEvent.click(screen.getByTestId("select-freq-timeframe"));

    await waitFor(() => {
      expect(screen.getByText("Quarterly")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Quarterly"));

    expect(mockHandleSelectTimeFrame).toHaveBeenCalledTimes(1);
  });

  it("when select different period, themockHandleSelectTimeFrame should be called ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });

    localStorage.setItem(
      `123_freq_timeframe`,
      JSON.stringify({
        frequency_period: "month",
        period: "December",
        actual_year: "2023/2024",
        year_range: "2023/2024",
      })
    );
    render(
      <SelectTimeFrame
        companyFrequency="month"
        timeframe={timeFrameRequestData.timeframe}
        initialValue={timeFrameRequestData.initial_value}
        handleSelectTimeFrame={mockHandleSelectTimeFrame}
      />
    );

    fireEvent.click(screen.getByTestId("select-freq-timeframe"));

    await waitFor(() => {
      expect(screen.getByText("Quarterly")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Quarterly"));
    await waitFor(() => {
      expect(
        screen.getByTestId("select_time_frame_input_div")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("select_time_frame_input_div"));
    await waitFor(() => {
      expect(screen.getByTestId("options_div")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("options_div"));
    await waitFor(() => {
      expect(screen.getByTestId("item_0")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("item_0"));
    expect(mockHandleSelectTimeFrame).toHaveBeenCalledTimes(2);
  });
});
