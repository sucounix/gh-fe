import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import ViewReport from "./ViewReport";
import {
  data,
  validReportData,
  inValidReportData,
} from "./dummy-data/ViewReportDummyData";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";

jest.mock("axios");

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

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

describe("View Report details", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when fetch the report details, the header section should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              logo: null,
              currency: "EGP",
            },
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
              <ViewReport />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("report_cover_section")).toBeInTheDocument();
    });
  });

  it("when fetch the report details, the table component should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: data,
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              logo: null,
              currency: "EGP",
            },
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
              <ViewReport />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("table_component_0_1")).toBeInTheDocument();
    });
  });

  it("when click on download the file should be downloaded", async () => {
    const file = new Blob([], { type: "application/pdf" });

    AxiosMock.get.mockResolvedValueOnce({
      data: validReportData,
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: file,
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              logo: null,
              currency: "EGP",
            },
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
              <ViewReport />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("download__btn")).toBeInTheDocument();
    });

    screen.getByTestId("download__btn").click();

    await waitFor(() => {
      expect(
        screen.getByTestId("download_in_progress_div")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });
  });

  it("If the component is invalid , the blurred component should render", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: inValidReportData,
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
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
            <ViewReport />
          </SubscriptionContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("invalid_component_0226")).toBeInTheDocument();
    });
  });

  it("If the component is invalid , the blurred component should render and the user can edit this component again", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: inValidReportData,
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              logo: null,
              currency: "EGP",
            },
          }}
        >
          <TimeFrameContext.Provider
            value={{
              timeFrameRequestData,
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
                <ViewReport />
              </SubscriptionContext.Provider>
            </BreadcrumbsContext.Provider>
          </TimeFrameContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("invalid_component_0226")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("edit_item_icon_0_0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit_item_icon_0_0"));

    await waitFor(() => {
      expect(screen.getByTestId("edit_drawer")).toBeInTheDocument();
    });
  });
});
