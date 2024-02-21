import React from "react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import Reports from "./Reports";
import { data } from "./create-report/dummyData";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import DeleteSingleReportModal from "../../../components/modals/delete-single-report/DeleteSingleReportModal";
import { TimeFrameContext } from "../../../contexts/TimeFrameContext";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";

jest.mock("axios");

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const responseReports = [
  {
    uuid: "1",
    title: "Report 1",
    period: "Jan 2023",
    description: "This is the description of report 1",
    date: "Jan 2021",
    last_update: "1 min ago",
    color: "cyan",
    is_valid: true,
  },
  {
    uuid: "2",
    title: "Report 2",
    period: "Feb 2023",
    description: "This is the description of report 2",
    date: "Jan 2021",
    last_update: "10 min ago",
    color: "red",
    is_valid: true,
  },
  {
    uuid: "3",
    title: "Report 3",
    period: "Apr 2023",
    description: "This is the description of report 3",
    date: "Jan 2021",
    last_update: "1 hour ago",
    color: "green",
    is_valid: true,
  },
  {
    uuid: "4",
    title: "Report 4",
    period: "March 2023",
    description: "This is the description of report 4",
    date: "Jan 2021",
    last_update: "1 day ago",
    color: "yellow",
    is_valid: false,
  },
];

const recentReports = [
  {
    frequency_period: "month",
    period: "Nov 2023",
    template_ref: "b5d1079c-26b3-421d-9b97-0dcd3bd656c3",
    title: "trend22",
    uuid: "9b80a3f2-7d6a-41d1-82a7-7aa3171f5d28",
    user_uuid: "60d6cf1b-919a-42c9-b3dc-c2d2ccb7b783",
    company_uuid: "fd5db168-2b04-45b1-a109-cb05a94ef268",
    created: "2023-09-27T13:04:15.934247Z",
    modified: "2023-09-27T15:39:11.743567Z",
    is_valid: false,
    cover: {
      show_logo: true,
      report_title: "trend22",
      background_color: "#ffffff",
      fore_color: "#000000",
      section_body:
        "<h3>In this report, we present the monthly performance analysis for [Company Name]</h3><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><h3>This report includes:</h3><ol><li><p>Periodical Returns Analysis Summary.</p></li><li><p>Periodical Returns Analysis Variables.</p></li><li><p>Annualized Returns Analysis Summary.</p></li><li><p>Annualized Returns Analysis Variables.</p></li></ol>",
      uuid: "06d60a49-d039-4106-86b6-147b9aa72916",
      report_uuid: "9b80a3f2-7d6a-41d1-82a7-7aa3171f5d28",
      logo: "https://dev-api.femtofpa.com/media/60d6cf1b-919a-42c9-b3dc-c2d2ccb7b783/companies/Trade%20Corp%20LLC/Trade_Corp_LLC..png",
      company_name: "Trade Corp LLC",
      period: "Nov 2023",
      published_on: "2023-09-27T13:04:15.934247Z",
      published_by: "Katy Nakhla",
      created: "2023-09-27T13:04:15.934247Z",
      modified: "2023-09-27T15:39:11.743567Z",
    },
  },
];
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "1",
  }),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

