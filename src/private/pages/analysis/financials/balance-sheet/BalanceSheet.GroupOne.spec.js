import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BalanceSheet from "./BalanceSheet";
import AxiosMock from "axios";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";
import { mockdataBS } from "./MockData";
import { useState } from "react";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "123",
  }),
}));

const timeFrameResult = {
  actual_year: 2020,
  frequency_period: "month",
  period: "August",
  year_range: "2019/2020",
};

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
const WrapperBs = () => {
  const [api_value, setApiValue] = useState({
    viewBS: { value: "Summary", testId: "Summary" },
    hideYoYBS: false,
  });
  const [filter_value] = useState({
    viewCurrentFirstBS: true,
    viewEquityPlusLiabilitiesBS: true,
  });
  return (
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
        setCompanies: jest.fn(),
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
          <CompanyPreferencesApiContext.Provider
            value={{
              companyPreferencesApi: { ...api_value },
              setCompanyAPIPreferences: (e) => {
                setApiValue({ ...e });
              },
            }}
          >
            <CompanyPreferencesFilterContext.Provider
              value={{
                companyPreferencesFilter: filter_value,
                setCompanyFilterPreferences: jest.fn(),
                getCompanyFilterPreferences: jest.fn(),
              }}
            >
              <BalanceSheet />
            </CompanyPreferencesFilterContext.Provider>
          </CompanyPreferencesApiContext.Provider>
        </TimeFrameContext.Provider>
      </BreadcrumbsContext.Provider>
    </CompaniesContext.Provider>
  );
};
describe("balance sheet", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("if the balance sheet filter (viewCurrentFirst = true) , then should render (current) then (non-current)", async () => {
    Promise.resolve(AxiosMock.get.mockResolvedValueOnce({ data: mockdataBS }));
    let new_filter_value = {
      viewCurrentFirstBS: true,
      viewEquityPlusLiabilitiesBS: true,
    };
    window.localStorage.setItem(
      "balance_sheet_filter",
      JSON.stringify(new_filter_value)
    );

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
                companyPreferencesApi: {},
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
                <BalanceSheet />
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </TimeFrameContext.Provider>
        </BreadcrumbsContext.Provider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.getAllByTestId("group_title_0_BS_Current Assets")[0]
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getAllByTestId("group_title_4_BS_Current Liabilities")[0]
      ).toBeInTheDocument();
    });
  });

  it("if the balance sheet filter (viewCurrentFirst = false) , then should render (non-current) then (current)", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: mockdataBS,
      })
    );
    let new_filter_value = {
      showSamePeriodLastYearBS: true,
      viewCurrentFirstBS: false,
      viewEquityPlusLiabilitiesBS: true,
    };
    window.localStorage.setItem(
      "balance_sheet_filter",
      JSON.stringify(new_filter_value)
    );

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
          setCompanies: jest.fn(),
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
            <CompanyPreferencesApiContext.Provider
              value={{
                companyPreferencesApi: {},
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
                <BalanceSheet />
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </TimeFrameContext.Provider>
        </BreadcrumbsContext.Provider>
      </CompaniesContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.getAllByTestId("group_title_0_BS_Non Current Assets")[0]
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getAllByTestId("group_title_4_BS_Non Current Liabilities")[0]
      ).toBeInTheDocument();
    });
  });

  it("if the balance sheet filter (viewEquityPlusLiabilities = true) , then should render (Equity) then (Liabilities)", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: mockdataBS,
      })
    );
    let new_filter_value = {
      showSamePeriodLastYearBS: true,
      viewCurrentFirstBS: true,
      viewEquityPlusLiabilitiesBS: true,
    };
    window.localStorage.setItem(
      "balance_sheet_filter",
      JSON.stringify(new_filter_value)
    );

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
          setCompanies: jest.fn(),
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
            <CompanyPreferencesApiContext.Provider
              value={{
                companyPreferencesApi: {},
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
                <BalanceSheet />
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </TimeFrameContext.Provider>
        </BreadcrumbsContext.Provider>
      </CompaniesContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.getAllByTestId("group_title_3_BS_Equity")[0]
      ).toBeInTheDocument();
    });
  });

  it("if the balance sheet filter (viewEquityPlusLiabilities = false) , then should render (Liabilities) then (Equity)", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: mockdataBS,
      })
    );
    let new_filter_value = {
      showSamePeriodLastYearBS: true,
      viewCurrentFirstBS: true,
      viewEquityPlusLiabilitiesBS: false,
    };
    window.localStorage.setItem(
      "balance_sheet_filter",
      JSON.stringify(new_filter_value)
    );

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
          setCompanies: jest.fn(),
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
            <CompanyPreferencesApiContext.Provider
              value={{
                companyPreferencesApi: {},
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
                <BalanceSheet />
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </TimeFrameContext.Provider>
        </BreadcrumbsContext.Provider>
      </CompaniesContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(
        screen.getAllByTestId("group_title_3_BS_Current Liabilities")[0]
      ).toBeInTheDocument();
    });
  });

  it("if the balance sheet api ( hideYoYBS: false,) , then should call the api according to it", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: mockdataBS,
      })
    );
    let new_filter_value = {
      viewCurrentFirstBS: false,
      viewEquityPlusLiabilitiesBS: false,
    };
    window.localStorage.setItem(
      "balance_sheet_filter",
      JSON.stringify(new_filter_value)
    );

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
          setCompanies: jest.fn(),
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
            <CompanyPreferencesApiContext.Provider
              value={{
                companyPreferencesApi: {
                  hideYoYBS: false,
                },
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
                <BalanceSheet />
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </TimeFrameContext.Provider>
        </BreadcrumbsContext.Provider>
      </CompaniesContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "Balance Sheet",
            financial_year: 2020,
            is_hide: false,
            is_summary: false,
            period: "August",
            view_name: null,
            view_type: undefined,
          },
        }
      );
    });
  });

  it("if the balance sheet api ( hideYoYBS: true) , then should call the api according to it", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: mockdataBS,
      })
    );
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: mockdataBS,
      })
    );
    let new_filter_value = {
      viewCurrentFirstBS: false,
      viewEquityPlusLiabilitiesBS: false,
    };
    window.localStorage.setItem(
      "balance_sheet_filter",
      JSON.stringify(new_filter_value)
    );

    window.ResizeObserver = ResizeObserver;
    render(<WrapperBs />);
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "Balance Sheet",
            financial_year: 2020,
            is_hide: false,
            is_summary: false,
            period: "August",
            view_name: null,
            view_type: "Summary",
          },
        }
      );
    });

    fireEvent.click(screen.getByText("Hide"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "Balance Sheet",
            financial_year: 2020,
            is_hide: true,
            is_summary: false,
            period: "August",
            view_name: null,
            view_type: "Summary",
          },
        }
      );
    });
  });

  it("when change balance sheet filteration, the saved filter value in local storage is changed also", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: mockdataBS,
      })
    );
    let filter_value = {
      showSamePeriodLastYearBS: false,
      viewCurrentFirstBS: false,
      viewEquityPlusLiabilitiesBS: false,
    };

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
          setCompanies: jest.fn(),
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
            <CompaniesContext.Provider
              value={{
                selectedCompany: {
                  uuid: 123,
                  currency: "USD",
                  is_analysis_ready: true,
                },
                isTimeframeReady: true,
                isAPIPreferencesReady: true,
                fetchSelectedCompany: jest.fn(),
                isSelectedCompanyReady: true,
              }}
            >
              <CompanyPreferencesApiContext.Provider
                value={{
                  companyPreferencesApi: {},
                  setCompanyAPIPreferences: jest.fn(),
                }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{
                    companyPreferencesFilter: filter_value,
                    setCompanyFilterPreferences: jest.fn(() => {
                      window.localStorage.setItem(
                        "123_filter",
                        JSON.stringify({
                          showSamePeriodLastYearBS: true,
                          viewCurrentFirstBS: true,
                          viewEquityPlusLiabilitiesBS: true,
                        })
                      );
                    }),
                    getCompanyFilterPreferences: jest.fn(),
                  }}
                >
                  <BalanceSheet />
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </CompaniesContext.Provider>
          </TimeFrameContext.Provider>
        </BreadcrumbsContext.Provider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });

    await waitFor(() => {
      const EquityPlusLiabilities = screen.getByTestId(
        "tab_Assets = Equity + Liabilities"
      );
      expect(EquityPlusLiabilities).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(EquityPlusLiabilities);
    });
    await waitFor(() => {
      let new_filter = JSON.parse(localStorage.getItem("123_filter"));
      expect(new_filter.viewEquityPlusLiabilitiesBS).toEqual(true);
    });
  });

  it("when select a view type , the request should send", async () => {
    Promise.resolve(AxiosMock.get.mockResolvedValueOnce({ data: mockdataBS }));

    window.ResizeObserver = ResizeObserver;
    render(<WrapperBs />);

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "Balance Sheet",
            financial_year: 2020,
            is_summary: false,
            period: "August",
            view_name: null,
            view_type: "Summary",
            is_hide: false,
          },
        }
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("select-view-type-BS")).toBeVisible();
    });
    Promise.resolve(AxiosMock.get.mockResolvedValueOnce({ data: mockdataBS }));

    fireEvent.click(screen.getByTestId("select-view-type-BS"));
    fireEvent.click(screen.getByText("Accounts"));
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(
        "/analysis/analysis_statement/123/",
        {
          params: {
            analysis_statement: "Balance Sheet",
            financial_year: 2020,
            is_summary: false,
            period: "August",
            view_name: null,
            view_type: "Management accounts",
            is_hide: false,
          },
        }
      );
    });
  });
});
