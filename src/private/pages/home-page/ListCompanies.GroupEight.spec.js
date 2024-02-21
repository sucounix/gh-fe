import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import ListCompanies from "./ListCompanies";
import moment from "moment";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({
    companyId: "123",
  }),
}));
describe("ListCompanies", () => {
  const companies = [
    {
      uuid: "1",
      name: "Company 1",
      is_enabled: true,
      data_source: "Excel",
      modified: "2022-01-01",
    },
    {
      uuid: "2",
      name: "Company 2",
      is_enabled: false,
      data_source: "QuickBooks",
      modified: "2022-01-02",
    },
  ];

  const setSelectedCompany = jest.fn();

  it("renders the list of companies", () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={{ companies, setSelectedCompany }}>
          <ListCompanies />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    const companyElements = screen.getAllByTestId("company_row");
    expect(companyElements.length).toBe(companies.length);
  });

  it("displays company name and last update", () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={{ companies, setSelectedCompany }}>
          <ListCompanies />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    const companyElements = screen.getAllByTestId("company_row");
    companies.forEach((company, index) => {
      const companyNameElement = screen.getByText(company.name);
      const lastUpdateElement = screen.queryAllByText(
        `${moment(company.modified).fromNow()}`
      );
      expect(companyNameElement).toBeInTheDocument();
      expect(lastUpdateElement).toHaveLength(2);
      expect(companyElements[index]).toContainElement(companyNameElement);
    });
  });

  it("navigates to analysis page when company name is clicked", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={{ companies, setSelectedCompany }}>
          <ListCompanies />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    const companyAnalysisLink = screen.queryAllByText("Analysis");
    fireEvent.click(companyAnalysisLink[0]);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        "company/1/analysis/financials"
      );
    });
  });

  it("navigates to reports page when reports module is clicked", () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={{ companies, setSelectedCompany }}>
          <ListCompanies />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    const companiesReportsLinks = screen.queryAllByText("Reports");
    fireEvent.click(companiesReportsLinks[0]);

    expect(mockedUsedNavigate).toHaveBeenCalledWith("company/1/reports/");
  });

  it("displays delete button and calls setCurrentCompany and setShowDeletePopup when delete button is clicked", async () => {
    const setCurrentCompany = jest.fn();
    const setShowDeletePopup = jest.fn();

    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={{ companies, setSelectedCompany }}>
          <ListCompanies
            setCurrentCompany={setCurrentCompany}
            setShowDeletePopup={setShowDeletePopup}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    const companiesOptions = screen.queryAllByTestId("company_options");
    fireEvent.click(companiesOptions[0]);

    await waitFor(() => {
      expect(screen.getByTestId("delete_btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("delete_btn"));

    await waitFor(() => {
      expect(setShowDeletePopup).toHaveBeenCalledWith(true);
    });

    await waitFor(() => {
      expect(setCurrentCompany).toHaveBeenCalledWith("1");
    });
  });
});
