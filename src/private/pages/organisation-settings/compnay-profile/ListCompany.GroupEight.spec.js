import React from "react";
import { render, screen } from "@testing-library/react";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { useNavigate } from "react-router-dom";
import ListCompany from "./ListCompany";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("ListCompany", () => {
  it("should render selected company details", () => {
    const selectedCompany = {
      uuid: "123",
      name: "Company 1",
      founding_date: "2020-01-01",
      pitch_line: "Company pitch line",
      description: "Company description",
      currency: "USD",
      first_month_of_financial_year: "January",
      primary_industry: "Industry 1",
      secondary_industry: "Industry 2",
      primary_market: "Market 1",
      secondary_market: "Market 2",
    };

    render(
      <CompaniesContext.Provider
        value={{
          companies: [],
          selectedCompany,
          setSelectedCompany: jest.fn(),
        }}
      >
        <ListCompany />
      </CompaniesContext.Provider>
    );

    expect(screen.getByText(selectedCompany.name)).toBeInTheDocument();
    expect(screen.getByText(selectedCompany.pitch_line)).toBeInTheDocument();
    expect(screen.getByText(selectedCompany.description)).toBeInTheDocument();
    expect(screen.getByText(selectedCompany.currency)).toBeInTheDocument();
    expect(
      screen.getByText(selectedCompany.first_month_of_financial_year)
    ).toBeInTheDocument();
  });

  it("should render 'No companies to show' message when no company is selected", () => {
    render(
      <CompaniesContext.Provider
        value={{
          companies: [],
          selectedCompany: null,
          setSelectedCompany: jest.fn(),
        }}
      >
        <ListCompany />
      </CompaniesContext.Provider>
    );

    expect(screen.getByText("No companies to show")).toBeInTheDocument();
    expect(
      screen.getByText("Create a new company and upload new company data")
    ).toBeInTheDocument();
  });

  it("should call handleEdit and navigate to the edit page when 'Edit' button is clicked", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    const selectedCompany = {
      uuid: "123",
      name: "Company 1",
    };

    render(
      <CompaniesContext.Provider
        value={{
          companies: [],
          selectedCompany,
          setSelectedCompany: jest.fn(),
        }}
      >
        <ListCompany />
      </CompaniesContext.Provider>
    );

    screen.getByText("Edit").click();

    expect(navigate).toHaveBeenCalledWith(
      "/organisation-settings/company-profile/edit"
    );
  });
});
