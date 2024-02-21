import React, { useContext } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  CompanyPreferencesApiProvider,
  CompanyPreferencesApiContext,
} from "./CompanyPreferencesApi";
import { CompaniesContext } from "./CompaniesContext";

const TestingComponent = () => {
  const {
    companyPreferencesApi,
    getCompanyAPIPreferences,
    setCompanyAPIPreferences,
  } = useContext(CompanyPreferencesApiContext);

  return (
    <div data-testid="children_component">
      <button
        data-testid="get_prefereces"
        onClick={() => {
          getCompanyAPIPreferences("123");
        }}
      >
        get company preferences
      </button>
      <button
        data-testid="set_prefereces"
        onClick={() => {
          setCompanyAPIPreferences({
            viewBS: { value: "Summary", testId: "Summary" },
          });
        }}
      >
        set company preferences
      </button>

      <p
        data-testid={`view_bs_preferences_${companyPreferencesApi?.viewBS?.testId}`}
      >
        {companyPreferencesApi?.viewBS?.value}
      </p>
    </div>
  );
};

describe("Company api preferences Context", () => {
  it("if the local storage contain pereferences , then should render it", async () => {
    localStorage.setItem(
      `123_api`,
      JSON.stringify({
        viewBS: { value: "Summary", testId: "Summary" },
      })
    );
    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: {
            uuid: "123",
          },
          setIsAPIPreferencesReady: jest.fn(),
        }}
      >
        <CompanyPreferencesApiProvider>
          <TestingComponent />
        </CompanyPreferencesApiProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("get_prefereces"));
    await waitFor(() => {
      expect(
        screen.getByTestId("view_bs_preferences_Summary")
      ).toBeInTheDocument();
    });
  });
  it("if the local storage not contain pereferences , then should save and render the default value", async () => {
    localStorage.removeItem(`123_api`);

    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: {
            uuid: "123",
          },
          setIsAPIPreferencesReady: jest.fn(),
        }}
      >
        <CompanyPreferencesApiProvider>
          <TestingComponent />
        </CompanyPreferencesApiProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("get_prefereces"));
    await waitFor(() => {
      expect(
        screen.getByTestId("view_bs_preferences_Accounts")
      ).toBeInTheDocument();
    });
  });
  it("when try to set preferences , then should render it", async () => {
    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: {
            uuid: "123",
          },
          setIsAPIPreferencesReady: jest.fn(),
        }}
      >
        <CompanyPreferencesApiProvider>
          <TestingComponent />
        </CompanyPreferencesApiProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("set_prefereces"));
    await waitFor(() => {
      expect(
        screen.getByTestId("view_bs_preferences_Summary")
      ).toBeInTheDocument();
    });
  });

  it("if their is no selected company the setCompanyApiPreferences shouldn't work", async () => {
    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: null,
          setIsAPIPreferencesReady: jest.fn(),
        }}
      >
        <CompanyPreferencesApiProvider>
          <TestingComponent />
        </CompanyPreferencesApiProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("set_prefereces"));
    await waitFor(() => {
      expect(
        screen.queryByTestId("view_bs_preferences_Summary")
      ).not.toBeInTheDocument();
    });
  });
});
