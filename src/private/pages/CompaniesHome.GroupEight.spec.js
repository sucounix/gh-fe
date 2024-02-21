import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CompaniesHome from "./CompaniesHome";
import { BreadcrumbsContext } from "../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../contexts/CompaniesContext";
import { TimeFrameContext } from "../../contexts/TimeFrameContext";
import { SubscriptionContext } from "../../contexts/SubscriptionContext";
import { UserContext } from "../../contexts/UserContext";

describe("Companies Home", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the header container and the outlet should be rendered", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: null, logoutUser: jest.fn() }}>
          <SubscriptionContext.Provider
            value={{ isAllowedToAddNewCompany: true }}
          >
            <BreadcrumbsContext.Provider value={{ breadCrumbs: [] }}>
              <CompaniesContext.Provider
                value={{
                  companies: [],
                  selectedCompany: null,
                  setSelectedCompany: jest.fn(),
                }}
              >
                <TimeFrameContext.Provider
                  value={{ timeFrameResult: null, setTimeFrame: jest.fn() }}
                >
                  <CompaniesHome />
                </TimeFrameContext.Provider>
              </CompaniesContext.Provider>
            </BreadcrumbsContext.Provider>
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("header_container")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("companies_home_content")).toBeInTheDocument();
    });
  });
});
