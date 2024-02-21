import React from "react";
import AxiosMock from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditCustomKPI from "./EditCustomKPI";
import { BrowserRouter } from "react-router-dom";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";
import { TimeFrameContext } from "../../../../../../contexts/TimeFrameContext";

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
    kpiId: "123",
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

    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: [],
      }),
      AxiosMock.get.mockResolvedValueOnce(mockedResponse),
    ]);

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
            <EditCustomKPI />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId("next_btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("next_btn"));

    await waitFor(() => {
      expect(screen.getByText("KPI name is required")).toBeInTheDocument();
    });
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
    const kpiResponse = {
      data: {
        aggregation: "End Balance",
        definition: "Higher value preferable",
        description: "",
        group: "c635cce8-6a91-4465-bf71-6c749e4e428c",
        name: "test create 1",
        reference: "Non-financial",
        type: "Monetary",
        uuid: "f28bf20c-2c5f-407c-a118-59cd546c22f1",
        value: 0,
        values: [],
        values_type: "fixed",
      },
    };
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce(kpiResponse),
      AxiosMock.get.mockResolvedValueOnce(mockedResponse),
    ]);

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
            <EditCustomKPI />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.queryByTestId("step-one-form")).toBeNull();
    });
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId("step-one-form")).not.toBeNull();
    });

    await waitFor(() => {
      expect(screen.getByTestId("next_btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("next_btn"));

    await waitFor(() => {
      expect(screen.getByTestId("fixed_value")).toBeInTheDocument();
    });
  });
});
