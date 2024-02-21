import React from "react";
import { render, waitFor } from "@testing-library/react";
import AxiosMock from "axios";
import KPI from "./KPI";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
import { mockDataKPI } from "./MockData";

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

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "123",
  }),
  useLocation: () => ({
    pathname: "/analysis/kpi",
  }),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

describe("KPI", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render KPI and call the endpoint", async () => {
    AxiosMock.get.mockResolvedValueOnce({ data: mockDataKPI });
    window.ResizeObserver = ResizeObserver;

    const companyPreferencesApi = {
      KPIFilter: "all",
    };

    const companyPreferencesFilter = {};
    window.localStorage.setItem(
      "123_filter",
      JSON.stringify(companyPreferencesFilter)
    );
    window.localStorage.setItem(
      "123_api",
      JSON.stringify(companyPreferencesApi)
    );

    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: {
              code: "reporting-kit",
              quantity: 15,
            },
          }}
        >
          <TimeFrameContext.Provider
            value={{
              timeFrameResult,
            }}
          >
            <CompaniesContext.Provider
              value={{
                selectedCompany: {
                  is_kpi_ready: true,
                  uuid: 123,
                  currency: "EGP",
                },
                fetchCompanyList: jest.fn(),
                isTimeframeReady: true,
                isAPIPreferencesReady: true,
                fetchSelectedCompany: jest.fn(),
                isSelectedCompanyReady: true,
              }}
            >
              <CompanyPreferencesApiContext.Provider
                value={{
                  companyPreferencesApi: companyPreferencesApi,
                  setCompanyAPIPreferences: jest.fn(),
                }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{
                    companyPreferencesFilter: companyPreferencesFilter,
                    setCompanyFilterPreferences: jest.fn(),
                    getCompanyFilterPreferences: jest.fn(),
                  }}
                >
                  <KPI />
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </CompaniesContext.Provider>
          </TimeFrameContext.Provider>
        </SubscriptionContext.Provider>
      </BreadcrumbsContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "KPIs",
            is_summary: false,
            view_name: "all",
            period: "December",
            financial_year: 2020,
          },
        }
      );
    });
  });
});
