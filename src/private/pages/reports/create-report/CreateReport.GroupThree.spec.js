import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import CreateReport from "./CreateReport";
import { data } from "./dummyData";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";

jest.mock("axios");

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

describe("Reports", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when select template, the second step should appear", async () => {
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
            <CreateReport
              showCreatePopup={true}
              setShowCreatePopup={() => jest.fn()}
            />
          </TimeFrameContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("create_step_one")).toBeInTheDocument();
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
  });

  it("when click on eye icon , the template image should appear", async () => {
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
            <CreateReport
              showCreatePopup={true}
              setShowCreatePopup={() => jest.fn()}
            />
          </TimeFrameContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("create_step_one")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("template_1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("view_template_image_btn_1")
      ).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("view_template_image_btn_1"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("view_template_image_div")).toBeInTheDocument();
    });
  });
});
