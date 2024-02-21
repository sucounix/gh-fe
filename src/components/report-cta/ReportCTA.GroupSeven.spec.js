import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import ReportCTA from "./ReportCTA";
import { SubscriptionContext } from "../../contexts/SubscriptionContext";
import { CompaniesContext } from "../../contexts/CompaniesContext";
import { BrowserRouter } from "react-router-dom";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
  useParams: () => ({
    companyId: "123",
  }),
}));

describe("ReportCTA", () => {
  const selectedCompany = { uuid: "123" };

  it('renders nothing when subscription code is not "starter"', async () => {
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: {
              pricingModel: "Fixed",
            },
          }}
        >
          <CompaniesContext.Provider value={{ selectedCompany }}>
            <ReportCTA page="financials" />
          </CompaniesContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("report-cta")).not.toBeInTheDocument();
    });
  });

  it('renders the report CTA when subscription code is "starter"', async () => {
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ subscriptionInfo: { pricingModel: "Free" } }}
        >
          <CompaniesContext.Provider value={{ selectedCompany }}>
            <ReportCTA page="financials" />
          </CompaniesContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("report-cta")).toBeInTheDocument();
    });
  });

  it("navigates to reports when pressed on cta", async () => {
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ subscriptionInfo: { pricingModel: "Free" } }}
        >
          <CompaniesContext.Provider value={{ selectedCompany }}>
            <ReportCTA page="financials" />
          </CompaniesContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("report-cta")).toBeInTheDocument();
    });

    const goToReportBtn = screen.getByTestId("go-to-report-cta");

    await waitFor(() => {
      expect(goToReportBtn).toBeInTheDocument();
    });

    fireEvent.click(goToReportBtn);

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `/company/${selectedCompany.uuid}/reports`
      );
    });
  });

  it("opens the sneak peak modal when pressed on cta", async () => {
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ subscriptionInfo: { pricingModel: "Free" } }}
        >
          <CompaniesContext.Provider value={{ selectedCompany }}>
            <ReportCTA page="financials" />
          </CompaniesContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("report-cta")).toBeInTheDocument();
    });

    const viewReportBtn = screen.getByTestId("view-report-cta");

    await waitFor(() => {
      expect(viewReportBtn).toBeInTheDocument();
    });

    fireEvent.click(viewReportBtn);

    await waitFor(() => {
      expect(screen.getByTestId("sneak-peak-report")).toBeInTheDocument();
    });
  });
});
