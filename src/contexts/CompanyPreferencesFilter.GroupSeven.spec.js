import React, { useContext } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  CompanyPreferencesFilterProvider,
  CompanyPreferencesFilterContext,
} from "./CompanyPreferencesFilter";
import { CompaniesContext } from "./CompaniesContext";

const TestingComponent = () => {
  const {
    companyPreferencesFilter,
    getCompanyFilterPreferences,
    setCompanyFilterPreferences,
  } = useContext(CompanyPreferencesFilterContext);

  return (
    <div data-testid="children_component">
      <button
        data-testid="get_prefereces"
        onClick={() => {
          getCompanyFilterPreferences("123");
        }}
      >
        get company preferences
      </button>
      <button
        data-testid="set_prefereces"
        onClick={() => {
          setCompanyFilterPreferences({
            predefineChartTA: "test-Custom",
          });
        }}
      >
        set company preferences
      </button>

      <p
        data-testid={`predefineChartTA_preferences_${companyPreferencesFilter?.predefineChartTA}`}
      >
        {companyPreferencesFilter?.predefineChartTA}
      </p>
    </div>
  );
};

describe("Company filter preferences Context", () => {
  it("if the local storage contain pereferences , then should render it", async () => {
    localStorage.setItem(
      `123_filter`,
      JSON.stringify({
        predefineChartTA: "test-Custom",
      })
    );
    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: {
            uuid: "123",
          },
        }}
      >
        <CompanyPreferencesFilterProvider>
          <TestingComponent />
        </CompanyPreferencesFilterProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("get_prefereces"));
    await waitFor(() => {
      expect(
        screen.getByTestId("predefineChartTA_preferences_test-Custom")
      ).toBeInTheDocument();
    });
  });
  it("if the local storage not contain pereferences , then should save and render the default value", async () => {
    localStorage.removeItem(`123_filter`);

    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: {
            uuid: "123",
          },
        }}
      >
        <CompanyPreferencesFilterProvider>
          <TestingComponent />
        </CompanyPreferencesFilterProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("get_prefereces"));
    await waitFor(() => {
      expect(
        screen.getByTestId("predefineChartTA_preferences_Custom")
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
        }}
      >
        <CompanyPreferencesFilterProvider>
          <TestingComponent />
        </CompanyPreferencesFilterProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("set_prefereces"));
    await waitFor(() => {
      expect(
        screen.getByTestId("predefineChartTA_preferences_test-Custom")
      ).toBeInTheDocument();
    });
  });

  it("if their is no selected company the setCompanyFilterPreferences shouldn't work", async () => {
    render(
      <CompaniesContext.Provider
        value={{
          selectedCompany: null,
        }}
      >
        <CompanyPreferencesFilterProvider>
          <TestingComponent />
        </CompanyPreferencesFilterProvider>
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("set_prefereces"));
    await waitFor(() => {
      expect(
        screen.queryByTestId("predefineChartTA_preferences_test-Custom")
      ).not.toBeInTheDocument();
    });
  });
});
