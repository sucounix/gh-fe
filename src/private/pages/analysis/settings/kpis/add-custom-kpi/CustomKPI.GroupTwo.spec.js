import React from "react";
import AxiosMock from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddCustomKPI from "./AddCustomKPI";
import { BrowserRouter } from "react-router-dom";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";
import { TimeFrameContext } from "../../../../../../contexts/TimeFrameContext";

import utils from "../getActualYear";
jest.mock("../getActualYear", () => ({
  getActualYear: jest.fn(),
}));
jest.mock("axios");
const mockedUsedNavigate = jest.fn();

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    companyId: "1",
  }),
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

describe("KPIs Create", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show errors for required inputs when missing", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [{}],
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: 1, currency: "EGP" },
            }}
          >
            <AddCustomKPI />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("name_input"), {
      target: "test",
    });

    await waitFor(() => {
      expect(screen.getByTestId("next_btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("next_btn"));

    await waitFor(() => {
      expect(screen.getByText("KPI Category is required")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("KPI definition is required")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("KPI aggregation is required")
      ).toBeInTheDocument();
    });
  });

  it("should the fixed view should appear when submit all fields", async () => {
    window.ResizeObserver = ResizeObserver;

    const mockedResponse = {
      data: [
        {
          group_name: "test",
          uuid: "123",
        },
        {
          group_name: "test II",
          uuid: "321",
        },
      ],
    };

    Promise.all([AxiosMock.get.mockResolvedValueOnce(mockedResponse)]);

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            timeFrameRequestData,
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: { uuid: 1, currency: "EGP" },
            }}
          >
            <AddCustomKPI />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });

    fireEvent.click(screen.getByTestId("non_financial_kpi"));

    fireEvent.change(screen.getByTestId("name_input"), {
      target: { value: "test" },
    });

    fireEvent.click(screen.getByTestId("group_input"));

    await waitFor(() => {
      expect(screen.getByText("test")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("test"));

    fireEvent.click(screen.getByTestId("definition_input"));
    fireEvent.click(screen.getByText("Higher value preferable"));

    fireEvent.click(screen.getByTestId("aggregation_input"));
    fireEvent.click(screen.getByText("Sum"));

    fireEvent.click(screen.getByTestId("type-input"));
    fireEvent.click(screen.getByText("Percentage"));

    await waitFor(() => {
      expect(screen.getByTestId("next_btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("next_btn"));

    await waitFor(() => {
      expect(screen.getByTestId("fixed_value")).toBeInTheDocument();
    });
  });
});
