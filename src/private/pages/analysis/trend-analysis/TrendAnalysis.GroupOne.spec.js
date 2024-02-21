import React from "react";
import TrendAnalysis from "./TrendAnalysis";
import AxiosMock from "axios";
import { BrowserRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { data } from "./MockAPIResponse";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import { TutorialVideosContext } from "../../../../contexts/TutorialVideos";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
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
  useLocation: () => ({
    pathname: "/analysis/trend-analysis",
  }),
}));

describe("trend analysis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch the metrics and fetch the chart at the first render and render the chart view ", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: data,
      }),
      AxiosMock.post.mockResolvedValueOnce({
        data: {
          headers: ["Jan 2022"],
          charts: [
            {
              chart_uuid: "91a00d2c-d7ee-4a91-b85d-9538bd888053",
              chart_name: "Total Revenues",
              type: "Monetary",
              is_kpi: false,
              color: "#038269",
              values: [
                {
                  key: "Jan 2022",
                  standard: 3060000.0,
                  moving_average: 3060000.0,
                },
              ],
            },
          ],
        },
      }),
    ]);

    window.ResizeObserver = ResizeObserver;
    const companyPreferencesFilter = {
      viewChartTA: true,
      selectedMetricsOptionsTA: [],
    };
    const companyPreferencesApi = {
      selectedMetricsTA: [
        {
          uuid: "91a00d2c",
          name: "Total Revenues",
          type: "Monetary",
          is_kpi: false,
        },
      ],
    };
    window.localStorage.setItem(
      "1_filter",
      JSON.stringify(companyPreferencesFilter)
    );
    window.localStorage.setItem("1_api", JSON.stringify(companyPreferencesApi));
    render(
      <BrowserRouter>
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
                    is_analysis_ready: true,
                    is_kpi_ready: true,
                    uuid: 1,
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
                    <TrendAnalysis />
                  </CompanyPreferencesFilterContext.Provider>
                </CompanyPreferencesApiContext.Provider>
              </CompaniesContext.Provider>
            </TimeFrameContext.Provider>
          </SubscriptionContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith("analysis/trend_analysis/1/");
    });
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("chart_view")).toBeInTheDocument();
    });
  });

  it("should fetch the metrics and fetch the chart at the first render and render the table view if viewChartTA = false ", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: data,
      }),
      AxiosMock.post.mockResolvedValueOnce({
        data: {
          headers: ["Jan 2022"],
          charts: [
            {
              chart_uuid: "91a00d2c-d7ee-4a91-b85d-9538bd888053",
              chart_name: "Total Revenues",
              type: "Monetary",
              is_kpi: false,
              color: "#038269",
              values: [
                {
                  key: "Jan 2022",
                  standard: 3060000.0,
                  moving_average: 3060000.0,
                },
              ],
            },
          ],
        },
      }),
    ]);

    window.ResizeObserver = ResizeObserver;
    const companyPreferencesFilter = {
      viewChartTA: false,
      selectedMetricsOptionsTA: [],
      predefineChartTA: "profit",
    };
    const companyPreferencesApi = {
      selectedMetricsTA: [
        {
          uuid: "91a00d2c",
          name: "Total Revenues",
          type: "Monetary",
          is_kpi: false,
        },
      ],
    };
    window.localStorage.setItem(
      "1_filter",
      JSON.stringify(companyPreferencesFilter)
    );
    window.localStorage.setItem("1_api", JSON.stringify(companyPreferencesApi));
    render(
      <BrowserRouter>
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
                    is_analysis_ready: true,
                    is_kpi_ready: true,
                    uuid: 1,
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
                    <TrendAnalysis />
                  </CompanyPreferencesFilterContext.Provider>
                </CompanyPreferencesApiContext.Provider>
              </CompaniesContext.Provider>
            </TimeFrameContext.Provider>
          </SubscriptionContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith("analysis/trend_analysis/1/");
    });
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("table_view")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("currency__div_EGP")).toBeInTheDocument();
    });
  });

  it("if companyPreferencesFilter.predefineChartTA = SOLVENCY , the currency shouldn't rendered", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: data,
      }),
      AxiosMock.post.mockResolvedValueOnce({
        data: {
          headers: ["Jan 2022"],
          charts: [
            {
              chart_uuid: "91a00d2c-d7ee-4a91-b85d-9538bd888053",
              chart_name: "Total Revenues",
              type: "Monetary",
              is_kpi: false,
              color: "#038269",
              values: [
                {
                  key: "Jan 2022",
                  standard: 3060000.0,
                  moving_average: 3060000.0,
                },
              ],
            },
          ],
        },
      }),
    ]);

    window.ResizeObserver = ResizeObserver;
    const companyPreferencesFilter = {
      viewChartTA: false,
      selectedMetricsOptionsTA: [],
      predefineChartTA: "Solvency",
    };
    const companyPreferencesApi = {
      selectedMetricsTA: [
        {
          uuid: "91a00d2c",
          name: "Total Revenues",
          type: "Monetary",
          is_kpi: false,
        },
      ],
    };
    window.localStorage.setItem(
      "1_filter",
      JSON.stringify(companyPreferencesFilter)
    );
    window.localStorage.setItem("1_api", JSON.stringify(companyPreferencesApi));
    render(
      <BrowserRouter>
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
                    is_analysis_ready: true,
                    is_kpi_ready: true,
                    uuid: 1,
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
                    <TrendAnalysis />
                  </CompanyPreferencesFilterContext.Provider>
                </CompanyPreferencesApiContext.Provider>
              </CompaniesContext.Provider>
            </TimeFrameContext.Provider>
          </SubscriptionContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith("analysis/trend_analysis/1/");
    });
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("table_view")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("currency__div_EGP")).not.toBeInTheDocument();
    });
  });

  it("if companyPreferencesFilter.predefineChartTA = Liquidity , the currency shouldn't rendered", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: data,
      }),
      AxiosMock.post.mockResolvedValueOnce({
        data: {
          headers: ["Jan 2022"],
          charts: [
            {
              chart_uuid: "91a00d2c-d7ee-4a91-b85d-9538bd888053",
              chart_name: "Total Revenues",
              type: "Monetary",
              is_kpi: false,
              color: "#038269",
              values: [
                {
                  key: "Jan 2022",
                  standard: 3060000.0,
                  moving_average: 3060000.0,
                },
              ],
            },
          ],
        },
      }),
    ]);

    window.ResizeObserver = ResizeObserver;
    const companyPreferencesFilter = {
      viewChartTA: false,
      selectedMetricsOptionsTA: [],
      predefineChartTA: "Liquidity",
    };
    const companyPreferencesApi = {
      selectedMetricsTA: [
        {
          uuid: "91a00d2c",
          name: "Total Revenues",
          type: "Monetary",
          is_kpi: false,
        },
      ],
    };
    window.localStorage.setItem(
      "1_filter",
      JSON.stringify(companyPreferencesFilter)
    );
    window.localStorage.setItem("1_api", JSON.stringify(companyPreferencesApi));
    render(
      <BrowserRouter>
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
                    is_analysis_ready: true,
                    is_kpi_ready: true,
                    uuid: 1,
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
                    <TrendAnalysis />
                  </CompanyPreferencesFilterContext.Provider>
                </CompanyPreferencesApiContext.Provider>
              </CompaniesContext.Provider>
            </TimeFrameContext.Provider>
          </SubscriptionContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith("analysis/trend_analysis/1/");
    });
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("table_view")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("currency__div_EGP")).not.toBeInTheDocument();
    });
  });

  it("if companyPreferencesFilter.predefineChartTA = Cash Conversion Cycle , the currency shouldn't rendered", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: data,
      }),
      AxiosMock.post.mockResolvedValueOnce({
        data: {
          headers: ["Jan 2022"],
          charts: [
            {
              chart_uuid: "91a00d2c-d7ee-4a91-b85d-9538bd888053",
              chart_name: "Total Revenues",
              type: "Monetary",
              is_kpi: false,
              color: "#038269",
              values: [
                {
                  key: "Jan 2022",
                  standard: 3060000.0,
                  moving_average: 3060000.0,
                },
              ],
            },
          ],
        },
      }),
    ]);

    window.ResizeObserver = ResizeObserver;
    const companyPreferencesFilter = {
      viewChartTA: false,
      selectedMetricsOptionsTA: [],
      predefineChartTA: "Cash Conversion Cycle",
    };
    const companyPreferencesApi = {
      selectedMetricsTA: [
        {
          uuid: "91a00d2c",
          name: "Total Revenues",
          type: "Monetary",
          is_kpi: false,
        },
      ],
    };
    window.localStorage.setItem(
      "1_filter",
      JSON.stringify(companyPreferencesFilter)
    );
    window.localStorage.setItem("1_api", JSON.stringify(companyPreferencesApi));
    render(
      <BrowserRouter>
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
                    is_analysis_ready: true,
                    is_kpi_ready: true,
                    uuid: 1,
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
                    <TrendAnalysis />
                  </CompanyPreferencesFilterContext.Provider>
                </CompanyPreferencesApiContext.Provider>
              </CompaniesContext.Provider>
            </TimeFrameContext.Provider>
          </SubscriptionContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith("analysis/trend_analysis/1/");
    });
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("table_view")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("currency__div_EGP")).not.toBeInTheDocument();
    });
  });
});
