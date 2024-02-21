import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VariableView from "./AlertsVariableView";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";

const variableData = [
  {
    uuid: "7b37019a-4db6-452c-82c9-8041458dbaba",
    group_name: "Period Margins",
    kpis: [
      {
        uuid: "c1baed28-9deb-4a27-ab6c-59c7a0d91455",
        name: "Total Revenues",
        type: "Monetary",
        kpi_alert: {
          uuid: "32ba3c3b-fdb8-414e-a6cb-6974293c43b6",
          sign: "lt",
          is_active: false,
          values: [
            {
              uuid: 877370,
              date: "Feb 2023",
              value: 1000000.0,
            },
          ],
        },
      },
      {
        uuid: "c1baed28-9deb-4a27-ab6c-59c7a0d91455",
        name: "Total Revenues",
        type: "Monetary",
        kpi_alert: {
          uuid: "32ba3c3b-fdb8-414e-a6cb-6974293c43b6",
          sign: "mt",
          is_active: false,
          values: [
            {
              uuid: 877370,
              date: "Feb 2023",
              value: 1000000.0,
            },
          ],
        },
      },
    ],
  },
  {
    uuid: "7b37019a-4db6-452c-82c9-8041458dbaba",
    group_name: "group_name_2",
    kpis: [
      {
        uuid: "c1baed28-9deb-4a27-ab6c-59c7a0d91455",
        name: "Total Revenues",
        type: "Monetary",
        kpi_alert: {
          uuid: "32ba3c3b-fdb8-414e-a6cb-6974293c43b6",
          sign: "lt",
          is_active: false,
          values: [
            {
              uuid: 877370,
              date: "Feb 2023",
              value: 1000000.0,
            },
          ],
        },
      },
      {
        uuid: "c1baed28-9deb-4a27-ab6c-59c7a0d91455",
        name: "Total Revenues",
        type: "Monetary",
        kpi_alert: {
          uuid: "32ba3c3b-fdb8-414e-a6cb-6974293c43b6",
          sign: "mt",
          is_active: false,
          values: [
            {
              uuid: 877370,
              date: "Feb 2023",
              value: 1000000.0,
            },
          ],
        },
      },
    ],
  },
];

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
describe("alerts variable view", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("it should be rendered", async () => {
    const setVariableValueChangeFn = jest.fn();
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{ selectedCompany: { uuid: "123", currency: "EGP" } }}
        >
          <VariableView
            form={{
              values: {
                toggle_section_0_row_0: "",
                group_0_sliderRow_0: "",
              },
              getInputProps: jest.fn(),
            }}
            variableData={variableData}
            setVariableValueChange={setVariableValueChangeFn}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("alerts__table_0")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("group_0").textContent).toBe("Period Margins");
    });
    await waitFor(() => {
      expect(screen.getByTestId("alert_row_0_0")).toBeInTheDocument();
    });
  });

  it("segmented control is rendered and can change it", async () => {
    const setVariableValueChangeFn = jest.fn();
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{ selectedCompany: { uuid: "123", currency: "EGP" } }}
        >
          <VariableView
            form={{
              values: {
                toggle_section_0_row_0: "",
                group_0_sliderRow_0: "",
              },
              getInputProps: jest.fn(),
            }}
            variableData={variableData}
            setVariableValueChange={setVariableValueChangeFn}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId(`toggle_section_0_row_0`)).toBeInTheDocument();
    });
    let checkboX = screen.queryAllByRole("radio");
    fireEvent.click(checkboX[0], { target: { checked: "" } });
    await waitFor(() => {
      expect(setVariableValueChangeFn).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId(`row_title_0_row_0`).textContent).toBe(
        "Total Revenues is less than"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId(`row_title_0_row_1`).textContent).toBe(
        "Total Revenues is more than"
      );
    });
  });
  it("alert divider is render", async () => {
    const setVariableValueChangeFn = jest.fn();
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{ selectedCompany: { uuid: "123", currency: "EGP" } }}
        >
          <VariableView
            form={{
              values: {
                toggle_section_0_row_0: "",
                group_0_sliderRow_0: "",
              },
              getInputProps: jest.fn(),
            }}
            variableData={variableData}
            setVariableValueChange={setVariableValueChangeFn}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId(`alerts__row__divider_0`)).toBeInTheDocument();
    });
  });
});
