import React, { useState } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AxiosMock from "axios";
import ProfitAndLoss from "./ProfitAndLoss";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";

jest.mock("axios");

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const timeFrameResult = {
  frequency_period: "month",
  period: "December",
  year_range: "2020",
  actual_year: 2020,
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "1",
  }),
}));
const WrapperPl = ({ viewType }) => {
  const [filterValues] = useState({});
  const [apiValues, setApiValue] = useState({
    viewPL: viewType,
    isStandardPL: true,
    hideYoYPL: true,
  });
  return (
    <BreadcrumbsContext.Provider
      value={{
        breadCrumbs: [],
        setBreadCrumbs: jest.fn(),
      }}
    >
      <TimeFrameContext.Provider
        value={{
          timeFrameResult,
        }}
      >
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 123, is_analysis_ready: true },
            isTimeframeReady: true,
            isAPIPreferencesReady: true,
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <CompanyPreferencesApiContext.Provider
            value={{
              companyPreferencesApi: { ...apiValues },
              setCompanyAPIPreferences: (e) => {
                setApiValue({ ...e });
              },
            }}
          >
            <CompanyPreferencesFilterContext.Provider
              value={{
                companyPreferencesFilter: { ...filterValues },
                setCompanyFilterPreferences: jest.fn(),
                getCompanyFilterPreferences: jest.fn(),
              }}
            >
              <ProfitAndLoss />
            </CompanyPreferencesFilterContext.Provider>
          </CompanyPreferencesApiContext.Provider>
        </CompaniesContext.Provider>
      </TimeFrameContext.Provider>
    </BreadcrumbsContext.Provider>
  );
};
describe("P&L", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render PL and call the endpoint", async () => {
    AxiosMock.get.mockResolvedValueOnce({});
    window.ResizeObserver = ResizeObserver;

    render(
      <WrapperPl
        viewType={{ value: "Management accounts", testId: "Accounts" }}
      />
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        /*
          Undefined is the params
          in the router since we don't
           pass any params
        */
        "/analysis/analysis_statement/123/",
        {
          params: {
            view_type: "Management accounts",
            analysis_statement: "Profit & Loss",
            view_name: "Standard",
            period: "December",
            financial_year: 2020,
            is_hide: true,
          },
        }
      );
    });
  });

  it("when changing the summary to Management accounts view in request should send again", async () => {
    AxiosMock.get.mockResolvedValueOnce({});
    AxiosMock.get.mockResolvedValueOnce({});

    window.ResizeObserver = ResizeObserver;

    render(<WrapperPl viewType={{ value: "Summary", testId: "Summary" }} />);

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        /*
          Undefined is the params
          in the router since we don't
           pass any params
        */
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "Profit & Loss",
            view_type: "Summary",
            period: "December",
            financial_year: 2020,
            view_name: "Standard",
            is_hide: true,
          },
        }
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("select-view-pl")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("select-view-pl"));
    fireEvent.click(screen.getByText("Accounts"));
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        /*
          Undefined is the params
          in the router since we don't
           pass any params
        */
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "Profit & Loss",
            view_type: "Management accounts",
            period: "December",
            financial_year: 2020,
            view_name: "Standard",
            is_hide: true,
          },
        }
      );
    });
  });

  it("on annual timeframe show/hide YoY shouldn't be rendered", async () => {
    AxiosMock.get.mockResolvedValueOnce({});
    AxiosMock.get.mockResolvedValueOnce({});

    window.ResizeObserver = ResizeObserver;

    render(
      <WrapperPl
        viewType={{ value: "Management accounts", testId: "Accounts" }}
      />
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        /*
          Undefined is the params
          in the router since we don't
           pass any params
        */
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "Profit & Loss",
            view_type: "Management accounts",
            period: "December",
            financial_year: 2020,
            view_name: "Standard",
            is_hide: true,
          },
        }
      );
    });

    await waitFor(() => {
      expect(screen.queryByTestId("show-YoY")).not.toBeInTheDocument();
    });
  });
});
