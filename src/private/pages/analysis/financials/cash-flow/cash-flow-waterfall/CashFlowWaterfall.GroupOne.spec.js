import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CashFlowWaterfall from "./CashFlowWaterfall";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../../../contexts/CompanyPreferencesApi";
import { thirdViewData } from "./dummy-data/NetFreeCashFlow";
import { firstViewData } from "./dummy-data/CashFlow(CFO - CFI - CFF)";
import { secondViewData } from "./dummy-data/UsesAndSourcesOfCashFlow";

describe("Cashflow Waterfall", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("if the currentViewCashFlow = Cash Flow (CFO - CFI - CFF) , the first view should be rendered", async () => {
    let api_value_preference = {
      currentViewCashFlow: {
        value: "Cash Flow (CFO - CFI - CFF)",
        testId: "Cash Flow",
      },
    };
    render(
      <BrowserRouter>
        <CompanyPreferencesApiContext.Provider
          value={{
            companyPreferencesApi: api_value_preference,
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
                currency: "EGP",
              },
            }}
          >
            <CashFlowWaterfall cashflowData={firstViewData} />
          </CompaniesContext.Provider>
        </CompanyPreferencesApiContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("CFOCashflowWaterfallView")
      ).toBeInTheDocument();
    });
  });

  it("if the currentViewCashFlow = Uses & Sources of Cash Flow , the second view should be rendered", async () => {
    let api_value_preference = {
      currentViewCashFlow: {
        value: "Uses & Sources of Cash Flow",
        testId: "Uses & Sources",
      },
    };
    render(
      <BrowserRouter>
        <CompanyPreferencesApiContext.Provider
          value={{
            companyPreferencesApi: api_value_preference,
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
                currency: "EGP",
              },
            }}
          >
            <CashFlowWaterfall cashflowData={secondViewData} />
          </CompaniesContext.Provider>
        </CompanyPreferencesApiContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("UsesSourcesCashflowWaterfallView")
      ).toBeInTheDocument();
    });
  });

  it("if the currentViewCashFlow = Net free cash flow , the third view should be rendered", async () => {
    let api_value_preference = {
      currentViewCashFlow: {
        value: "Net free cash flow",
        testId: "Net Free Cash Flow",
      },
    };
    render(
      <BrowserRouter>
        <CompanyPreferencesApiContext.Provider
          value={{
            companyPreferencesApi: api_value_preference,
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
                currency: "EGP",
              },
            }}
          >
            <CashFlowWaterfall cashflowData={thirdViewData} />
          </CompaniesContext.Provider>
        </CompanyPreferencesApiContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("NetFreeCashflowWaterfallView")
      ).toBeInTheDocument();
    });
  });
});
