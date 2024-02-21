import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Breakeven from "./Breakeven";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
import AxiosMock from "axios";

jest.mock("axios");

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "123",
  }),
  useLocation: () => ({
    pathname: "",
  }),
}));

const timeFrameResult = {
  actual_year: 2020,
  frequency_period: "month",
  period: "August",
  year_range: "2019/2020",
};
const timeFrameRequestData = {
  timeframe: [
    {
      month: [{ name: "February", status: "enabled", year: "2021/2022" }],
      quarter: [{ name: "Q4", status: "enabled", year: "2021/2022" }],
      "semi-annual": [{ name: "H2", status: "enabled", year: "2021/2022" }],
      year: "2021/2022",
    },
  ],
  initial_value: {
    frequency_period: "month",
    period: "December",
    year: "2023/2024",
  },
};

describe("Breakeven", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the breakeven wrapper and report CTA are rendered", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: ["Revenues", "Retail", "Wholesale"],
    });
    AxiosMock.post.mockResolvedValueOnce({
      data: {
        revenue: 66000000.0,
        total_cost: 32421253.37,
        fixed_cost: 3495003.37,
        contribution_margin: 56.17234848484849,
        margin_of_safety: 59778071.48130416,
        display_message: false,
      },
    });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  subscriptionInfo: {
                    pricingModel: "Free",
                  },
                }}
              >
                <Breakeven />
              </SubscriptionContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`/analysis/breakeven/123/`);
    });
    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledWith(`/analysis/breakeven/123/`, {
        account: "Revenues",
        financial_year: 2020,
        period: "August",
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("breakeven_wrapper")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("report-cta")).toBeInTheDocument();
    });
  });

  it("when change the selected timeframe freq , the requestes should be sent again", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: ["Revenues", "Retail", "Wholesale"],
    });
    AxiosMock.post.mockResolvedValueOnce({
      data: {
        revenue: 66000000.0,
        total_cost: 32421253.37,
        fixed_cost: 3495003.37,
        contribution_margin: 56.17234848484849,
        margin_of_safety: 59778071.48130416,
        display_message: false,
      },
    });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  subscriptionInfo: {
                    pricingModel: "Free",
                  },
                }}
              >
                <Breakeven />
              </SubscriptionContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`/analysis/breakeven/123/`);
    });
    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledWith(`/analysis/breakeven/123/`, {
        account: "Revenues",
        financial_year: 2020,
        period: "August",
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("breakeven_wrapper")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("select-freq-timeframe"));

    await waitFor(() => {
      expect(screen.getByText("Quarterly")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Quarterly"));
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`/analysis/breakeven/123/`);
    });
    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledWith(`/analysis/breakeven/123/`, {
        account: "Revenues",
        financial_year: 2020,
        period: "August",
      });
    });
  });

  it("If the display_message = true , the message should be displayed", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: ["Revenues", "Retail", "Wholesale"],
    });
    AxiosMock.post.mockResolvedValueOnce({
      data: {
        revenue: 66000000.0,
        total_cost: 32421253.37,
        fixed_cost: 3495003.37,
        contribution_margin: 56.17234848484849,
        margin_of_safety: 59778071.48130416,
        display_message: true,
      },
    });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  subscriptionInfo: {
                    pricingModel: "Free",
                  },
                }}
              >
                <Breakeven />
              </SubscriptionContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`/analysis/breakeven/123/`);
    });
    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledWith(`/analysis/breakeven/123/`, {
        account: "Revenues",
        financial_year: 2020,
        period: "August",
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("breakeven_wrapper")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("calculation__alert")).toBeInTheDocument();
    });
  });

  it("If the revenue value , total cost value and operating profit value are displayed", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: ["Revenues", "Retail", "Wholesale"],
    });
    AxiosMock.post.mockResolvedValueOnce({
      data: {
        revenue: 66000000.0,
        total_cost: 32421253.37,
        fixed_cost: 3495003.37,
        contribution_margin: 56.17234848484849,
        margin_of_safety: 59778071.48130416,
        display_message: false,
      },
    });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  subscriptionInfo: {
                    pricingModel: "Free",
                  },
                }}
              >
                <Breakeven />
              </SubscriptionContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`/analysis/breakeven/123/`);
    });
    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledWith(`/analysis/breakeven/123/`, {
        account: "Revenues",
        financial_year: 2020,
        period: "August",
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("breakeven_wrapper")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("revenue_value").textContent).toBe(
        "EGP 66,000,000.00"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("breakeven_value").textContent).toBe(
        "EGP 6,221,929.00"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("fixed_cost_value").textContent).toBe(
        "EGP 3,495,003.00"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("contribution_margin_value").textContent).toBe(
        "56.17%"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("total_cost_value").textContent).toBe(
        "EGP 32,421,253.00"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("margin_of_safety_value").textContent).toBe(
        "EGP 59,778,071.00"
      );
    });
  });

  it("the legends should be rendered", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: ["Revenues", "Retail", "Wholesale"],
    });
    AxiosMock.post.mockResolvedValueOnce({
      data: {
        revenue: 66000000.0,
        total_cost: 32421253.37,
        fixed_cost: 3495003.37,
        contribution_margin: 56.17234848484849,
        margin_of_safety: 59778071.48130416,
        display_message: false,
      },
    });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  subscriptionInfo: {
                    pricingModel: "Free",
                  },
                }}
              >
                <Breakeven />
              </SubscriptionContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`/analysis/breakeven/123/`);
    });
    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledWith(`/analysis/breakeven/123/`, {
        account: "Revenues",
        financial_year: 2020,
        period: "August",
      });
    });
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

  it("when change the selected account ,the requestes should be sent again", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: ["Revenues", "Retail", "Wholesale"],
    });
    AxiosMock.post.mockResolvedValueOnce({
      data: {
        revenue: 66000000.0,
        total_cost: 32421253.37,
        fixed_cost: 3495003.37,
        contribution_margin: 56.17234848484849,
        margin_of_safety: 59778071.48130416,
        display_message: false,
      },
    });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  subscriptionInfo: {
                    pricingModel: "Free",
                  },
                }}
              >
                <Breakeven />
              </SubscriptionContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`/analysis/breakeven/123/`);
    });
    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledWith(`/analysis/breakeven/123/`, {
        account: "Revenues",
        financial_year: 2020,
        period: "August",
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("breakeven_wrapper")).toBeInTheDocument();
    });

    AxiosMock.post.mockResolvedValueOnce({
      data: {
        revenue: 55000000.0,
        total_cost: 32421253.37,
        fixed_cost: 3495003.37,
        contribution_margin: 56.17234848484849,
        margin_of_safety: 59778071.48130416,
        display_message: false,
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("accounts_dropdown")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("accounts_dropdown"));

    await waitFor(() => {
      expect(screen.getByText("Retail")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Retail"));

    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledWith(`/analysis/breakeven/123/`, {
        account: "Retail",
        financial_year: 2020,
        period: "August",
      });
    });
  });

  it("if their is not breakeven , the alert should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: ["Revenues", "Retail", "Wholesale"],
    });
    AxiosMock.post.mockRejectedValueOnce({});
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  subscriptionInfo: {
                    pricingModel: "Free",
                  },
                }}
              >
                <Breakeven />
              </SubscriptionContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`/analysis/breakeven/123/`);
    });
    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledWith(`/analysis/breakeven/123/`, {
        account: "Revenues",
        financial_year: 2020,
        period: "August",
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("breakeven_wrapper")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("no__breakeven")).toBeInTheDocument();
    });
  });
});
