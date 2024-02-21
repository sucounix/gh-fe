import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BreakevenChart from "./BreakevenChart";
import { BrowserRouter } from "react-router-dom";
import { TimeFrameContext } from "../../../../../../contexts/TimeFrameContext";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";

jest.mock("axios");

describe("Edit Breakeven Chart", () => {
  const item = {
    chart_item: {
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
    },
  };

  const timeFrameResult = {
    actual_year: 2020,
    frequency_period: "month",
    period: "August",
    year_range: "2019/2020",
  };

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
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: "123", currency: "EGP" },
            }}
          >
            <BreakevenChart item={item} />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("revenue-line")).toBeInTheDocument();
    expect(screen.getByTestId("fixed-cost-line")).toBeInTheDocument();
    expect(screen.getByTestId("cost-line")).toBeInTheDocument();
  });
  it("renders the component with revenue 0", async () => {
    const item = {
      chart_item: {
        frequency_period: "annual",
        period: "2022",
        title: "Original Breakeven Chart",
        params: { account: "Account 1" },
        type: "breakeven",
        is_valid: true,
        value: {
          data: {
            revenue: 0,
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
      },
    };
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: "123", currency: "EGP" },
            }}
          >
            <BreakevenChart item={item} />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );
    expect(screen.queryByTestId("revenue-line")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fixed-cost-line")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cost-line")).not.toBeInTheDocument();
  });
  it("the legends should be rendered", async () => {
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: "123", currency: "EGP" },
            }}
          >
            <BreakevenChart item={item} />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("breakeven_wrapper")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("fixed_cost_legend")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("total_cost_legend")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("revenue_legend")).toBeInTheDocument();
    });
  });
});
