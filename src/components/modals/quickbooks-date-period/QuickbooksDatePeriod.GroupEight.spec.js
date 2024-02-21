import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QuickbooksDatePeriod } from "./QuickbooksDatePeriod";

describe("Quickbooks Date Period", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the showModal flag = true", async () => {
    const handleQuickbooksIntegration = jest.fn();
    const handleHideQuickbooksModal = jest.fn();
    const setPeriod = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksDatePeriod
          showModal={true}
          handleHideQuickbooksModal={handleHideQuickbooksModal}
          handleQuickbooksIntegration={handleQuickbooksIntegration}
          datePeriod={{ from: "2020-01-01", to: "2020-01-01" }}
          setPeriod={setPeriod}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("Q__date__period__modal")).toBeInTheDocument();
    });
  });

  it("when click on close button , the handleHideQuickbooksModal should be called", async () => {
    const handleQuickbooksIntegration = jest.fn();
    const handleHideQuickbooksModal = jest.fn();
    const setPeriod = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksDatePeriod
          showModal={true}
          handleHideQuickbooksModal={handleHideQuickbooksModal}
          handleQuickbooksIntegration={handleQuickbooksIntegration}
          datePeriod={{ from: "2020-01-01", to: "2020-01-01" }}
          setPeriod={setPeriod}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("Q__date__period__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close_popup"));
    await waitFor(() => {
      expect(handleHideQuickbooksModal).toBeCalled();
    });
  });

  it("when click on confirm button and the datePeriod is null , the error msg should appear", async () => {
    const handleQuickbooksIntegration = jest.fn();
    const handleHideQuickbooksModal = jest.fn();
    const setPeriod = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksDatePeriod
          showModal={true}
          handleHideQuickbooksModal={handleHideQuickbooksModal}
          handleQuickbooksIntegration={handleQuickbooksIntegration}
          datePeriod={{ from: null, to: null }}
          setPeriod={setPeriod}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("Q__date__period__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_msg")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_msg").textContent).toBe(
        "Please select data period "
      );
    });
  });

  it("when click on confirm button and the datePeriod.from > datePeriod.to , the error msg should appear", async () => {
    const handleQuickbooksIntegration = jest.fn();
    const handleHideQuickbooksModal = jest.fn();
    const setPeriod = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksDatePeriod
          showModal={true}
          handleHideQuickbooksModal={handleHideQuickbooksModal}
          handleQuickbooksIntegration={handleQuickbooksIntegration}
          datePeriod={{ from: "2020-02-02", to: "2020-01-01" }}
          setPeriod={setPeriod}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("Q__date__period__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_msg")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_msg").textContent).toBe(
        "The end date should be greater than the start date "
      );
    });
  });

  it("when click on confirm button and the datePeriod range selected is greater than 10 years , the error msg should appear", async () => {
    const handleQuickbooksIntegration = jest.fn();
    const handleHideQuickbooksModal = jest.fn();
    const setPeriod = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksDatePeriod
          showModal={true}
          handleHideQuickbooksModal={handleHideQuickbooksModal}
          handleQuickbooksIntegration={handleQuickbooksIntegration}
          datePeriod={{ from: "2009-01-01", to: "2020-01-05" }}
          setPeriod={setPeriod}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("Q__date__period__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_msg")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_msg").textContent).toBe(
        "The max period is 10 years "
      );
    });
  });

  it("when click on confirm button and the datePeriod is valid , the handleQuickbooksIntegration should be called", async () => {
    const handleQuickbooksIntegration = jest.fn();
    const handleHideQuickbooksModal = jest.fn();
    const setPeriod = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksDatePeriod
          showModal={true}
          handleHideQuickbooksModal={handleHideQuickbooksModal}
          handleQuickbooksIntegration={handleQuickbooksIntegration}
          datePeriod={{ from: "2020-01-01", to: "2020-01-05" }}
          setPeriod={setPeriod}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("Q__date__period__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.queryByTestId("error_msg")).not.toBeTruthy();
    });
    await waitFor(() => {
      expect(handleQuickbooksIntegration).toBeCalled();
    });
    await waitFor(() => {
      expect(handleHideQuickbooksModal).toBeCalled();
    });
  });
});
