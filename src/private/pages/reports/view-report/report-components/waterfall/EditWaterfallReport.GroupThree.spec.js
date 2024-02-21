import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditWaterfallReport from "./EditWaterfallReport";
import { TimeFrameContext } from "../../../../../../contexts/TimeFrameContext";
import AxiosMock from "axios";
import axios from "axios";

jest.mock("axios");

describe("EditWaterfallReport", () => {
  const mockItem = {
    chart_item: {
      uuid: "123",
      title: "Test Chart",
      period: "2021-01-01",
      frequency_period: "monthly",
      is_valid: true,
      params: {
        is_hide: "false",
        view_name: "Cash Flow (CFO - CFI - CFF)",
      },
    },
  };

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
  const mockSetLoading = jest.fn();
  const mockSetOpenEditDrawer = jest.fn();
  const mockHandleNewItemInReportDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with the correct title and chart view", async () => {
    render(
      <TimeFrameContext.Provider
        value={{
          timeFrameRequestData: timeFrameRequestData,
        }}
      >
        <EditWaterfallReport
          loading={false}
          item={mockItem}
          setLoading={mockSetLoading}
          setOpenEditDrawer={mockSetOpenEditDrawer}
          handleNewItemInReportDetails={mockHandleNewItemInReportDetails}
        />
      </TimeFrameContext.Provider>
    );

    expect(screen.getByText("Edit Cash Flow Waterfall")).toBeInTheDocument();
    expect(screen.getByLabelText("Chart title")).toHaveValue("Test Chart");

    await waitFor(() => {
      expect(screen.getByTestId("view_input")).toHaveAttribute(
        "value",
        "Cash Flow (CFO - CFI - CFF)"
      );
    });
  });

  it("calls the update function with the correct values when the form is submitted", async () => {
    AxiosMock.put.mockResolvedValue({
      data: {
        value: {
          data: {
            title: "New Chart Title",
            params: {
              is_hide: "false",
              view_name: "Uses & Sources of Cash Flow",
            },
            frequency_period: "quarter",
            period: "Q2 2021/2022",
          },
        },
        uuid: "123",
      },
    });

    render(
      <TimeFrameContext.Provider
        value={{
          timeFrameRequestData: timeFrameRequestData,
        }}
      >
        <EditWaterfallReport
          loading={false}
          item={mockItem}
          setLoading={mockSetLoading}
          setOpenEditDrawer={mockSetOpenEditDrawer}
          handleNewItemInReportDetails={mockHandleNewItemInReportDetails}
        />
      </TimeFrameContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Chart title"), {
      target: { value: "New Chart Title" },
    });

    fireEvent.click(screen.getByTestId("view_input"));

    await waitFor(() => {
      expect(
        screen.getByText("Uses & Sources of Cash Flow")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Uses & Sources of Cash Flow"));

    fireEvent.click(screen.getByTestId("save_button"));

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/report/chart_item/123", {
        frequency_period: "monthly",
        params: { is_hide: "false", view_name: "Uses & Sources of Cash Flow" },
        period: "2021-01-01",
        title: "New Chart Title",
        type: "waterfall",
      });
    });

    await waitFor(() => {
      expect(mockHandleNewItemInReportDetails).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSetOpenEditDrawer).toHaveBeenCalledWith(false);
    });
  });

  it("disables the save button when loading is true", () => {
    render(
      <TimeFrameContext.Provider
        value={{
          timeFrameRequestData: timeFrameRequestData,
        }}
      >
        <EditWaterfallReport
          loading={true}
          item={mockItem}
          setLoading={mockSetLoading}
          setOpenEditDrawer={mockSetOpenEditDrawer}
          handleNewItemInReportDetails={mockHandleNewItemInReportDetails}
        />
      </TimeFrameContext.Provider>
    );

    expect(screen.getByTestId("save_button")).toBeDisabled();
  });

  it("if the component is invalid and try to save the request will not send because the user need to select time Period", async () => {
    AxiosMock.put.mockResolvedValue({
      data: {
        value: {
          data: {
            title: "New Chart Title",
            params: {
              is_hide: "false",
              view_name: "Uses & Sources of Cash Flow",
            },
            frequency_period: "quarter",
            period: "Q2 2021/2022",
          },
        },
        uuid: "123",
      },
    });
    let invalidComponent = mockItem;
    invalidComponent.chart_item.is_valid = false;

    render(
      <TimeFrameContext.Provider
        value={{
          timeFrameRequestData: timeFrameRequestData,
        }}
      >
        <EditWaterfallReport
          loading={false}
          item={invalidComponent}
          setLoading={mockSetLoading}
          setOpenEditDrawer={mockSetOpenEditDrawer}
          handleNewItemInReportDetails={mockHandleNewItemInReportDetails}
        />
      </TimeFrameContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Chart title"), {
      target: { value: "New Chart Title" },
    });

    fireEvent.click(screen.getByTestId("view_input"));

    await waitFor(() => {
      expect(
        screen.getByText("Uses & Sources of Cash Flow")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Uses & Sources of Cash Flow"));

    fireEvent.click(screen.getByTestId("save_button"));

    await waitFor(() => {
      expect(screen.getByText("Time Period is required")).toBeInTheDocument();
    });
  });
});
