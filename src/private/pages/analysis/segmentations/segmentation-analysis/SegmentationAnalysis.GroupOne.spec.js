import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SegmentationAnalysis from "./SegmentationAnalysis";
import { BrowserRouter } from "react-router-dom";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";

const mockedUseParams = jest.fn().mockReturnValue({
  id: "1",
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => mockedUseParams,
}));

const segTableNonMonetary = {
  "Volume Fulfillment": {
    columns: [{ col_data: "Volume Fulfillment" }],
    extra: { requirements: ["Revenue"] },
    headers: {
      analysis_statement: "Segmentation Analysis",
      columns_length: 8,
      financial_year: "2023",
      period: "December",
      view_name: "Volume Fulfillment",
    },
    rows: [
      {
        row: {
          columns: [],
          requirements: "",
          rows: [
            {
              display_type: "normal",
              row: [
                {
                  col_data: "Retail SKUs Local Revenues",
                  col_type: "text",
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
const segTable = {
  "Revenue Segmentation": {
    columns: [{ col_data: "Revenue Segmentation" }],
    extra: { requirements: ["Revenue"] },
    headers: {
      analysis_statement: "Segmentation Analysis",
      columns_length: 8,
      financial_year: "2023",
      period: "December",
      view_name: "Revenue Segmentation",
    },
    rows: [
      {
        row: {
          columns: [],
          requirements: "",
          rows: [
            {
              display_type: "normal",
              row: [
                {
                  col_data: "Retail SKUs Local Revenues",
                  col_type: "text",
                },
              ],
            },
          ],
        },
      },
    ],
  },
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

describe("SegmentationAnalysis", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const segmentationTables = {};
  const segmentationMetrics = ["Metric 1", "Metric 2"];
  const segmentationLoading = false;
  const renderUploadView = jest.fn();
  const fetchSegmentation = jest.fn();
  const removeTable = jest.fn();

  test("renders SegmentationAnalysis component", () => {
    render(
      <BrowserRouter>
        <CompanyPreferencesFilterContext.Provider
          value={{
            selectedMetricsSeg: [],
          }}
        >
          <SegmentationAnalysis
            segmentationTables={segmentationTables}
            segmentationMetrics={segmentationMetrics}
            segmentationLoading={segmentationLoading}
            renderUploadView={renderUploadView}
            fetchSegmentation={fetchSegmentation}
            removeTable={removeTable}
          />
        </CompanyPreferencesFilterContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("segmentation-analysis")).toBeInTheDocument();
  });

  test("calls handleMetricSelect when a metric is clicked", async () => {
    render(
      <BrowserRouter>
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter: {
              selectedMetricsSeg: [],
            },
            setCompanyFilterPreferences: jest.fn(),
          }}
        >
          <SegmentationAnalysis
            segmentationTables={segmentationTables}
            segmentationMetrics={segmentationMetrics}
            segmentationLoading={segmentationLoading}
            renderUploadView={renderUploadView}
            fetchSegmentation={fetchSegmentation}
            removeTable={removeTable}
          />
        </CompanyPreferencesFilterContext.Provider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("carousel_Metric 1"));

    await waitFor(() => {
      expect(fetchSegmentation).toHaveBeenCalledWith("Metric 1");
    });
  });

  it("if the table is a monetary type, the flag currency should be rendered", async () => {
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameResult,
            timeFrameRequestData,
            handleSelectTimeFrame: jest.fn(),
          }}
        >
          <CompanyPreferencesFilterContext.Provider
            value={{
              companyPreferencesFilter: {
                selectedMetricsSeg: ["Revenue Segmentation"],
              },
              setCompanyFilterPreferences: jest.fn(),
            }}
          >
            <CompanyPreferencesApiContext.Provider
              value={{
                companyPreferencesApi: {
                  selectedMetricsSeg: ["Revenue Segmentation"],
                },
                setCompanyAPIPreferences: jest.fn(),
              }}
            >
              <CompaniesContext.Provider
                value={{
                  selectedCompany: {
                    currency: "EGP",
                  },
                }}
              >
                <SegmentationAnalysis
                  segmentationTables={segTable}
                  segmentationMetrics={["Revenue Segmentation"]}
                  segmentationLoading={segmentationLoading}
                  renderUploadView={renderUploadView}
                  fetchSegmentation={fetchSegmentation}
                  removeTable={removeTable}
                />
              </CompaniesContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </CompanyPreferencesFilterContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("seg_table_div_0")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("currency_div_EGP")).toBeInTheDocument();
    });
  });

  it("if the table is a non monetary type, the flag currency shouldn't be rendered", async () => {
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameResult,
            timeFrameRequestData,
            handleSelectTimeFrame: jest.fn(),
          }}
        >
          <CompanyPreferencesFilterContext.Provider
            value={{
              companyPreferencesFilter: {
                selectedMetricsSeg: ["Revenue Segmentation"],
              },
              setCompanyFilterPreferences: jest.fn(),
            }}
          >
            <CompanyPreferencesApiContext.Provider
              value={{
                companyPreferencesApi: {
                  selectedMetricsSeg: ["Revenue Segmentation"],
                },
                setCompanyAPIPreferences: jest.fn(),
              }}
            >
              <CompaniesContext.Provider
                value={{
                  selectedCompany: {
                    currency: "EGP",
                  },
                }}
              >
                <SegmentationAnalysis
                  segmentationTables={segTableNonMonetary}
                  segmentationMetrics={["Volume Fulfillment"]}
                  segmentationLoading={segmentationLoading}
                  renderUploadView={renderUploadView}
                  fetchSegmentation={fetchSegmentation}
                  removeTable={removeTable}
                />
              </CompaniesContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </CompanyPreferencesFilterContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("seg_table_div_0")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("currency_div_EGP")).not.toBeInTheDocument();
    });
  });
});
