import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TimeFrame from "./TimeFrame";

describe("Time frame Input", () => {
  const timeframe = [
    {
      year: "2020",
      month: [
        {
          name: "January",
          status: "enabled",
          year: 2020,
        },
        {
          name: "February",
          status: "disabled",
          year: 2020,
        },
        {
          name: "March",
          status: "enabled",
          year: 2020,
        },
        {
          name: "April",
          status: "enabled",
          year: 2020,
        },
        {
          name: "May",
          status: "enabled",
          year: 2020,
        },
        {
          name: "June",
          status: "enabled",
          year: 2020,
        },
        {
          name: "July",
          status: "enabled",
          year: 2020,
        },
        {
          name: "August",
          status: "enabled",
          year: 2020,
        },
        {
          name: "September",
          status: "enabled",
          year: 2020,
        },
        {
          name: "October",
          status: "enabled",
          year: 2020,
        },
        {
          name: "November",
          status: "enabled",
          year: 2020,
        },
        {
          name: "December",
          status: "enabled",
          year: 2020,
        },
      ],
      quarter: [
        {
          name: "Q1",
          status: "enabled",
          year: 2020,
        },
        {
          name: "Q2",
          status: "enabled",
          year: 2020,
        },
        {
          name: "Q3",
          status: "enabled",
          year: 2020,
        },
        {
          name: "Q4",
          status: "disabled",
          year: 2020,
        },
      ],
      "semi-annual": [
        {
          name: "H1",
          status: "enabled",
          year: 2020,
        },
        {
          name: "H2",
          status: "enabled",
          year: 2020,
        },
      ],
    },
  ];
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when the frequency is month , can select year and month then the handleSelectTimeFrame should be called ", async () => {
    const handleSelectTimeFrame = jest.fn();
    const initialValue = {
      frequency_period: "month",
      period: "December",
      year_range: "2020",
      actual_year: 2020,
    };
    render(
      <TimeFrame
        label="Time frame"
        frequency="month"
        initialValue={initialValue}
        timeframe={timeframe}
        handleSelectTimeFrame={handleSelectTimeFrame}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("select_time_frame_input")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId(`select_time_frame_input_div`));
    await waitFor(() => {
      expect(screen.getByTestId(`options_div`)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId(`year_range_0`));
    fireEvent.click(screen.getByTestId(`item_0`));
    await waitFor(() => {
      expect(handleSelectTimeFrame).toBeCalledTimes(1);
    });
  });

  it("when the calender data is disabled (month/quarter/semi_annual) the user can't select the option and the handleSelectTimeFrame shouldn't be called ", async () => {
    const handleSelectTimeFrame = jest.fn();
    const initialValue = {
      frequency_period: "month",
      period: "December",
      year_range: "2020",
      actual_year: 2020,
    };
    render(
      <TimeFrame
        label="Time frame"
        frequency="month"
        initialValue={initialValue}
        timeframe={timeframe}
        handleSelectTimeFrame={handleSelectTimeFrame}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("select_time_frame_input")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId(`select_time_frame_input_div`));
    await waitFor(() => {
      expect(screen.getByTestId(`options_div`)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId(`year_range_0`));
    fireEvent.click(screen.getByTestId(`item_1`));
    await waitFor(() => {
      expect(handleSelectTimeFrame).not.toBeCalledTimes(1);
    });
  });
});
