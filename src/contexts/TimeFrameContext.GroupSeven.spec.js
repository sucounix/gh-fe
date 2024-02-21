import React, { useContext } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TimeFrameProvider, TimeFrameContext } from "./TimeFrameContext";
import { CompaniesContext } from "./CompaniesContext";
import AxiosMock from "axios";

jest.mock("axios");

const timeFrameRes = {
  timeframe: [
    {
      year: "2023/2024",
      month: [],
      quarter: [
        {
          year: "2023/2024",
          name: "Q1",
          status: "enabled",
        },
        {
          year: "2023/2024",
          name: "Q2",
          status: "enabled",
        },
        {
          year: "2023/2024",
          name: "Q3",
          status: "enabled",
        },
        {
          year: "2023/2024",
          name: "Q4",
          status: "enabled",
        },
      ],
      "semi-annual": [
        {
          year: "2023/2024",
          name: "H1",
          status: "enabled",
        },
        {
          year: "2023/2024",
          name: "H2",
          status: "enabled",
        },
      ],
    },
  ],
  initial_value: {
    frequency_period: "quarter",
    period: "Q1",
    year: "2023/2024",
  },
};
const TestingComponent = () => {
  const {
    fetchTimeFrame,
    timeFrameResult,
    timeFrameRequestData,
    handleSelectTimeFrame,
    clearTimeFrameResult,
  } = useContext(TimeFrameContext);

  return (
    <div data-testid="children_component">
      <p data-testid={`init_frequency_period`}>
        {timeFrameRequestData?.initial_value?.frequency_period}
      </p>
      <p data-testid={`timeframe_result_year`}>
        {timeFrameResult?.actual_year}
      </p>
      <button
        onClick={() => {
          fetchTimeFrame("123");
        }}
        data-testid="fetch_timeFrame_btn"
      >
        fetch timeframe
      </button>
      <button onClick={clearTimeFrameResult} data-testid="clear_btn">
        clear timeframe
      </button>
    </div>
  );
};

describe("Timeframe Context", () => {
  it("when fetch the timeframe , the inital value should rendered", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: timeFrameRes,
    });
    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: {
            uuid: "123",
          },
          setIsTimeframeReady: jest.fn(),
        }}
      >
        <TimeFrameProvider>
          <TestingComponent />
        </TimeFrameProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("init_frequency_period").textContent).toBe("");
    });
    await waitFor(() => {
      expect(screen.getByTestId("fetch_timeFrame_btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_timeFrame_btn"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("init_frequency_period").textContent).toBe(
        "quarter"
      );
    });
  });

  it("if fetch the timeframe was failed , the inital value shouldn't rendered", async () => {
    AxiosMock.get.mockRejectedValueOnce({});
    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: {
            uuid: "123",
          },
          setIsTimeframeReady: jest.fn(),
        }}
      >
        <TimeFrameProvider>
          <TestingComponent />
        </TimeFrameProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("init_frequency_period").textContent).toBe("");
    });
    await waitFor(() => {
      expect(screen.getByTestId("fetch_timeFrame_btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_timeFrame_btn"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("init_frequency_period").textContent).toBe("");
    });
  });

  it("when click on clear button , the inital value shouldn't rendered", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: timeFrameRes,
    });
    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: {
            uuid: "123",
          },
          setIsTimeframeReady: jest.fn(),
        }}
      >
        <TimeFrameProvider>
          <TestingComponent />
        </TimeFrameProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("timeframe_result_year").textContent).toBe("");
    });
    await waitFor(() => {
      expect(screen.getByTestId("fetch_timeFrame_btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_timeFrame_btn"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("timeframe_result_year").textContent).toBe(
        "2023/2024"
      );
    });
    fireEvent.click(screen.getByTestId("clear_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("timeframe_result_year").textContent).toBe("");
    });
  });
});
