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
import BudgetSettings from "./BudgetSettings";

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

describe("Budgets Settings", () => {
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
                  kpi_budgets: 20,
                },
                {
                  uuid: 123,
                  name: "Test KPI",
                  type: "Monetary",
                  kpi_budgets: 21,
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
          companies: [
            {
              uuid: 123,
              budgets: "fixed",
              is_budget_ready: true,
            },
          ],

          selectedCompany: {
            currency: "USD",
            uuid: 123,
            budgets: "fixed",
            is_budget_ready: true,
          },
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        <BudgetSettings />
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId("fixed-budget-row")).toHaveLength(2);
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
                  kpi_budgets: 20,
                },
                {
                  uuid: 123,
                  name: "Test KPI",
                  type: "Monetary",
                  kpi_budgets: 21,
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
          companies: [
            {
              uuid: 123,
              budgets: "fixed",
              is_budget_ready: true,
            },
          ],

          selectedCompany: {
            currency: "USD",
            uuid: 123,
            budgets: "fixed",
            is_budget_ready: true,
          },
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        <BudgetSettings />
      </CompaniesContext.Provider>
    );

    const fixedBudgetFirstInput = await screen.findByTestId(
      "fixed-budget-group-0-input-1"
    );

    fireEvent.change(fixedBudgetFirstInput, {
      target: { value: 30 },
    });

    await waitFor(() => {
      expect(fixedBudgetFirstInput.value).toBe("30.00");
    });
    await waitFor(() => {
      expect(screen.getByTestId("save-changes-btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("save-changes-btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toHaveBeenCalledTimes(1);
    });
  });

  it("should render as variable value and show inputs on edit click", async () => {
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
              uuid: 111,
              group_name: "Test Table",
              kpis: [
                {
                  uuid: 123,
                  name: "Test KPI",
                  type: "Monetary",
                  kpi_budgets: [
                    {
                      uuid: 124,
                      date: "Dec 2022",
                      value: 30,
                    },
                    {
                      uuid: 125,
                      date: "Dec 2023",
                      value: 40,
                    },
                  ],
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
          companies: [
            {
              uuid: 123,
              budgets: "variable",
              is_budget_ready: true,
            },
          ],

          selectedCompany: {
            currency: "USD",
            uuid: 123,
            budgets: "variable",
            is_budget_ready: true,
          },
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        <BudgetSettings />
      </CompaniesContext.Provider>
    );

    const editBudgetButton = await screen.findByTestId(
      "edit_budget_button_Test KPI"
    );

    await waitFor(() => {
      expect(editBudgetButton).toBeInTheDocument();
    });

    fireEvent.click(editBudgetButton);

    await waitFor(() => {
      expect(screen.getByTestId(`budget_inputs_123`)).toBeInTheDocument();
    });
  });
});
