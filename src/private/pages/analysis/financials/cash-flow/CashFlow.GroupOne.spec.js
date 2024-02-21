import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CashFlow from "./CashFlow";
import AxiosMock from "axios";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";
import { mockdataCF } from "./MockData";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "123",
  }),
}));

const timeFrameResult = {
  actual_year: 2020,
  frequency_period: "monthly",
  period: "August",
  year_range: "2019/2020",
};

const timeFrameResultAnnual = {
  actual_year: "2023/2024",
  frequency_period: "annual",
  period: "",
  year_range: "2023/2024",
};

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("cash flow", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render cashflow data and call the endpoint", async () => {
    let new_filter_value = {
      viewCashFlowWaterFall: false,
      currentViewCashFlow: {
        value: "Cash Flow (CFO - CFI - CFF)",
        testId: "Cash Flow",
      },
    };
    let new_filter_value_api = {};
    window.localStorage.setItem("123_filter", JSON.stringify(new_filter_value));
    window.localStorage.setItem(
      "123_api",
      JSON.stringify(new_filter_value_api)
    );
    AxiosMock.get.mockResolvedValueOnce({ data: mockdataCF });
    window.ResizeObserver = ResizeObserver;

    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        {" "}
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 123, is_analysis_ready: true },
            isTimeframeReady: true,
            isAPIPreferencesReady: true,
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <TimeFrameContext.Provider
            value={{
              timeFrameResult,
            }}
          >
            <CompanyPreferencesApiContext.Provider
              value={{
                companyPreferencesApi: new_filter_value_api,
                setCompanyAPIPreferences: jest.fn(),
              }}
            >
              <CompanyPreferencesFilterContext.Provider
                value={{
                  companyPreferencesFilter: new_filter_value,
                  setCompanyFilterPreferences: jest.fn(),
                  getCompanyFilterPreferences: jest.fn(),
                }}
              >
                <CashFlow />
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </TimeFrameContext.Provider>
        </CompaniesContext.Provider>
      </BreadcrumbsContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });
  });

  it("when change cash flow filteration, the saved filter value in local storage is changed also", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: mockdataCF,
      })
    );
    let filter_value = {
      viewCashFlowWaterFall: false,
    };

    let new_filter_value_api = {
      currentViewCashFlow: {
        value: "Cash Flow (CFO - CFI - CFF)",
        testId: "Cash Flow",
      },
      hideYoYCF: true,
    };
    window.localStorage.setItem(
      "123_api",
      JSON.stringify(new_filter_value_api)
    );
    window.localStorage.setItem("123_filter", JSON.stringify(filter_value));

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          companies: [
            {
              uuid: 123,
            },
          ],

          selectedCompany: {
            uuid: 123,
            currency: "USD",
            is_analysis_ready: true,
          },
          isTimeframeReady: true,
          isAPIPreferencesReady: true,
          setCompanies: jest.fn(),
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
            <CompanyPreferencesApiContext.Provider
              value={{
                companyPreferencesApi: new_filter_value_api,
                setCompanyAPIPreferences: jest.fn(() => {
                  window.localStorage.setItem(
                    "123_api",
                    JSON.stringify({
                      viewCashFlowWaterFall: false,
                      hideYoYCF: false,
                    })
                  );
                }),
              }}
            >
              <CompanyPreferencesFilterContext.Provider
                value={{
                  companyPreferencesFilter: filter_value,
                  setCompanyFilterPreferences: jest.fn(() => {
                    window.localStorage.setItem(
                      "123_filter",
                      JSON.stringify({
                        viewCashFlowWaterFall: false,
                      })
                    );
                  }),
                  getCompanyFilterPreferences: jest.fn(),
                }}
              >
                <CashFlow />
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </TimeFrameContext.Provider>
        </BreadcrumbsContext.Provider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });
    let checkboX = screen.queryAllByRole("radio");
    fireEvent.click(checkboX[0], { target: { checked: "" } });
    await waitFor(() => {
      let new_filter = JSON.parse(window.localStorage.getItem("123_api"));
      expect(new_filter.hideYoYCF).toEqual(false);
    });
  });
});
