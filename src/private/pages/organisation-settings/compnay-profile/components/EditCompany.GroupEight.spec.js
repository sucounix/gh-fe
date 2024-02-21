import React from "react";
import AxiosMock from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EditCompany from "./EditCompany";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const companies = [
  {
    uuid: "680a1180-1602-4587-b678-31d93e76bdac",
    created: "2023-05-11T10:57:55.380558Z",
    modified: "2023-05-14T08:02:18.830829Z",
    name: "ABC Corporation Ltd",
    period_frequency: "month",
    first_month_of_financial_year: "February",
    data_source: "Excel",
    outstanding_shares: "fixed",
    budgets: "fixed",
    logo: "http://placeimg.com/640/480",
    alerts: "fixed",
    analysis_is_finished: true,
    currency: "EGP",
    founding_date: "2019-01-01",
    primary_industry: "Fishing",
    secondary_industry: "Mining",
    primary_market: "Egypt",
    secondary_market: "UAE",
    description: "",
    pitch_line: "",
    user: "330a0753-8ac0-4bc7-96ab-6fa00d26976c",
  },
];

describe("Edit Company", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render and display data", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: companies[0],
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: companies[0],
    });

    render(
      <CompaniesContext.Provider
        value={{
          fetchCompanyList: jest.fn(),
          companies: companies,
          selectedCompany: companies[0],
        }}
      >
        <BrowserRouter>
          <EditCompany />
        </BrowserRouter>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(1);
    });

    const nameInput = screen.getByTestId("company-name-input");
    const fiscalYearInput = screen.getByTestId("fiscal-year-start-month-input");
    const foundingDateInput = screen.getByTestId("founding-date-input");
    const primaryIndustryInput = screen.getByTestId("primary-industry-input");
    const secondaryIndustryInput = screen.getByTestId(
      "secondary-industry-input"
    );
    const primaryMarketInput = screen.getByTestId("primary-market-input");
    const secondaryMarketInput = screen.getByTestId("secondary-market-input");

    await waitFor(() => {
      expect(nameInput.value).toBe("ABC Corporation Ltd");
    });
    await waitFor(() => {
      expect(fiscalYearInput.value).toBe("February");
    });
    await waitFor(() => {
      expect(primaryIndustryInput.value).toBe("Fishing");
    });
    await waitFor(() => {
      expect(secondaryIndustryInput.value).toBe("Mining");
    });
    await waitFor(() => {
      expect(primaryMarketInput.value).toBe("Egypt");
    });
    await waitFor(() => {
      expect(secondaryMarketInput.value).toBe("UAE");
    });
  });

  it("should update company", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: companies[0],
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: companies[0],
    });
    AxiosMock.patch.mockResolvedValueOnce({
      data: companies[0],
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          fetchCompanyList: jest.fn(),
          companies: companies,
          selectedCompany: companies[0],
        }}
      >
        <BrowserRouter>
          <EditCompany />
        </BrowserRouter>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(1);
    });

    const nameInput = screen.getByTestId("company-name-input");
    const fiscalYearInput = screen.getByTestId("fiscal-year-start-month-input");
    const foundingDateInput = screen.getByTestId("founding-date-input");
    const primaryIndustryInput = screen.getByTestId("primary-industry-input");
    const secondaryIndustryInput = screen.getByTestId(
      "secondary-industry-input"
    );
    const primaryMarketInput = screen.getByTestId("primary-market-input");
    const secondaryMarketInput = screen.getByTestId("secondary-market-input");
    const submitButton = screen.getByTestId("submit-button");

    await waitFor(() => {
      expect(nameInput.value).toBe("ABC Corporation Ltd");
    });
    await waitFor(() => {
      expect(fiscalYearInput.value).toBe("February");
    });
    await waitFor(() => {
      expect(primaryIndustryInput.value).toBe("Fishing");
    });
    await waitFor(() => {
      expect(secondaryIndustryInput.value).toBe("Mining");
    });
    await waitFor(() => {
      expect(primaryMarketInput.value).toBe("Egypt");
    });
    await waitFor(() => {
      expect(secondaryMarketInput.value).toBe("UAE");
    });

    fireEvent.change(nameInput, { target: { value: "ABC Corporation Ltd 2" } });
    fireEvent.change(fiscalYearInput, { target: { value: "January" } });
    fireEvent.change(primaryIndustryInput, { target: { value: "Finance" } });
    fireEvent.change(secondaryIndustryInput, {
      target: { value: "Banking" },
    });
    fireEvent.change(primaryMarketInput, { target: { value: "Saudi Arabia" } });
    fireEvent.change(secondaryMarketInput, {
      target: { value: "United States" },
    });

    await waitFor(() => {
      expect(nameInput.value).toBe("ABC Corporation Ltd 2");
    });
    await waitFor(() => {
      expect(fiscalYearInput.value).toBe("January");
    });
    await waitFor(() => {
      expect(primaryIndustryInput.value).toBe("Finance");
    });
    await waitFor(() => {
      expect(secondaryIndustryInput.value).toBe("Banking");
    });
    await waitFor(() => {
      expect(primaryMarketInput.value).toBe("Saudi Arabia");
    });
    await waitFor(() => {
      expect(secondaryMarketInput.value).toBe("United States");
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(AxiosMock.patch).toHaveBeenCalledTimes(1);
    });
  });

  it("should find the delete button if there's a logo", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: companies[0],
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: companies[0],
    });
    AxiosMock.patch.mockResolvedValueOnce({
      data: companies[0],
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          fetchCompanyList: jest.fn(),
          companies: companies,
          selectedCompany: companies[0],
        }}
      >
        <BrowserRouter>
          <EditCompany />
        </BrowserRouter>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("logo-avatar")).toBeInTheDocument();
    });

    const deleteLogoBtn = screen.getByTestId("logo-delete");

    await waitFor(() => {
      expect(deleteLogoBtn).toBeInTheDocument();
    });
  });

  it("should call the endpoint on logo remove", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: companies[0],
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: companies[0],
    });
    AxiosMock.patch.mockResolvedValueOnce({
      data: companies[0],
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          fetchCompanyList: jest.fn(),
          companies: companies,
          selectedCompany: companies[0],
        }}
      >
        <BrowserRouter>
          <EditCompany />
        </BrowserRouter>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("logo-avatar")).toBeInTheDocument();
    });

    const deleteLogoBtn = screen.getByTestId("logo-delete");

    await waitFor(() => {
      expect(deleteLogoBtn).toBeInTheDocument();
    });

    fireEvent.click(deleteLogoBtn);

    await waitFor(() => {
      expect(AxiosMock.patch).toHaveBeenCalledWith(
        "/company/680a1180-1602-4587-b678-31d93e76bdac/",
        { logo: null },
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });

  it("if there is no logo delete button shouldn't be visible", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        ...companies[0],
        logo: null,
      },
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          fetchCompanyList: jest.fn(),
          companies: companies,
          selectedCompany: {
            ...companies[0],
            logo: null,
          },
        }}
      >
        <BrowserRouter>
          <EditCompany />
        </BrowserRouter>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("logo-avatar")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryAllByTestId("logo-delete")).toHaveLength(0);
    });
  });
});
