import React from "react";
import AxiosMock from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import KPIsSettings from "./KPIsSettings";
import { BrowserRouter } from "react-router-dom";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";

jest.mock("axios");
jest.mock("@dnd-kit/sortable", () => ({
  ...jest.requireActual("@dnd-kit/sortable"), // use actual for all non-hook parts
  DndContext: jest.fn(),
}));
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "1",
  }),
}));

describe("KPIs Settings", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch KPIs list", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "KPI 1",
          kpis: [
            {
              id: 1,
              name: "KPI 1",
              is_active: true,
            },
          ],
        },
      ],
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              is_kpi_ready: true,
            },
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <KPIsSettings />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("KPI 1")).toBeInTheDocument();
    });
  });

  it("should fetch KPIs list 222", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: 1,
          name: "KPI 1",
          kpis: [
            {
              uuid: 1,
              name: "KPI 1",
              is_active: true,
            },
          ],
        },
      ],
    });

    AxiosMock.put.mockResolvedValueOnce({});

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              is_kpi_ready: true,
            },
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <KPIsSettings />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("KPI 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("toggler__row__KPI 1")).toBeInTheDocument();
    });

    let checkboX = screen.queryAllByRole("radio");
    fireEvent.click(checkboX[0], { target: { checked: "" } });

    await waitFor(() => {
      expect(AxiosMock.put).toHaveBeenCalledTimes(1);
    });
  });

  it("should show edit button", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: 456,
          group_name: "group KPI 1",
          kpis: [
            {
              uuid: 456,
              name: "KPI 1",
              is_active: true,
              reference: "Non-financial",
            },
          ],
        },
      ],
    });
    AxiosMock.put.mockResolvedValueOnce({});

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              is_kpi_ready: true,
            },
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <KPIsSettings />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("KPI 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("edit_kpi_button")).toBeInTheDocument();
    });
  });
});
