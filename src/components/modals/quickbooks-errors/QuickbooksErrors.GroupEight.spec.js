import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QuickbooksErrors } from "./QuickbooksErrors";

describe("Quickbooks Errors", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the showModal flag = true", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={null}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
  });

  it("when click on confirm button, the handleHideQuickbooksErrorModal should be called ", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={null}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(handleHideQuickbooksErrorModal).toBeCalled();
    });
  });

  it("handle company name already exist error", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={{
            detail: "Company with this name already exists.",
          }}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_title").textContent).toBe(
        "Company already exists"
      );
    });
  });

  it("handle company id already exist error", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={{
            detail: "Company with this ID already exists.",
          }}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_title").textContent).toBe(
        "Sorry, This company is already associated with a different account"
      );
    });
  });

  it("handle invalid period error", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={{
            detail: "Invalid period sequence.",
          }}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_title").textContent).toBe(
        "Invalid Period"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_text").textContent).toBe(
        "Sorry, the data period is invalid check it and try again"
      );
    });
  });

  it("handle token error", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={{
            detail: "Can't get tokens.",
          }}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_title").textContent).toBe(
        "Something went wrong"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_text").textContent).toBe(
        "Please check your data and try again "
      );
    });
  });

  it("handle Company has no data error", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={{
            detail: "Company has no data.",
          }}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_title").textContent).toBe(
        "Can't get data for this company"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_text").textContent).toBe(
        "Sorry there’s somthing wrong in company data check and try again"
      );
    });
  });

  it("handle Can't get company data error", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={{
            detail: "Can't get company data.",
          }}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_title").textContent).toBe(
        "Can't get data for this company"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_text").textContent).toBe(
        "Sorry there’s somthing wrong in company data check and try again"
      );
    });
  });

  it("handle Can't get accounts detailed data error", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={{
            detail: "Can't get accounts detailed data.",
          }}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_title").textContent).toBe(
        "Can't get data for this company"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_text").textContent).toBe(
        "Sorry there’s somthing wrong in company data check and try again"
      );
    });
  });

  it("handle default error", async () => {
    const handleHideQuickbooksErrorModal = jest.fn();
    render(
      <BrowserRouter>
        <QuickbooksErrors
          showModal={true}
          error={{
            field: "another error",
          }}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("error_title").textContent).toBe(
        "Something went wrong"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_text").textContent).toBe(
        "Please check your data and try again "
      );
    });
  });
});
