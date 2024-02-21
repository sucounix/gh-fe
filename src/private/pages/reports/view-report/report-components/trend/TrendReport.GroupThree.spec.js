import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import ViewReport from "../../ViewReport";
import { data } from "../../dummy-data/ViewReportDummyData";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";
import { BreadcrumbsContext } from "../../../../../../contexts/BreadcrumbsContext";
import { SubscriptionContext } from "../../../../../../contexts/SubscriptionContext";

jest.mock("axios");

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("View Trend Report", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when fetch the report details, the trend chart should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({ data: data });

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{ selectedCompany: { uuid: "123", currency: "EGP" } }}
        >
          <BreadcrumbsContext.Provider
            value={{
              breadcrumbs: [
                {
                  title: "Reports",
                },
              ],
              setBreadCrumbs: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                canCreateReport: jest.fn(() => {
                  return true;
                }),
              }}
            >
              <ViewReport />
            </SubscriptionContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("chart_view")).toBeInTheDocument();
    });
  });
});
