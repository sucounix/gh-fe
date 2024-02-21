import React from "react";
import { render, waitFor } from "@testing-library/react";
import AxiosMock from "axios";
import Segmentations from "./Segmentations";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import { dummyData } from "./DummyData";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { wait } from "@testing-library/user-event/dist/utils";
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "123",
  }),
  useLocation: () => ({
    pathname: "/settings/segmentation-analysis",
  }),
}));
describe("Segmentation index", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("fetch the metrics and segmentations", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: ["metric 1", "metric 2"],
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: dummyData,
    });
    let api_value_preference = {
      currentViewCashFlow: {
        value: "Cash Flow (CFO - CFI - CFF)",
        testId: "Cash Flow",
      },
      isSummaryPL: true,
      hideYoYSeg: false,
    };
    let filter_value_preferences = {
      selectedMetricsSeg: ["Revenue Segmentation"],
    };
    window.localStorage.setItem(
      "123_api",
      JSON.stringify(api_value_preference)
    );
    window.localStorage.setItem(
      "123_filter",
      JSON.stringify(filter_value_preferences)
    );
    const timeFrameResult = {
      actual_year: 2021,
      frequency_period: "month",
      period: "December",
      year_range: "2021/2022",
    };
    render(
      <CompaniesContext.Provider
        value={{
          companies: [
            {
              uuid: "123",
              name: "test",
              currency: "USD",
            },
          ],
          selectedCompany: {
            uuid: "123",
            name: "test",
            currency: "USD",
          },
          isTimeframeReady: true,
          isAPIPreferencesReady: true,
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
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
            <CompanyPreferencesFilterContext.Provider
              value={{
                companyPreferencesFilter: filter_value_preferences,
                setCompanyFilterPreferences: jest.fn(),
                getCompanyFilterPreferences: jest.fn(),
              }}
            >
              <CompanyPreferencesApiContext.Provider
                value={{
                  companyPreferencesApi: api_value_preference,
                  setCompanyAPIPreferences: jest.fn(),
                }}
              >
                <Segmentations />
              </CompanyPreferencesApiContext.Provider>
            </CompanyPreferencesFilterContext.Provider>
          </TimeFrameContext.Provider>
        </BreadcrumbsContext.Provider>
      </CompaniesContext.Provider>
    );
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(`analysis/segmentation/123/`);
    });
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "Segmentation Analysis",
            financial_year: 2021,
            is_hide: false,
            period: "December",
            view_name: "Revenue Segmentation",
          },
        }
      );
    });
  });
  it("when updated the localstorage _api filter,should fetch the segmentation", async () => {
    AxiosMock.get.mockResolvedValueOnce({});
    AxiosMock.get.mockResolvedValueOnce({
      data: dummyData,
    });
    let api_value_preference = {
      currentViewCashFlow: {
        value: "Cash Flow (CFO - CFI - CFF)",
        testId: "Cash Flow",
      },
      isSummaryPL: true,
      hideYoYSeg: false,
      selectedMetricsSeg: [
        "Revenue Segmentation",
        "Sales Volume Segmentation",
        "Price Per Unit",
      ],
    };
    let filter_value_preference = {
      selectedMetricsSeg: ["Revenue Segmentation"],
    };
    const timeFrameResult = {
      actual_year: 2021,
      frequency_period: "month",
      period: "December",
      year_range: "2021/2022",
    };
    window.localStorage.setItem(
      "123_api",
      JSON.stringify(api_value_preference)
    );
    window.localStorage.setItem(
      "123_filter",
      JSON.stringify(filter_value_preference)
    );
    render(
      <CompaniesContext.Provider
        value={{
          companies: [
            {
              uuid: "123",
              name: "test",
              currency: "USD",
            },
          ],
          selectedCompany: {
            uuid: "123",
            name: "test",
            currency: "USD",
          },
          isTimeframeReady: true,
          isAPIPreferencesReady: true,
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        {" "}
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
            <CompanyPreferencesFilterContext.Provider
              value={{
                companyPreferencesFilter: filter_value_preference,
                setCompanyFilterPreferences: jest.fn(),
                getCompanyFilterPreferences: jest.fn(),
              }}
            >
              <CompanyPreferencesApiContext.Provider
                value={{
                  companyPreferencesApi: api_value_preference,
                  setCompanyAPIPreferences: jest.fn(),
                }}
              >
                <Segmentations />
              </CompanyPreferencesApiContext.Provider>
            </CompanyPreferencesFilterContext.Provider>
          </TimeFrameContext.Provider>
        </BreadcrumbsContext.Provider>
      </CompaniesContext.Provider>
    );
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    let new_api_value_preference = {
      currentViewCashFlow: {
        value: "Cash Flow (CFO - CFI - CFF)",
        testId: "Cash Flow",
      },
      isSummaryPL: true,
      hideYoYSeg: false,
      selectedMetricsSeg: [
        "Revenue Segmentation",
        "Sales Volume Segmentation",
        "Price Per Unit",
        "Gross Market Value",
      ],
    };
    window.localStorage.setItem(
      "123_api",
      JSON.stringify(new_api_value_preference)
    );
    expect(AxiosMock.get).toHaveBeenCalledTimes(2);
  });
});
