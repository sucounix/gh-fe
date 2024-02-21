import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Financials from "./Financials";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";

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
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Finacials page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the page should render", async () => {
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              fetchCompanyList: jest.fn(),
              fetchSelectedCompany: jest.fn(),
              isSelectedCompanyReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <CompanyPreferencesApiContext.Provider
                value={{
                  companyPreferencesApi: {
                    viewBS: { value: "Summary", testId: "Summary" },
                    hideYoYBS: false,
                  },
                  setCompanyAPIPreferences: jest.fn(),
                }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{
                    companyPreferencesFilter: {
                      viewCurrentFirstBS: true,
                      viewEquityPlusLiabilitiesBS: true,
                    },
                    setCompanyFilterPreferences: jest.fn(),
                    getCompanyFilterPreferences: jest.fn(),
                  }}
                >
                  <SubscriptionContext.Provider
                    value={{
                      subscriptionInfo: {
                        pricingModel: "Free",
                      },
                    }}
                  >
                    <Financials />
                  </SubscriptionContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("financials")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("report-cta")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("select-freq-timeframe")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("tabs")).toBeInTheDocument();
    });
  });

  it("when click on PL tab , should render", async () => {
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              fetchCompanyList: jest.fn(),
              fetchSelectedCompany: jest.fn(),
              isSelectedCompanyReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <CompanyPreferencesApiContext.Provider
                value={{
                  companyPreferencesApi: {
                    viewBS: { value: "Summary", testId: "Summary" },
                    hideYoYBS: false,
                  },
                  setCompanyAPIPreferences: jest.fn(),
                }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{
                    companyPreferencesFilter: {
                      viewCurrentFirstBS: true,
                      viewEquityPlusLiabilitiesBS: true,
                    },
                    setCompanyFilterPreferences: jest.fn(),
                    getCompanyFilterPreferences: jest.fn(),
                  }}
                >
                  <SubscriptionContext.Provider
                    value={{
                      subscriptionInfo: {
                        pricingModel: "Free",
                      },
                    }}
                  >
                    <Financials />
                  </SubscriptionContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("financials")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("tabs")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("profit_and_loss")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("profit_and_loss"));
    await waitFor(() => {
      expect(screen.getByTestId("pl__wrapper")).toBeInTheDocument();
    });
  });

  it("when click on BS tab , should render", async () => {
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              fetchCompanyList: jest.fn(),
              fetchSelectedCompany: jest.fn(),
              isSelectedCompanyReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <CompanyPreferencesApiContext.Provider
                value={{
                  companyPreferencesApi: {
                    viewBS: { value: "Summary", testId: "Summary" },
                    hideYoYBS: false,
                  },
                  setCompanyAPIPreferences: jest.fn(),
                }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{
                    companyPreferencesFilter: {
                      viewCurrentFirstBS: true,
                      viewEquityPlusLiabilitiesBS: true,
                    },
                    setCompanyFilterPreferences: jest.fn(),
                    getCompanyFilterPreferences: jest.fn(),
                  }}
                >
                  <SubscriptionContext.Provider
                    value={{
                      subscriptionInfo: {
                        pricingModel: "Free",
                      },
                    }}
                  >
                    <Financials />
                  </SubscriptionContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("financials")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("tabs")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("balance_sheet")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("balance_sheet"));
    await waitFor(() => {
      expect(screen.getByTestId("bs__wrapper")).toBeInTheDocument();
    });
  });

  it("when click on CF tab , should render", async () => {
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: { uuid: "123", currency: "EGP" },
              setCompanies: jest.fn(),
              fetchCompanyList: jest.fn(),
              fetchSelectedCompany: jest.fn(),
              isSelectedCompanyReady: true,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                timeFrameResult: timeFrameResult,
                timeFrameRequestData: timeFrameRequestData,
                handleSelectTimeFrame: jest.fn(),
              }}
            >
              <CompanyPreferencesApiContext.Provider
                value={{
                  companyPreferencesApi: {
                    viewBS: { value: "Summary", testId: "Summary" },
                    hideYoYBS: false,
                  },
                  setCompanyAPIPreferences: jest.fn(),
                }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{
                    companyPreferencesFilter: {
                      viewCurrentFirstBS: true,
                      viewEquityPlusLiabilitiesBS: true,
                    },
                    setCompanyFilterPreferences: jest.fn(),
                    getCompanyFilterPreferences: jest.fn(),
                  }}
                >
                  <SubscriptionContext.Provider
                    value={{
                      subscriptionInfo: {
                        pricingModel: "Free",
                      },
                    }}
                  >
                    <Financials />
                  </SubscriptionContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("financials")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("tabs")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("cash_flow")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("cash_flow"));
    await waitFor(() => {
      expect(screen.getByTestId("cf__wrapper")).toBeInTheDocument();
    });
  });
});
