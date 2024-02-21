import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AxiosMock from "axios";
import EditBreakevenChart from "./EditBreakevenChart";
import { BrowserRouter } from "react-router-dom";
import { TimeFrameContext } from "../../../../../../contexts/TimeFrameContext";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";

jest.mock("axios");

const timeFrameRequestData = {
  initial_value: {
    frequency_period: "quarter",
    period: "Q2",
    year: "2021/2022",
  },
  timeframe: [
    {
      year: "2023/2024",
      month: [],
      quarter: [
        { year: "2021/2022", name: "Q1", status: "disabled" },
        { year: "2021/2022", name: "Q2", status: "enabled" },
        { year: "2021/2022", name: "Q3", status: "enabled" },
        { year: "2021/2022", name: "Q4", status: "enabled" },
      ],
      "semi-annual": [
        { year: "2021/2022", name: "H1", status: "disabled" },
        { year: "2021/2022", name: "H2", status: "enabled" },
      ],
      year: "2021/2022",
    },
  ],
};

describe("Edit Breakeven Chart", () => {
  const chartItem = {
    frequency_period: "annual",
    period: "2022",
    title: "Original Breakeven Chart",
    params: { account: "Account 1" },
    type: "breakeven",
    is_valid: true,
    value: {
      data: {
        revenue: 12885811.47,
        total_cost: 9128881.11,
        fixed_cost: 4172786.43,
        contribution_margin: 61.53835797195627,
        margin_of_safety: 6105022.109481825,
        display_message: false,
      },
    },
    uuid: "3f1f86ad-ea3c-488f-bcff-16ae42358945",
    item_uuid: "5b05fa59-b954-4662-bce4-9b8ee3db7656",
    created: "2023-09-12T07:23:49.361688Z",
    modified: null,
  };

  const mockedSetOpenEditDrawer = jest.fn();
  const setGraphData = jest.fn();
  const setChartItemData = jest.fn();
  const setLoading = jest.fn();
  const loading = false;

  beforeEach(() => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with correct initial values", async () => {
    AxiosMock.get.mockResolvedValue({
      data: ["Account 1", "Account 2"],
    });

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: "123" },
            }}
          >
            <EditBreakevenChart
              chartItem={chartItem}
              setOpenEditDrawer={mockedSetOpenEditDrawer}
              setLoading={setLoading}
              loading={loading}
              handleNewItemInReportDetails={() => jest.fn()}
            />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("title_input")).toHaveValue(
        "Original Breakeven Chart"
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("account_input")).toHaveAttribute(
        "value",
        "Account 1"
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Chart time period")).toBeInTheDocument();
    });
  });

  it("submits form with updated values", async () => {
    AxiosMock.get.mockResolvedValue({
      data: ["Account 1", "Account 2"],
    });
    AxiosMock.put.mockResolvedValue({
      data: {
        value: {
          data: {
            title: "Updated Breakeven Chart",
            params: {
              account: "Account 2",
            },
            frequency_period: "month",
            period: "March 2021/2022",
          },
        },
        uuid: "123",
      },
    });

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{ selectedCompany: { uuid: "123" } }}
          >
            <EditBreakevenChart
              chartItem={chartItem}
              setOpenEditDrawer={mockedSetOpenEditDrawer}
              setLoading={setLoading}
              loading={loading}
              handleNewItemInReportDetails={() => jest.fn()}
            />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("title_input")).toHaveValue(
        "Original Breakeven Chart"
      );
    });

    fireEvent.change(screen.getByTestId("title_input"), {
      target: { value: "Updated Breakeven Chart" },
    });
    fireEvent.click(screen.getByTestId("account_input"));

    await waitFor(() => {
      expect(screen.getByText("Account 2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Account 2"));
    fireEvent.click(screen.getByTestId("save_button"));

    await waitFor(() => {
      expect(AxiosMock.put).toHaveBeenCalledWith(
        "/report/chart_item/3f1f86ad-ea3c-488f-bcff-16ae42358945",
        {
          frequency_period: "annual",
          params: { account: "Account 2" },
          period: "2022",
          title: "Updated Breakeven Chart",
          type: "breakeven",
        }
      );
    });
  });

  it("if the component is invalid and try to save the request will not send because the user need to select time Period", async () => {
    AxiosMock.get.mockResolvedValue({
      data: ["Account 1", "Account 2"],
    });
    AxiosMock.put.mockResolvedValue({
      data: {
        value: {
          data: {
            title: "Updated Breakeven Chart",
            params: {
              account: "Account 2",
            },
            frequency_period: "month",
            period: "March 2021/2022",
          },
        },
        uuid: "123",
      },
    });

    let invalidComponent = chartItem;
    invalidComponent.is_valid = false;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{ selectedCompany: { uuid: "123" } }}
          >
            <EditBreakevenChart
              chartItem={invalidComponent}
              setOpenEditDrawer={mockedSetOpenEditDrawer}
              setLoading={setLoading}
              loading={loading}
              handleNewItemInReportDetails={() => jest.fn()}
            />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("title_input")).toHaveValue(
        "Original Breakeven Chart"
      );
    });

    fireEvent.change(screen.getByTestId("title_input"), {
      target: { value: "Updated Breakeven Chart" },
    });
    fireEvent.click(screen.getByTestId("account_input"));

    await waitFor(() => {
      expect(screen.getByText("Account 2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Account 2"));
    fireEvent.click(screen.getByTestId("save_button"));

    await waitFor(() => {
      expect(screen.getByText("Time Period is required")).toBeInTheDocument();
    });
  });
});
