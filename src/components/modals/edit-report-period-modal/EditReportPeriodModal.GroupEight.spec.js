import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EditReportPeriodModal from "./EditReportPeriodModal";
import { TimeFrameContext } from "../../../contexts/TimeFrameContext";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));
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
describe("edit report modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the opened flag = true", async () => {
    const setShowEditReportPeriod = jest.fn();
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider value={{ timeFrameRequestData }}>
          <EditReportPeriodModal
            opened={true}
            setShowEditReportPeriod={setShowEditReportPeriod}
          />
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("edit_report_period_modal")
      ).toBeInTheDocument();
    });
  });

  it("when click on cancel button , the setShowEditReportPeriod is called with false", async () => {
    const setShowEditReportPeriod = jest.fn();
    render(
      <BrowserRouter>
        <TimeFrameContext.Provider value={{ timeFrameRequestData }}>
          <EditReportPeriodModal
            setShowEditReportPeriod={setShowEditReportPeriod}
            inEditReport={{ uuid: "123" }}
            setResponseData={() => jest.fn()}
            setRecentReports={() => jest.fn()}
            setInEditReport={() => jest.fn()}
            showEditReportPeriod={() => jest.fn()}
          />
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("edit_report_period_modal")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("cancel-btn"));
    await waitFor(() => {
      expect(setShowEditReportPeriod).toBeCalledWith(false);
    });
  });
});
