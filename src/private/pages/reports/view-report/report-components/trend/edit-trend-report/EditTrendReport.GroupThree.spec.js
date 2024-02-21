import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import EditTrendReport from "./EditTrendReport";
import { preRequisetes, data } from "./DummyMockData";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";
import { TimeFrameContext } from "../../../../../../../contexts/TimeFrameContext";

jest.mock("axios");
const timeFrameRequestData = {
  initial_value: {
    frequency_period: "quarter",
    period: "Q2",
    year: "2021/2022",
  },
  timeframe: [
    {
      year: "2021/2022",
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
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("edit Trend Report", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when edit the chart title , the request should send with the new data", async () => {
    // mock fetchPrerequisetes method
    AxiosMock.get.mockResolvedValueOnce({ data: preRequisetes });
    AxiosMock.put.mockResolvedValueOnce({ data: data.chart_item });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{ selectedCompany: { uuid: "123", currency: "EGP" } }}
          >
            <EditTrendReport
              data={data}
              setOpenEditDrawer={() => jest.fn()}
              loading={false}
              setLoading={() => jest.fn()}
              units={"Number"}
              handleNewItemInReportDetails={() => jest.fn()}
            />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_trend_div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("title_input")).toHaveValue("chart 1");
    });
    fireEvent.change(screen.getByTestId("title_input"), {
      target: { value: "Updated trend analysis Chart" },
    });
    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(`report/chart_item/123`, {
        frequency_period: "quarter",
        params: {
          charts: [
            {
              display_type: "line",
              is_kpi: false,
              name: "Retail",
              show_moving_average: false,
              type: "Monetary",
              uuid: "913d4039-f1ae-47df-9b08-e8e291442c99",
            },
          ],
          selected_chart: "Custom",
          show_data_info: false,
          show_table: true,
        },
        period: "Q2 2021/2022",
        title: "Updated trend analysis Chart",
        type: "trend_analysis",
      });
    });
  });

  it("when select predefined chart , the request should send with the new chart list ", async () => {
    // mock fetchPrerequisetes method
    AxiosMock.get.mockResolvedValueOnce({ data: preRequisetes });
    AxiosMock.put.mockResolvedValueOnce({ data: data.chart_item });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{ selectedCompany: { uuid: "123", currency: "EGP" } }}
          >
            <EditTrendReport
              data={data}
              setOpenEditDrawer={() => jest.fn()}
              loading={false}
              setLoading={() => jest.fn()}
              units={"Number"}
              handleNewItemInReportDetails={() => jest.fn()}
            />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_trend_div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("predefined_chart_select")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("predefined_chart_select"));
    fireEvent.click(screen.getByText("Profit"));

    fireEvent.change(screen.getByTestId("title_input"), {
      target: { value: "Updated trend analysis Chart" },
    });
    fireEvent.click(screen.getByTestId("save_btn"));

    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(`report/chart_item/123`, {
        frequency_period: "quarter",
        params: {
          charts: preRequisetes.predefined_chart[0].required,
          selected_chart: "Profit",
          show_data_info: false,
          show_table: true,
        },
        period: "Q2 2021/2022",
        title: "Updated trend analysis Chart",
        type: "trend_analysis",
      });
    });
  });

  it("when select freq annual  , the request should send with the new timeframe ", async () => {
    // mock fetchPrerequisetes method
    AxiosMock.get.mockResolvedValueOnce({ data: preRequisetes });
    AxiosMock.put.mockResolvedValueOnce({ data: data.chart_item });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{ selectedCompany: { uuid: "123", currency: "EGP" } }}
          >
            <EditTrendReport
              data={data}
              setOpenEditDrawer={() => jest.fn()}
              loading={false}
              setLoading={() => jest.fn()}
              units={"Number"}
              handleNewItemInReportDetails={() => jest.fn()}
            />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_trend_div")).toBeInTheDocument();
    });
    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Annual"));
    fireEvent.click(screen.getByTestId("save_btn"));

    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(`report/chart_item/123`, {
        frequency_period: "annual",
        params: {
          charts: [
            {
              display_type: "line",
              is_kpi: false,
              name: "Retail",
              show_moving_average: false,
              type: "Monetary",
              uuid: "913d4039-f1ae-47df-9b08-e8e291442c99",
            },
          ],
          selected_chart: "Custom",
          show_data_info: false,
          show_table: true,
        },
        period: "2021/2022",
        title: "chart 1",
        type: "trend_analysis",
      });
    });
  });

  it("when select show more info  , the request should send with the {show_data_info:true} ", async () => {
    // mock fetchPrerequisetes method
    AxiosMock.get.mockResolvedValueOnce({ data: preRequisetes });
    AxiosMock.put.mockResolvedValueOnce({ data: data.chart_item });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{ selectedCompany: { uuid: "123", currency: "EGP" } }}
          >
            <EditTrendReport
              data={data}
              setOpenEditDrawer={() => jest.fn()}
              loading={false}
              setLoading={() => jest.fn()}
              units={"Number"}
              handleNewItemInReportDetails={() => jest.fn()}
            />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_trend_div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("show_data_info_checkbox")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("show_data_info_checkbox"));

    fireEvent.click(screen.getByTestId("save_btn"));

    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(`report/chart_item/123`, {
        frequency_period: "quarter",
        params: {
          charts: [
            {
              display_type: "line",
              is_kpi: false,
              name: "Retail",
              show_moving_average: false,
              type: "Monetary",
              uuid: "913d4039-f1ae-47df-9b08-e8e291442c99",
            },
          ],
          selected_chart: "Custom",
          show_data_info: true,
          show_table: true,
        },
        period: "Q2 2021/2022",
        title: "chart 1",
        type: "trend_analysis",
      });
    });
  });

  it("if the component is invalid and try to save the request will not send because the user need to select time Period", async () => {
    // mock fetchPrerequisetes method
    AxiosMock.get.mockResolvedValueOnce({ data: preRequisetes });
    AxiosMock.put.mockResolvedValueOnce({ data: data.chart_item });

    window.ResizeObserver = ResizeObserver;

    const invalidComponent = data;
    invalidComponent.chart_item.is_valid = false;
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{ selectedCompany: { uuid: "123", currency: "EGP" } }}
          >
            <EditTrendReport
              data={invalidComponent}
              setOpenEditDrawer={() => jest.fn()}
              loading={false}
              setLoading={() => jest.fn()}
              units={"Number"}
              handleNewItemInReportDetails={() => jest.fn()}
            />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_trend_div")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("save_btn"));

    await waitFor(() => {
      expect(screen.getByText("Time Period is required")).toBeInTheDocument();
    });
  });
});
