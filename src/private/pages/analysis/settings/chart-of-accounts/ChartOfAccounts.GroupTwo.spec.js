import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AxiosMock from "axios";
import ChartOfAccounts from "./ChartOfAccounts";
import {
  AccountsDataPL,
  AccountsDataBS,
  classificationDataBS,
  classificationDataPL,
} from "./DummyData";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "123",
  }),
}));
jest.mock("react-beautiful-dnd", () => ({
  ...jest.requireActual("react-beautiful-dnd"), // use actual for all non-hook parts
  Draggable: jest.fn(),
}));

describe("Chart of accounts", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetch classification and chart of accounts for the first time, and the profit & loss view is appear", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: classificationDataPL }),
      AxiosMock.get.mockResolvedValueOnce({ data: AccountsDataPL }),
    ]);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              is_chart_of_accounts_ready: true,
              currency: "USD",
              uuid: "123",
            },
            isTimeframeReady: true,
            isAPIPreferencesReady: true,
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <ChartOfAccounts />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(screen.getByTestId("tab__content__pl")).toBeInTheDocument();
    });
  });

  it("when click on bs tab the bs content will appear", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: classificationDataPL }),
      AxiosMock.get.mockResolvedValueOnce({ data: AccountsDataPL }),
    ]);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              is_chart_of_accounts_ready: true,
              currency: "USD",
              uuid: "123",
            },
            isTimeframeReady: true,
            isAPIPreferencesReady: true,
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <ChartOfAccounts />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(screen.getByTestId("tab__content__pl")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("tabs")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("pl__tab__btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId(`pl__tab__btn`));

    Promise.resolve([
      AxiosMock.get.mockResolvedValueOnce({ data: classificationDataBS }),
      AxiosMock.get.mockResolvedValueOnce({ data: AccountsDataBS }),
    ]);
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(screen.getByTestId("tab__content__bs")).toBeInTheDocument();
    });
  });
});
