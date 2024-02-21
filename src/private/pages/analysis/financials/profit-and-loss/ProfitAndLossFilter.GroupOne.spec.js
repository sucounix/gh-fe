import React from "react";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import ProfitAndLossFilter from "./ProfitAndLossFilter";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("ProfitAndLossFilter", () => {
  const dummyTimeFrameResult = {
    frequency_period: "annual",
  };

  const dummyCompanyPreferencesApi = {
    viewPL: {
      value: "Management accounts",
      testId: "Accounts",
      label: "Accounts",
    },
    isStandardPL: true,
    hideYoYPL: false,
  };

  const setCompanyAPIPreferences = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the select view dropdown with the correct value", () => {
    render(
      <TimeFrameContext.Provider
        value={{ timeFrameResult: dummyTimeFrameResult }}
      >
        <CompanyPreferencesApiContext.Provider
          value={{
            companyPreferencesApi: dummyCompanyPreferencesApi,
            setCompanyAPIPreferences,
          }}
        >
          <ProfitAndLossFilter />
        </CompanyPreferencesApiContext.Provider>
      </TimeFrameContext.Provider>
    );
    const selectViewDropdown = screen.getByTestId("select-view-pl");
    expect(selectViewDropdown).toBeInTheDocument();
    expect(screen.getByTestId("dropdown_label")).toHaveTextContent(
      dummyCompanyPreferencesApi.viewPL?.label
    );
  });

  it("updates the company API preferences when the select view dropdown value changes", () => {
    render(
      <TimeFrameContext.Provider
        value={{ timeFrameResult: dummyTimeFrameResult }}
      >
        <CompanyPreferencesApiContext.Provider
          value={{
            companyPreferencesApi: dummyCompanyPreferencesApi,
            setCompanyAPIPreferences,
          }}
        >
          <ProfitAndLossFilter />
        </CompanyPreferencesApiContext.Provider>
      </TimeFrameContext.Provider>
    );

    const selectViewDropdown = screen.getByTestId("select-view-pl");
    fireEvent.click(selectViewDropdown);
    fireEvent.click(screen.getByText("Summary"));
    expect(setCompanyAPIPreferences).toHaveBeenCalledWith({
      ...dummyCompanyPreferencesApi,
      viewPL: { value: "Summary", testId: "Summary" },
    });
  });

  it("renders the view tabs with the correct value", () => {
    render(
      <TimeFrameContext.Provider
        value={{ timeFrameResult: dummyTimeFrameResult }}
      >
        <CompanyPreferencesApiContext.Provider
          value={{
            companyPreferencesApi: dummyCompanyPreferencesApi,
            setCompanyAPIPreferences,
          }}
        >
          <ProfitAndLossFilter />
        </CompanyPreferencesApiContext.Provider>
      </TimeFrameContext.Provider>
    );

    const viewTabs = screen.getByTestId("viewTabs");
    expect(viewTabs).toBeInTheDocument();
    expect(viewTabs).toHaveTextContent(
      dummyCompanyPreferencesApi.isStandardPL ? "Standard" : "EBITDA"
    );
  });

  it("updates the company API preferences when the view tab is changed", () => {
    render(
      <TimeFrameContext.Provider
        value={{ timeFrameResult: dummyTimeFrameResult }}
      >
        <CompanyPreferencesApiContext.Provider
          value={{
            companyPreferencesApi: dummyCompanyPreferencesApi,
            setCompanyAPIPreferences,
          }}
        >
          <ProfitAndLossFilter />
        </CompanyPreferencesApiContext.Provider>
      </TimeFrameContext.Provider>
    );

    const viewTabs = screen.getByTestId("viewTabs");
    const secondTab = within(viewTabs).getByText("EBITDA");
    fireEvent.click(secondTab);
    expect(setCompanyAPIPreferences).toHaveBeenCalledWith({
      ...dummyCompanyPreferencesApi,
      isStandardPL: false,
    });
  });

  it("renders the segmented control when the frequency period is not 'annual'", () => {
    window.ResizeObserver = ResizeObserver;

    render(
      <TimeFrameContext.Provider
        value={{
          timeFrameResult: {
            frequency_period: "month",
          },
        }}
      >
        <CompanyPreferencesApiContext.Provider
          value={{
            companyPreferencesApi: dummyCompanyPreferencesApi,
            setCompanyAPIPreferences,
          }}
        >
          <ProfitAndLossFilter />
        </CompanyPreferencesApiContext.Provider>
      </TimeFrameContext.Provider>
    );

    const segmentedControl = screen.getByTestId("show-YoY");
    expect(segmentedControl).toBeInTheDocument();
  });

  it("updates the company API preferences when the segmented control value changes", async () => {
    render(
      <TimeFrameContext.Provider
        value={{
          timeFrameResult: {
            frequency_period: "month",
          },
        }}
      >
        <CompanyPreferencesApiContext.Provider
          value={{
            companyPreferencesApi: dummyCompanyPreferencesApi,
            setCompanyAPIPreferences,
          }}
        >
          <ProfitAndLossFilter />
        </CompanyPreferencesApiContext.Provider>
      </TimeFrameContext.Provider>
    );

    const segmentedControl = screen.getByTestId("show-YoY");
    expect(segmentedControl).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide"));
    await waitFor(() => {
      expect(setCompanyAPIPreferences).toHaveBeenCalled();
    });
  });
});
