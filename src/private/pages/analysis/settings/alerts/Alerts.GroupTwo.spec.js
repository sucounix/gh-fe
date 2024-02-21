import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import AxiosMock from "axios";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import Alerts from "./Alerts";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: 123,
  }),
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

afterEach(() => {
  jest.clearAllMocks();
});

describe("Alerts Settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render as fixed value and render the value from backend", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: {
          timeframe: [2022, 2023],
        },
      }),
      AxiosMock.get.mockResolvedValueOnce({
        data: {
          data: [
            {
              uuid: 123,
              group_name: "Test Table",
              kpis: [
                {
                  uuid: 123,
                  name: "Test KPI",
                  type: "Monetary",
                  kpi_alert: {
                    values: 200,
                  },
                },
                {
                  uuid: 123,
                  name: "Test KPI",
                  type: "Monetary",
                  kpi_alert: {
                    values: 300,
                  },
                },
              ],
            },
          ],
        },
      }),
    ]);

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          setSelectedCompany: jest.fn(),
          companies: [
            {
              currency: "USD",
              uuid: 123,
              alerts: "fixed",
              is_alert_ready: true,
            },
          ],
          selectedCompany: {
            currency: "USD",
            uuid: 123,
            alerts: "fixed",
            is_alert_ready: true,
          },
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        <Alerts />
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("alert_row_0_0")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("alert_row_0_1")).toBeInTheDocument();
    });
  });

  it("should render as fixed value and submit value change", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: {
          timeframe: [2022, 2023],
        },
      }),
      AxiosMock.get.mockResolvedValueOnce({
        data: {
          data: [
            {
              uuid: 123,
              group_name: "Test Table",
              kpis: [
                {
                  uuid: 123,
                  name: "Test KPI",
                  type: "Monetary",
                  kpi_alert: {
                    values: 200,
                  },
                },
                {
                  uuid: 123,
                  name: "Test KPI",
                  type: "Monetary",
                  kpi_alert: {
                    values: 300,
                  },
                },
              ],
            },
          ],
        },
      }),
      AxiosMock.put.mockResolvedValueOnce({}),
    ]);

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          setSelectedCompany: jest.fn(),
          companies: [
            {
              currency: "USD",
              uuid: 123,
              alerts: "fixed",
              is_alert_ready: true,
            },
          ],
          selectedCompany: {
            currency: "USD",
            uuid: 123,
            alerts: "fixed",
            is_alert_ready: true,
          },
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        <Alerts />
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("fixed__alert__input__0__0")
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("fixed__alert__input__0__0"), {
      target: { value: 30 },
    });

    await waitFor(() => {
      expect(screen.getByTestId("fixed__alert__input__0__0").value).toBe(
        "30.00"
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("save-changes-btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("save-changes-btn"));

    await waitFor(() => {
      expect(AxiosMock.put).toHaveBeenCalledTimes(1);
    });
  });

  it("should render as fixed value and switch to variable values", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: {
          timeframe: [2022, 2023],
        },
      }),

      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            uuid: 123,
            group_name: "Test Table",
            kpis: [
              {
                uuid: 123,
                name: "Test KPI",
                type: "Monetary",
                kpi_alert: {
                  values: 200,
                },
              },
              {
                uuid: 123,
                name: "Test KPI",
                type: "Monetary",
                kpi_alert: {
                  values: 300,
                },
              },
            ],
          },
        ],
      }),

      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            uuid: 123,
            group_name: "Test Table",
            kpis: [
              {
                uuid: 123,
                name: "Test KPI",
                type: "Monetary",
                kpi_alert: {
                  is_active: true,
                  values: [
                    {
                      uuid: 123,
                      date: 2022,
                      value: 200,
                    },
                  ],
                },
              },
              {
                uuid: 123,
                name: "Test KPI",
                type: "Monetary",
                kpi_alert: {
                  is_active: true,
                  values: [
                    {
                      uuid: 123,
                      date: 2022,
                      value: 400,
                    },
                  ],
                },
              },
            ],
          },
        ],
      }),
    ]);

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          setSelectedCompany: jest.fn(),
          companies: [
            {
              currency: "USD",
              uuid: 123,
              alerts: "fixed",
              is_alert_ready: true,
            },
          ],
          selectedCompany: {
            currency: "USD",
            uuid: 123,
            alerts: "fixed",
            is_alert_ready: true,
          },
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        <Alerts />
      </CompaniesContext.Provider>
    );

    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: 123,
          group_name: "Test Table",
          kpis: [
            {
              uuid: 123,
              name: "Test KPI",
              type: "Monetary",
              kpi_alert: {
                is_active: true,
                values: [
                  {
                    uuid: 123,
                    date: 2022,
                    value: 200,
                  },
                ],
              },
            },
            {
              uuid: 123,
              name: "Test KPI",
              type: "Monetary",
              kpi_alert: {
                is_active: true,
                values: [
                  {
                    uuid: 123,
                    date: 2022,
                    value: 400,
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledTimes(2);
    });

    await waitFor(() => {
      expect(screen.getByTestId("tab_Variable Alerts")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("tab_Variable Alerts"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(
        "/analysis/alerts/123?year=2023&type=variable"
      );
    });
  });
});
