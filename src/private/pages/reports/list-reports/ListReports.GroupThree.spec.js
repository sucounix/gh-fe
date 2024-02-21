import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import ListReports from "./ListReports";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";

describe("report list", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders list of reports", () => {
    const mockResponse = {
      items: [
        {
          uuid: "123",
          title: "My Report",
          period: "2023-10-01 - 2023-10-31",
          modified: "2023-10-27T15:00:00Z",
          created: "2023-10-20T10:00:00Z",
          is_valid: true,
        },
        // ... other reports
      ],
      pages: 3,
      page: 1,
    };
    render(
      <SubscriptionContext.Provider
        value={{
          canCreateReport: jest.fn(() => {
            return true;
          }),
        }}
      >
        <ListReports
          response={mockResponse}
          setPageNumber={() => jest.fn()}
          currentSortOption={"modified_desc"}
          setSelectedReports={() => jest.fn()}
          // ... other props
        />
      </SubscriptionContext.Provider>
    );

    // Verify reports table is rendered
    expect(screen.getByTestId("list-section")).toBeTruthy();

    // Verify 'Select All' checkbox is present
    expect(screen.getByTestId("select_all_checkbox")).toBeTruthy();

    // // Verify pagination is rendered
    expect(screen.getByTestId("pagination__container")).toBeTruthy();
  });

  it("renders empty section", () => {
    const mockResponse = {
      items: [],
    };
    render(
      <SubscriptionContext.Provider
        value={{
          canCreateReport: jest.fn(() => {
            return true;
          }),
        }}
      >
        <ListReports response={mockResponse} />
      </SubscriptionContext.Provider>
    );

    expect(screen.getByTestId("empty__list")).toBeTruthy();
  });

  it("should handle report click", () => {
    const mockHandleReportClick = jest.fn();
    const mockResponse = {
      items: [
        {
          uuid: "123",
          title: "My Report",
          period: "2023-10-01 - 2023-10-31",
          modified: "2023-10-27T15:00:00Z",
          created: "2023-10-20T10:00:00Z",
          is_valid: false,
        },
      ],
    };
    render(
      <SubscriptionContext.Provider
        value={{
          canCreateReport: jest.fn(() => {
            return true;
          }),
        }}
      >
        <ListReports
          response={mockResponse}
          currentSortOption="period_asc"
          handleReportClick={mockHandleReportClick}
        />
      </SubscriptionContext.Provider>
    );
    const spen = screen.getByTestId("report_row");
    fireEvent.click(spen);
    expect(mockHandleReportClick).toBeCalledWith(mockResponse.items[0]);
  });

  it("should select all reports", () => {
    const mockSetSelectedReports = jest.fn();
    const mockResponse = {
      items: [
        {
          uuid: "123",
          title: "My Report",
          period: "2023-10-01 - 2023-10-31",
          modified: "2023-10-27T15:00:00Z",
          created: "2023-10-20T10:00:00Z",
          is_valid: true,
        },
      ],
    };
    render(
      <SubscriptionContext.Provider
        value={{
          canCreateReport: jest.fn(() => {
            return true;
          }),
        }}
      >
        <ListReports
          response={mockResponse}
          currentSortOption="period_asc"
          setSelectedReports={mockSetSelectedReports}
        />
      </SubscriptionContext.Provider>
    );
    const checkbox = screen.getByTestId("select_all_checkbox");
    fireEvent.click(checkbox);
    expect(mockSetSelectedReports).toBeCalledWith(["123"]);
  });

  it("should un select all reports", () => {
    const mockSetSelectedReports = jest.fn();
    const mockResponse = {
      items: [
        {
          uuid: "123",
          title: "My Report",
          period: "2023-10-01 - 2023-10-31",
          modified: "2023-10-27T15:00:00Z",
          created: "2023-10-20T10:00:00Z",
          is_valid: true,
        },
      ],
    };
    render(
      <SubscriptionContext.Provider
        value={{
          canCreateReport: jest.fn(() => {
            return true;
          }),
        }}
      >
        <ListReports
          response={mockResponse}
          currentSortOption="period_asc"
          setSelectedReports={mockSetSelectedReports}
          selectedReports={["132"]}
        />
      </SubscriptionContext.Provider>
    );
    const checkbox = screen.getByTestId("select_all_checkbox");
    fireEvent.click(checkbox);
    expect(mockSetSelectedReports).toBeCalledWith([]);
  });

  it("remove report from selected reports", () => {
    const mockSetSelectedReports = jest.fn();
    const mockResponse = {
      items: [
        {
          uuid: "123",
          title: "My Report",
          period: "2023-10-01 - 2023-10-31",
          modified: "2023-10-27T15:00:00Z",
          created: "2023-10-20T10:00:00Z",
          is_valid: true,
        },
      ],
    };
    const mockSelectedReports = ["123"];
    render(
      <SubscriptionContext.Provider
        value={{
          canCreateReport: jest.fn(() => {
            return true;
          }),
        }}
      >
        <ListReports
          response={mockResponse}
          selectedReports={mockSelectedReports}
          currentSortOption="period_asc"
          setSelectedReports={mockSetSelectedReports}
        />
      </SubscriptionContext.Provider>
    );
    const checkbox = screen.getByTestId("checkbox_0");
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(mockSetSelectedReports).toBeCalledWith([]);
  });

  it("should change sort option from desc to asc", () => {
    const mockHandleSortChange = jest.fn();
    const mockSetPageNumber = jest.fn();
    const mockSetCurrentSortOption = jest.fn();

    const mockResponse = {
      items: [
        {
          period: "2023-10-01 - 2023-10-31",
        },
        // ... other reports
      ],
      pages: 3,
      page: 1,
    };
    render(
      <SubscriptionContext.Provider
        value={{
          canCreateReport: jest.fn(() => {
            return false;
          }),
        }}
      >
        <ListReports
          response={mockResponse}
          setPageNumber={mockSetPageNumber}
          currentSortOption="period_desc"
          setCurrentSortOption={mockSetCurrentSortOption}
        />
      </SubscriptionContext.Provider>
    );
    fireEvent.click(screen.getByTestId("period_header"));
    fireEvent.click(screen.getByTestId("d-period-desc"));
    mockHandleSortChange("period");
    expect(mockSetCurrentSortOption).toBeCalledWith("period_asc");
  });

  it("should change sort option from asc to desc", () => {
    const mockHandleSortChange = jest.fn();
    const mockSetPageNumber = jest.fn();
    const mockSetCurrentSortOption = jest.fn();

    const mockResponse = {
      items: [
        {
          period: "2023-10-01 - 2023-10-31",
        },
        // ... other reports
      ],
      pages: 3,
      page: 1,
    };
    render(
      <SubscriptionContext.Provider
        value={{
          canCreateReport: jest.fn(() => {
            return false;
          }),
        }}
      >
        <ListReports
          response={mockResponse}
          setPageNumber={mockSetPageNumber}
          currentSortOption="period_asc"
          setCurrentSortOption={mockSetCurrentSortOption}
        />
      </SubscriptionContext.Provider>
    );
    fireEvent.click(screen.getByTestId("period_header"));
    fireEvent.click(screen.getByTestId("d-period-asc"));
    mockHandleSortChange("period");
    expect(mockSetCurrentSortOption).toBeCalledWith("period_desc");
  });

  it("calls setPageNumber when pagination is clicked", () => {
    const mockResponse = {
      items: [
        {
          period: "2023-10-01 - 2023-10-31",
        },
      ],
      pages: 3,
      page: 1,
    };
    const setPageNumberMock = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          canCreateReport: jest.fn(() => {
            return false;
          }),
        }}
      >
        <ListReports
          response={mockResponse}
          setPageNumber={setPageNumberMock}
          currentSortOption="period_asc"
          // ... other props
        />
      </SubscriptionContext.Provider>
    );

    const paginationContainer = screen.getByTestId("pagination__container");
    const thirdButton = within(paginationContainer).getAllByRole("button")[2];
    fireEvent.click(thirdButton);
    expect(setPageNumberMock).toHaveBeenCalledWith(1);
  });
});