const timeFrameRequestData = {
  initial_value: {
    frequency_period: "month",
    period: "October",
    year: "2023/2024",
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

describe("Reports List", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const singleDeleteHandlers = {
    open: () => {
      return (
        <DeleteSingleReportModal
          deleteReportUUid={"1"}
          singleDeleteHandlers={singleDeleteHandlers}
          deleteSingleReport={() => jest.fn()}
          deleteLoader={false}
        />
      );
    },
  };

  it("when click on create report button , the popup should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({ data: responseReports });
    AxiosMock.get.mockResolvedValueOnce({ data: responseReports });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    const createReportBtn = screen.getByTestId("create_report_btn");
    fireEvent.click(createReportBtn);

    expect(screen.getByTestId("create_modal")).toBeInTheDocument();
  });

  it("when click on create report button , and fill all inputs then click on create button , the request should send", async () => {
    AxiosMock.get.mockResolvedValueOnce({ data: responseReports });
    AxiosMock.get.mockResolvedValueOnce({ data: recentReports });

    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            canCreateReport: jest.fn(() => {
              return true;
            }),
          }}
        >
          <TimeFrameContext.Provider
            value={{
              timeFrameRequestData,
            }}
          >
            <CompaniesContext.Provider
              value={{
                selectedCompany: { uuid: 1 },
                isSelectedCompanyReady: true,
                fetchSelectedCompany: jest.fn(),
              }}
            >
              <BreadcrumbsContext.Provider
                value={{
                  breadcrumbs: [
                    {
                      title: "Reports",
                    },
                  ],
                  setBreadCrumbs: jest.fn(),
                }}
              >
                <Reports />
              </BreadcrumbsContext.Provider>
            </CompaniesContext.Provider>
          </TimeFrameContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports/recent", {
        params: { company_uuid: 1 },
      });
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    const createReportBtn = screen.getByTestId("create_report_btn");
    fireEvent.click(createReportBtn);

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("report/reports/template", {
        params: { company_uuid: 1 },
      });
    });

    expect(screen.getByTestId("create_modal")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("create_step_one")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("template_1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("template_name_1")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("template_name_1"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("create_step_two")).toBeInTheDocument();
    });

    AxiosMock.post.mockResolvedValueOnce({
      data: {},
    });

    const report_name = screen.getByTestId("report_name");
    fireEvent.change(report_name, { target: { value: "report 1" } });

    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Quarterly"));
    await waitFor(() => {
      expect(screen.getByTestId("submit_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("submit_btn"));

    expect(AxiosMock.post).toHaveBeenCalledTimes(1);
  });

  it("when click on create report button , and fill the form , and not  all inputs are filled then click on create button , the request shouldn't send", async () => {
    AxiosMock.get.mockResolvedValueOnce({ data: responseReports });
    AxiosMock.get.mockResolvedValueOnce({ data: recentReports });

    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            canCreateReport: jest.fn(() => {
              return true;
            }),
          }}
        >
          <TimeFrameContext.Provider
            value={{
              timeFrameRequestData,
            }}
          >
            <CompaniesContext.Provider
              value={{
                selectedCompany: { uuid: 1 },
                isSelectedCompanyReady: true,
                fetchSelectedCompany: jest.fn(),
              }}
            >
              <BreadcrumbsContext.Provider
                value={{
                  breadcrumbs: [
                    {
                      title: "Reports",
                    },
                  ],
                  setBreadCrumbs: jest.fn(),
                }}
              >
                <Reports />
              </BreadcrumbsContext.Provider>
            </CompaniesContext.Provider>
          </TimeFrameContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    window.ResizeObserver = ResizeObserver;

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports/recent", {
        params: { company_uuid: 1 },
      });
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    const createReportBtn = screen.getByTestId("create_report_btn");
    fireEvent.click(createReportBtn);

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("report/reports/template", {
        params: { company_uuid: 1 },
      });
    });

    expect(screen.getByTestId("create_modal")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("create_step_one")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("template_1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("template_name_1")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("template_name_1"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("create_step_two")).toBeInTheDocument();
    });

    AxiosMock.post.mockResolvedValueOnce({
      data: {},
    });

    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Quarterly"));
    await waitFor(() => {
      expect(screen.getByTestId("submit_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("submit_btn"));
    expect(screen.getByText("Report name cannot be empty")).toBeInTheDocument();

    expect(AxiosMock.post).not.toHaveBeenCalledTimes(1);
  });

  it("when click on create report button and fill the form , but the user has a free subscription plan , the UpgradeSubscriptionForReportKit popup should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({ data: responseReports });
    AxiosMock.get.mockResolvedValueOnce({ data: recentReports });

    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            canCreateReport: jest.fn(() => {
              return false;
            }),
          }}
        >
          <TimeFrameContext.Provider
            value={{
              timeFrameRequestData,
            }}
          >
            <CompaniesContext.Provider
              value={{
                selectedCompany: { uuid: 1 },
                isSelectedCompanyReady: true,
                fetchSelectedCompany: jest.fn(),
              }}
            >
              <BreadcrumbsContext.Provider
                value={{
                  breadcrumbs: [
                    {
                      title: "Reports",
                    },
                  ],
                  setBreadCrumbs: jest.fn(),
                }}
              >
                <Reports />
              </BreadcrumbsContext.Provider>
            </CompaniesContext.Provider>
          </TimeFrameContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    window.ResizeObserver = ResizeObserver;

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports/recent", {
        params: { company_uuid: 1 },
      });
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    const createReportBtn = screen.getByTestId("create_report_btn");
    fireEvent.click(createReportBtn);

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("report/reports/template", {
        params: { company_uuid: 1 },
      });
    });

    expect(screen.getByTestId("create_modal")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("create_step_one")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("template_1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("template_name_1")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("template_name_1"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("create_step_two")).toBeInTheDocument();
    });

    AxiosMock.post.mockResolvedValueOnce({
      data: {},
    });
    const report_name = screen.getByTestId("report_name");
    fireEvent.change(report_name, { target: { value: "report 1" } });

    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Quarterly"));
    await waitFor(() => {
      expect(screen.getByTestId("submit_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("submit_btn"));

    await waitFor(() => {
      expect(
        screen.getByTestId("upgrade_subscription_for_report_kit")
      ).toBeInTheDocument();
    });
  });

  it("when click on go to subscription settings in UpgradeSubscriptionForReportKit popup, it should navigate", async () => {
    AxiosMock.get.mockResolvedValueOnce({ data: responseReports });
    AxiosMock.get.mockResolvedValueOnce({ data: recentReports });

    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            canCreateReport: jest.fn(() => {
              return false;
            }),
          }}
        >
          <TimeFrameContext.Provider
            value={{
              timeFrameRequestData,
            }}
          >
            <CompaniesContext.Provider
              value={{
                selectedCompany: { uuid: 1 },
                isSelectedCompanyReady: true,
                fetchSelectedCompany: jest.fn(),
              }}
            >
              <BreadcrumbsContext.Provider
                value={{
                  breadcrumbs: [
                    {
                      title: "Reports",
                    },
                  ],
                  setBreadCrumbs: jest.fn(),
                }}
              >
                <Reports />
              </BreadcrumbsContext.Provider>
            </CompaniesContext.Provider>
          </TimeFrameContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports/recent", {
        params: { company_uuid: 1 },
      });
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    const createReportBtn = screen.getByTestId("create_report_btn");
    fireEvent.click(createReportBtn);

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("report/reports/template", {
        params: { company_uuid: 1 },
      });
    });

    expect(screen.getByTestId("create_modal")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("create_step_one")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("template_1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("template_name_1")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("template_name_1"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("create_step_two")).toBeInTheDocument();
    });

    AxiosMock.post.mockResolvedValueOnce({
      data: {},
    });

    const report_name = screen.getByTestId("report_name");
    fireEvent.change(report_name, { target: { value: "report 1" } });

    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Quarterly"));
    await waitFor(() => {
      expect(screen.getByTestId("submit_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("submit_btn"));

    await waitFor(() => {
      expect(
        screen.getByTestId("upgrade_subscription_for_report_kit")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("go_to_subscription_settings")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("go_to_subscription_settings"));
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        "/organisation-settings/subscription-settings"
      );
    });
  });

  it("should call get reports with default params", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({ data: responseReports });
    AxiosMock.get.mockResolvedValueOnce({ data: responseReports });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });
  });

  it("the search input shouldn't appear till fetch the report list", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("table__section")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("search_input")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("search_input")).toBeInTheDocument();
    });
  });

  it("the search input should still exist after search by value and the result = []", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("table__section")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("search_input")).toBeInTheDocument();
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: [],
      },
    });

    fireEvent.change(screen.getByTestId("search_input"), {
      target: { value: "test" },
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_value: "test",
          search_key: "title",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("search_input")).toBeInTheDocument();
    });
  });

  it("should call get reports with default params and again when changing search value", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("table__section")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("search_input")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("search_input"), {
      target: { value: "test" },
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_value: "test",
          search_key: "title",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });
  });

  it("should call get reports with default params and again when changing sort value", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("list-section")).toBeInTheDocument();
    });

    const sortingBtn = screen.getByTestId("d-title-none");

    fireEvent.click(sortingBtn);
    await waitFor(() => {
      expect(screen.getByTestId("list-section")).toBeInTheDocument();
    });

    const sortingBtnChanged = screen.getByTestId("d-title-desc");

    await waitFor(() => {
      expect(sortingBtnChanged).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_value: "",
          search_key: "title",
          size: 10,
          sort_key: "title",
          sort_order: "desc",
        },
      });
    });
  });

  it("should call get reports with default params and show empty list", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: [],
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: [],
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: [],
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("empty__list")).toBeInTheDocument();
    });
  });

  it("should render reports, select one and see the message appearing", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("checkbox_1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("checkbox_1"));

    await waitFor(() => {
      expect(screen.getByTestId("selected_count")).toHaveTextContent(
        "1 Report selected"
      );
    });
  });

  it("should render the recents and open the delete option popover should appear,when click on it the confirm modal should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("options_0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("options_0"));

    await waitFor(() => {
      expect(screen.getByTestId("options_popover")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("delete_recent_report")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("delete_recent_report"));

    await waitFor(() => {
      expect(screen.getByTestId("single__delete__modal")).toBeInTheDocument();
    });
  });

  it("when click on delete icon for one report in the list the confirm modal should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("delete_list_report_1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("delete_list_report_1"));

    await waitFor(() => {
      expect(screen.getByTestId("single__delete__modal")).toBeInTheDocument();
    });
  });

  it("should render reports, select one and click on delete icon , the confirm modal should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("checkbox_1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("checkbox_1"));

    await waitFor(() => {
      expect(screen.getByTestId("selected_count")).toHaveTextContent(
        "1 Report selected"
      );
    });
    fireEvent.click(screen.getByTestId("delete_multiple_reports_icon"));

    await waitFor(() => {
      expect(screen.getByTestId("multiple__delete__modal")).toBeInTheDocument();
    });
  });

  it("when confirm the bulk delete , the request should send", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    AxiosMock.delete.mockResolvedValueOnce({
      data: {
        items: data,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith("/report/reports", {
        params: {
          company_uuid: 1,
          page: 1,
          search_key: "title",
          search_value: "",
          size: 10,
          sort_key: "modified",
          sort_order: "desc",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("checkbox_0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("checkbox_0"));

    await waitFor(() => {
      expect(screen.getByTestId("selected_count")).toHaveTextContent(
        "1 Report selected"
      );
    });
    fireEvent.click(screen.getByTestId("delete_multiple_reports_icon"));

    await waitFor(() => {
      expect(screen.getByTestId("multiple__delete__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_bulk_delete"));
    await waitFor(() => {
      expect(AxiosMock.delete).toBeCalledTimes(1);
    });
  });

  it("when confirm the single delete , the request should send", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.delete.mockResolvedValueOnce({
      data: {
        items: data,
      },
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("delete_list_report_0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("delete_list_report_0"));

    await waitFor(() => {
      expect(screen.getByTestId("single__delete__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_bulk_delete"));
    await waitFor(() => {
      expect(AxiosMock.delete).toBeCalledTimes(1);
    });
  });

  it("if the report is invalid, the invalid flag should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.delete.mockResolvedValueOnce({
      data: {
        items: data,
      },
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("invalid_flag_4")).toBeInTheDocument();
    });
  });

  it("if the report is invalid and click on report name or edit icon, the edit popup should appear in list of reports", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.delete.mockResolvedValueOnce({
      data: {
        items: data,
      },
    });
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData: {
              timeframe: {},
              initial_value: { frequency_period: "month" },
            },
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: 1 },
              isSelectedCompanyReady: true,
              fetchSelectedCompany: jest.fn(),
            }}
          >
            <BreadcrumbsContext.Provider
              value={{
                breadcrumbs: [
                  {
                    title: "Reports",
                  },
                ],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  canCreateReport: jest.fn(() => {
                    return true;
                  }),
                }}
              >
                <Reports />
              </SubscriptionContext.Provider>
            </BreadcrumbsContext.Provider>
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("invalid_flag_4")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("report_list_title_Report 4")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("report_list_title_Report 4"));

    await waitFor(() => {
      expect(
        screen.getByTestId("edit_report_period_modal")
      ).toBeInTheDocument();
    });
  });

  it("if the report is invalid and click on report name or edit icon, the edit popup should appear in recents list", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.delete.mockResolvedValueOnce({
      data: {
        items: data,
      },
    });
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData: {
              timeframe: {},
              initial_value: { frequency_period: "month" },
            },
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: 1 },
              isSelectedCompanyReady: true,
              fetchSelectedCompany: jest.fn(),
            }}
          >
            <BreadcrumbsContext.Provider
              value={{
                breadcrumbs: [
                  {
                    title: "Reports",
                  },
                ],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  canCreateReport: jest.fn(() => {
                    return true;
                  }),
                }}
              >
                <Reports />
              </SubscriptionContext.Provider>
            </BreadcrumbsContext.Provider>
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "invalid_report_9b80a3f2-7d6a-41d1-82a7-7aa3171f5d28"
        )
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("grid_report_title_trend22")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("grid_report_title_trend22"));

    await waitFor(() => {
      expect(
        screen.getByTestId("edit_report_period_modal")
      ).toBeInTheDocument();
    });
  });

  it("when click on update in edit popup , the request should be sent", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.delete.mockResolvedValueOnce({
      data: {
        items: data,
      },
    });

    AxiosMock.put.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData: {
              timeframe: ["2022"],
              initial_value: { frequency_period: "year" },
            },
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: 1 },
              isSelectedCompanyReady: true,
              fetchSelectedCompany: jest.fn(),
            }}
          >
            <BreadcrumbsContext.Provider
              value={{
                breadcrumbs: [
                  {
                    title: "Reports",
                  },
                ],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  canCreateReport: jest.fn(() => {
                    return true;
                  }),
                }}
              >
                <Reports />
              </SubscriptionContext.Provider>
            </BreadcrumbsContext.Provider>
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "invalid_report_9b80a3f2-7d6a-41d1-82a7-7aa3171f5d28"
        )
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("grid_report_title_trend22")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("grid_report_title_trend22"));

    await waitFor(() => {
      expect(
        screen.getByTestId("edit_report_period_modal")
      ).toBeInTheDocument();
    });

    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Annual"));

    await waitFor(() => {
      expect(
        screen.getByTestId("update_report_period_btn")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("update_report_period_btn"));

    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledTimes(1);
    });
  });

  /// lock report features

  it("if the report features are locked , the upgrade link should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.delete.mockResolvedValueOnce({
      data: {
        items: data,
      },
    });

    AxiosMock.put.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData: {
              timeframe: ["2022"],
              initial_value: { frequency_period: "year" },
            },
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: 1 },
              isSelectedCompanyReady: true,
              fetchSelectedCompany: jest.fn(),
            }}
          >
            <BreadcrumbsContext.Provider
              value={{
                breadcrumbs: [
                  {
                    title: "Reports",
                  },
                ],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  canCreateReport: jest.fn(() => {
                    return false;
                  }),
                }}
              >
                <Reports />
              </SubscriptionContext.Provider>
            </BreadcrumbsContext.Provider>
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("upgrade_link")).toBeInTheDocument();
    });
  });

  it("if the report features are locked , the options in recent card are locked and the card is disabled", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.delete.mockResolvedValueOnce({
      data: {
        items: data,
      },
    });

    AxiosMock.put.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData: {
              timeframe: ["2022"],
              initial_value: { frequency_period: "year" },
            },
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: 1 },
              isSelectedCompanyReady: true,
              fetchSelectedCompany: jest.fn(),
            }}
          >
            <BreadcrumbsContext.Provider
              value={{
                breadcrumbs: [
                  {
                    title: "Reports",
                  },
                ],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  canCreateReport: jest.fn(() => {
                    return false;
                  }),
                }}
              >
                <Reports />
              </SubscriptionContext.Provider>
            </BreadcrumbsContext.Provider>
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("recent_lock_icon")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("lock_overlay")).toBeInTheDocument();
    });
  });

  it("if the report features are locked , the lock icon should replace the checkboxe in the report list", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.delete.mockResolvedValueOnce({
      data: {
        items: data,
      },
    });

    AxiosMock.put.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData: {
              timeframe: ["2022"],
              initial_value: { frequency_period: "year" },
            },
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: 1 },
              isSelectedCompanyReady: true,
              fetchSelectedCompany: jest.fn(),
            }}
          >
            <BreadcrumbsContext.Provider
              value={{
                breadcrumbs: [
                  {
                    title: "Reports",
                  },
                ],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  canCreateReport: jest.fn(() => {
                    return false;
                  }),
                }}
              >
                <Reports />
              </SubscriptionContext.Provider>
            </BreadcrumbsContext.Provider>
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    });
  });

  it("if the report features are locked , when click on delete icon the confirm modal shouldn't appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return false;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("delete_list_report_1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("delete_list_report_1"));

    await waitFor(() => {
      expect(screen.queryByTestId("single__delete__modal")).toBeNull();
    });
  });

  it("if the report features are locked , when click on edit icon the handleReportClick didn't called", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });

    const handleReportClick = jest.fn();
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: jest.fn(),
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return false;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_report_1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit_report_1"));

    await waitFor(() => {
      expect(handleReportClick).toBeCalledTimes(0);
    });
  });

  it("the fetchSelectedCompany method should be called before call any request", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: recentReports,
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        items: responseReports,
      },
    });
    const fetchSelectedCompanyFn = jest.fn();
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: { uuid: 1 },
            isSelectedCompanyReady: true,
            fetchSelectedCompany: fetchSelectedCompanyFn,
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return false;
                }),
              }}
            >
              <Reports />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(fetchSelectedCompanyFn).toBeCalled();
    });
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
  });
});
