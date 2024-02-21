import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CFOCashflowWaterfall from "./CFOCashflowWaterfall";
import {
  firstViewData,
  firstViewDataNanOperatingActivities,
  firstViewDataNanInvestingActivities,
  firstViewDataNanFinancingActivities,
  firstViewDataNanBeginningCashBalance,
  firstViewDataNanEndingCashBalance,
} from "../dummy-data/CashFlow(CFO - CFI - CFF)";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";

describe("CFO cashflow waterfall", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //   it("if the data is exist, should render the waterfall svg ", async () => {
  //     render(
  //       <BrowserRouter>
  //         <CompaniesContext.Provider
  //           value={{
  //             selectedCompany: {
  //               uuid: "123",
  //               currency: "EGP",
  //             },
  //           }}
  //         >
  //           <CFOCashflowWaterfall data={firstViewData} />
  //         </CompaniesContext.Provider>
  //       </BrowserRouter>
  //     );
  //     await waitFor(() => {
  //       expect(screen.getByTestId("waterfall_svg")).toBeInTheDocument();
  //     });
  //   });

  ////
  it("if the data is empty , the Cash flow from operations card should be rendered with dash ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewDataNanOperatingActivities} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("cash_flow_from_operations_card_value").textContent
      ).toBe("-");
    });
  });

  it("if the data is exist , the Cash flow from operations card should be rendered with a value ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewData} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("cash_flow_from_operations_card_value").textContent
      ).toBe(" EGP 26,283,109.73");
    });
  });

  it("if the data is empty , the Cash flow from investing card should be rendered with dash ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewDataNanInvestingActivities} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("cash_flow_from_investing_card_value").textContent
      ).toBe("-");
    });
  });

  it("if the data is exist , the Cash flow from investing card should be rendered with a value ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewData} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("cash_flow_from_investing_card_value").textContent
      ).toBe(" EGP 26,283,109.73");
    });
  });

  it("if the data is empty , the Cash flow from finance card should be rendered with dash ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewDataNanFinancingActivities} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("cash_flow_from_finance_card_value").textContent
      ).toBe("-");
    });
  });

  it("if the data is exist , the Cash flow from finance card should be rendered with a value ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewData} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("cash_flow_from_finance_card_value").textContent
      ).toBe(" EGP 26,283,109.73");
    });
  });

  it("if the data is empty , the Beginning cash balance card should be rendered with dash ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewDataNanBeginningCashBalance} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("Beginning_cash_balance_card_value").textContent
      ).toBe("-");
    });
  });

  it("if the data is exist , the Beginning cash balance card should be rendered with a value ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewData} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("Beginning_cash_balance_card_value").textContent
      ).toBe(" EGP 26,283,109.73");
    });
  });

  it("if the data is empty , the Ending cash balance card should be rendered with dash ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewDataNanEndingCashBalance} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("Ending_cash_balance_card_value").textContent
      ).toBe("-");
    });
  });

  it("if the data is exist , the Ending cash balance card should be rendered with a value ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
            },
          }}
        >
          <CFOCashflowWaterfall data={firstViewData} />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("Ending_cash_balance_card_value").textContent
      ).toBe(" EGP 26,283,109.73");
    });
  });
});
