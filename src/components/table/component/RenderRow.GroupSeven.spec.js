import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RenderRow from "./RenderRow";
import { CompaniesContext } from "../../../contexts/CompaniesContext";

const singleRowData = {
  row: [
    {
      col_data: "Fixed Assets",
      col_type: "text",
    },
    {
      col_data: 16088931.0,
      col_type: "Monetary",
    },
    {
      col_data: 15,
      col_type: "Percentage",
    },
    {
      col_data: 55,
      col_type: "Number",
    },
    {
      col_data: 2,
      col_type: "chart_percentage",
    },
    {
      col_data: 8958920.0,
      col_type: "Multiples",
    },
    {
      col_data: 79.58560853317141,
      col_type: "Custom",
    },
    {
      col_data: 80,
      col_type: "any_type",
    },
  ],
  display_type: "normal",
  alert: true,
};

describe("Render Row", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("it should be rendered as tr and tds", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              currency: "EGP",
              uuid: "123",
            },
          }}
        >
          <RenderRow
            singleRow={singleRowData}
            groupName="group_name_1"
            testIdSuffix="test_row"
            checkAlerts={false}
            rowType={"normal"}
            singleRowIndex={0}
            hasIndent={false}
            hasBorder={true}
            isLastGroupRow={true}
            neglectColourColumns={[]}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("tr_test_row")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("td_test_row_group_name_1_Fixed Assets")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("border_test_row")).toBeInTheDocument();
    });
  });

  it("if hasBorder = false and isLastGroupRow= false, then the border shouldn't be rendered", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              currency: "EGP",
              uuid: "123",
            },
          }}
        >
          <RenderRow
            singleRow={singleRowData}
            groupName="group_name_1"
            testIdSuffix="test_row_2"
            checkAlerts={false}
            rowType={"normal"}
            singleRowIndex={0}
            hasIndent={false}
            hasBorder={false}
            isLastGroupRow={false}
            neglectColourColumns={[]}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("border_test_row_2")).not.toBeInTheDocument();
    });
  });

  it("cell with text type (without alert) should be rendered", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              currency: "EGP",
              uuid: "123",
            },
          }}
        >
          <RenderRow
            singleRow={singleRowData}
            groupName="group_name_1"
            testIdSuffix="test_row_3"
            checkAlerts={false}
            rowType={"normal"}
            singleRowIndex={0}
            hasIndent={false}
            hasBorder={false}
            isLastGroupRow={false}
            neglectColourColumns={[]}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cell_0_test_row_3_text")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("cell_0_test_row_3_text").textContent).toBe(
        "Fixed Assets"
      );
    });
  });

  it("cell with text type (with alert) should be rendered", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              currency: "EGP",
              uuid: "123",
            },
          }}
        >
          <RenderRow
            singleRow={singleRowData}
            groupName="group_name_1"
            testIdSuffix="test_row_3"
            checkAlerts={true}
            rowType={"normal"}
            singleRowIndex={0}
            hasIndent={false}
            hasBorder={false}
            isLastGroupRow={false}
            neglectColourColumns={[]}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("cell_0_test_row_3_text")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("cell_0_test_row_3_text").textContent).toBe(
        "Fixed Assets"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("alert_span_test_row_3")).toBeInTheDocument();
    });
  });

  it("cell with chart_percentage type should be rendered", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              currency: "EGP",
              uuid: "123",
            },
          }}
        >
          <RenderRow
            singleRow={singleRowData}
            groupName="group_name_1"
            testIdSuffix="test_row_3"
            checkAlerts={false}
            rowType={"normal"}
            singleRowIndex={0}
            hasIndent={false}
            hasBorder={false}
            isLastGroupRow={false}
            neglectColourColumns={[]}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("cell_4_test_row_3_chart_percentage")
      ).toBeInTheDocument();
    });
  });

  it("cell with Monetary type should be rendered", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              currency: "EGP",
              uuid: "123",
            },
          }}
        >
          <RenderRow
            singleRow={singleRowData}
            groupName="group_name_1"
            testIdSuffix="test_row_3"
            checkAlerts={false}
            rowType={"normal"}
            singleRowIndex={0}
            hasIndent={false}
            hasBorder={false}
            isLastGroupRow={false}
            neglectColourColumns={[]}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("cell_1_test_row_3_Monetary")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("cell_1_test_row_3_Monetary").textContent).toBe(
        "16,088,931.00"
      );
    });
  });

  it("cell with Percentage type should be rendered", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              currency: "EGP",
              uuid: "123",
            },
          }}
        >
          <RenderRow
            singleRow={singleRowData}
            groupName="group_name_1"
            testIdSuffix="test_row_3"
            checkAlerts={false}
            rowType={"normal"}
            singleRowIndex={0}
            hasIndent={false}
            hasBorder={false}
            isLastGroupRow={false}
            neglectColourColumns={[]}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("cell_2_test_row_3_Percentage")
      ).toBeInTheDocument();
    });
  });

  it("cell with Number type , Multiples type and Custom type should be rendered", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              currency: "EGP",
              uuid: "123",
            },
          }}
        >
          <RenderRow
            singleRow={singleRowData}
            groupName="group_name_1"
            testIdSuffix="test_row_3"
            checkAlerts={false}
            rowType={"normal"}
            singleRowIndex={0}
            hasIndent={false}
            hasBorder={false}
            isLastGroupRow={false}
            neglectColourColumns={[]}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("cell_3_test_row_3_Number")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("cell_3_test_row_3_Number").textContent).toBe(
        "55.00"
      );
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("cell_5_test_row_3_Multiples")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("cell_5_test_row_3_Multiples").textContent
      ).toBe("8958920");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("cell_6_test_row_3_Custom")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("cell_6_test_row_3_Custom").textContent).toBe(
        "79.58560853317141"
      );
    });
  });

  it("cell with any another type should be rendered", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              currency: "EGP",
              uuid: "123",
            },
          }}
        >
          <RenderRow
            singleRow={singleRowData}
            groupName="group_name_1"
            testIdSuffix="test_row_3"
            checkAlerts={false}
            rowType={"normal"}
            singleRowIndex={0}
            hasIndent={false}
            hasBorder={false}
            isLastGroupRow={false}
            neglectColourColumns={[]}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("cell_7_test_row_3_any_type")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("cell_7_test_row_3_any_type").textContent).toBe(
        "80"
      );
    });
  });
});
