import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import EditReportTable from "./EditReportTable";
import { data } from "../../../dummy-data/ViewReportDummyData";
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
const mockedSetOpenEditDrawer = jest.fn();

describe("edit report table", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("check the edit table container is exist", async () => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <EditReportTable
            data={data.sections[0].items[1]}
            setOpenEditDrawer={mockedSetOpenEditDrawer}
            setShowOverlayLoader={() => jest.fn()}
            handleNewItemInReportDetails={() => jest.fn()}
          />
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("edit_table_container")).toBeInTheDocument();
    });
  });

  it("check when fill all the form for PL table and click on save the request will send with the right values", async () => {
    AxiosMock.put.mockResolvedValueOnce({
      data: data,
    });
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <EditReportTable
            data={data.sections[0].items[1]}
            setOpenEditDrawer={mockedSetOpenEditDrawer}
            setShowOverlayLoader={() => jest.fn()}
            handleNewItemInReportDetails={() => jest.fn()}
          />
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_table_container")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("view_type_dropdown"));

    fireEvent.click(screen.getByText("Accounts"));

    await waitFor(() => {
      expect(screen.getByTestId("tab_EBITDA")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("tab_EBITDA"));

    await waitFor(() => {
      expect(screen.getByTestId("is_hide_checkbox")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("is_hide_checkbox"));
    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Annual"));

    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(
        "/report/table_item/3e87ec67-a4c5-46dd-a53a-1d800be9d485",
        {
          frequency_period: "annual",
          period: "2021/2022",
          type: "Profit & Loss",
          params: {
            view_name: "EBITDA",
            view_type: "Management accounts",
            is_hide: false,
          },
        }
      );
    });
  });

  it("check when fill all the form for BS table and click on save the request will send with the right values", async () => {
    AxiosMock.put.mockResolvedValueOnce({
      data: data,
    });
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <EditReportTable
            data={data.sections[0].items[3]}
            setOpenEditDrawer={mockedSetOpenEditDrawer}
            setShowOverlayLoader={() => jest.fn()}
            handleNewItemInReportDetails={() => jest.fn()}
          />
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_table_container")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("view_type_dropdown"));

    fireEvent.click(screen.getByText("Accounts"));

    fireEvent.click(screen.getByTestId("is_current_dropdown"));

    fireEvent.click(
      screen.getByTestId("dropdown_option_Non Current → Current")
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("tab_Assets= Liability + Equity")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("tab_Assets= Liability + Equity"));

    await waitFor(() => {
      expect(screen.getByTestId("is_hide_checkbox")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("is_hide_checkbox"));
    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Annual"));

    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(
        "/report/table_item/3e87ec67-a4c5-46dd-a53a-1d800be9d485",
        {
          frequency_period: "annual",
          period: "2021/2022",
          type: "Balance Sheet",
          params: {
            view_type: "Management accounts",
            is_current: false,
            is_hide: false,
            is_equity_first: false,
          },
        }
      );
    });
  });

  it("check when fill all the form for CF table and click on save the request will send with the right values", async () => {
    AxiosMock.put.mockResolvedValueOnce({
      data: data,
    });
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <EditReportTable
            data={data.sections[0].items[5]}
            setOpenEditDrawer={mockedSetOpenEditDrawer}
            setShowOverlayLoader={() => jest.fn()}
            handleNewItemInReportDetails={() => jest.fn()}
          />
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_table_container")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("view_name_dropdown"));

    fireEvent.click(screen.getByText("Net Free Cash Flow"));

    await waitFor(() => {
      expect(screen.getByTestId("is_hide_checkbox")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("is_hide_checkbox"));
    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Annual"));

    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(
        "/report/table_item/3e87ec67-a4c5-46dd-a53a-1d800be9d485",
        {
          frequency_period: "annual",
          period: "2021/2022",
          type: "Cash Flow",
          params: {
            view_name: "Net free cash flow",
            is_hide: false,
          },
        }
      );
    });
  });

  it("check when fill all the form for KPI table and click on save the request will send with the right values", async () => {
    AxiosMock.put.mockResolvedValueOnce({
      data: data,
    });
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <EditReportTable
            data={data.sections[0].items[7]}
            setOpenEditDrawer={mockedSetOpenEditDrawer}
            setShowOverlayLoader={() => jest.fn()}
            handleNewItemInReportDetails={() => jest.fn()}
          />
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_table_container")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("view_name_dropdown"));

    fireEvent.click(screen.getByText("On track KPIs"));

    await waitFor(() => {
      expect(screen.getByTestId("is_hide_checkbox")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("is_hide_checkbox"));
    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Annual"));

    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(
        "/report/table_item/3e87ec67-a4c5-46dd-a53a-1d800be9d485",
        {
          frequency_period: "annual",
          period: "2021/2022",
          type: "KPIs",
          params: {
            view_name: "on_track",
            is_hide: false,
          },
        }
      );
    });
  });

  it("check when fill all the form for Seg table and click on save the request will send with the right values", async () => {
    AxiosMock.put.mockResolvedValueOnce({
      data: data,
    });
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <EditReportTable
            data={data.sections[0].items[9]}
            setOpenEditDrawer={mockedSetOpenEditDrawer}
            setShowOverlayLoader={() => jest.fn()}
            handleNewItemInReportDetails={() => jest.fn()}
          />
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_table_container")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("is_hide_checkbox")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("is_hide_checkbox"));
    const periodFrequency = screen.getByTestId("period-frequency");

    fireEvent.click(periodFrequency);
    fireEvent.click(screen.getByText("Annual"));

    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(
        "/report/table_item/3e87ec67-a4c5-46dd-a53a-1d800be9d485",
        {
          frequency_period: "annual",
          period: "2021/2022",
          type: "Segmentation Analysis",
          params: {
            is_hide: false,
            view_name: "Revenue Segmentation",
          },
        }
      );
    });
  });

  it("if the component is invalid and try to save the request will not send because the user need to select time Period", async () => {
    const invalidComponent = data.sections[0].items[9];
    invalidComponent.table_item.is_valid = false;
    AxiosMock.put.mockResolvedValueOnce({
      data: data,
    });
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <EditReportTable
            data={invalidComponent}
            setOpenEditDrawer={mockedSetOpenEditDrawer}
            setShowOverlayLoader={() => jest.fn()}
            handleNewItemInReportDetails={() => jest.fn()}
          />
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit_table_container")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("is_hide_checkbox")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("is_hide_checkbox"));

    fireEvent.click(screen.getByTestId("save_btn"));

    await waitFor(() => {
      expect(screen.getByText("Time Period is required")).toBeInTheDocument();
    });
  });
});
