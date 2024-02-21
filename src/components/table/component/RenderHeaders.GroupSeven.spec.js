import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RenderHeaders from "./RenderHeader";
import { CompaniesContext } from "../../../contexts/CompaniesContext";

const tableData = {
  columns: [
    {
      col_data: "test header",
    },
  ],
};

describe("Render Header", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the currency should be rendered if showCurrencyFlag = true", async () => {
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
          <RenderHeaders
            columns={tableData.columns}
            headerTestId="table_header_test"
            showCurrencyFlag={true}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("table_header_test")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("currency_div_EGP")).toBeInTheDocument();
    });
  });

  it("the currency should be rendered if showCurrencyFlag = flase", async () => {
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
          <RenderHeaders
            columns={tableData.columns}
            headerTestId="table_header_test"
            showCurrencyFlag={false}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("table_header_test")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("currency_div_EGP")).not.toBeInTheDocument();
    });
  });
});
