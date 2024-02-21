import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OutstandingConfirmChange from "./OutstandingConfirmChange";

describe("Outstanding Confirm Change", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the showConfirmModal flag = true", async () => {
    const handleHideChangeModal = jest.fn();
    const callAPI = jest.fn();

    render(
      <BrowserRouter>
        <OutstandingConfirmChange
          showConfirmModal={true}
          callAPILoading={false}
          callAPI={callAPI}
          typeSelected="fixed"
          handleHideChangeModal={handleHideChangeModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("outStanding_confirm_modal")
      ).toBeInTheDocument();
    });
  });

  it("if the typeSelected = fixed , the right content should appear", async () => {
    const handleHideChangeModal = jest.fn();
    const callAPI = jest.fn();

    render(
      <BrowserRouter>
        <OutstandingConfirmChange
          showConfirmModal={true}
          callAPILoading={false}
          callAPI={callAPI}
          typeSelected="fixed"
          handleHideChangeModal={handleHideChangeModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("outStanding_confirm_modal")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("confirm__modal__title").textContent).toBe(
        `Are you sure you want to change to fixed shares`
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("confirm__modal__subtitle").textContent).toBe(
        `This is a warning message that if you press save all the variable amounts  will be changed to a fixed amount `
      );
    });
  });

  it("if the typeSelected = variable , the right content should appear", async () => {
    const handleHideChangeModal = jest.fn();
    const callAPI = jest.fn();

    render(
      <BrowserRouter>
        <OutstandingConfirmChange
          showConfirmModal={true}
          callAPILoading={false}
          callAPI={callAPI}
          typeSelected="variable"
          handleHideChangeModal={handleHideChangeModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("outStanding_confirm_modal")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("confirm__modal__title").textContent).toBe(
        `Are you sure you want to change to variable shares`
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("confirm__modal__subtitle").textContent).toBe(
        `This is a warning message that if you press save the fixed amount  will be changed to variable amounts `
      );
    });
  });

  it("when click on confirm button , callAPI should be called", async () => {
    const handleHideChangeModal = jest.fn();
    const callAPI = jest.fn();

    render(
      <BrowserRouter>
        <OutstandingConfirmChange
          showConfirmModal={true}
          callAPILoading={false}
          callAPI={callAPI}
          typeSelected="variable"
          handleHideChangeModal={handleHideChangeModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("outStanding_confirm_modal")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm__modal__btn"));
    await waitFor(() => {
      expect(callAPI).toBeCalled();
    });
  });
  it("when click on close button , handleHideChangeModal should be called", async () => {
    const handleHideChangeModal = jest.fn();
    const callAPI = jest.fn();

    render(
      <BrowserRouter>
        <OutstandingConfirmChange
          showConfirmModal={true}
          callAPILoading={false}
          callAPI={callAPI}
          typeSelected="variable"
          handleHideChangeModal={handleHideChangeModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("outStanding_confirm_modal")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("cancel__modal__btn"));
    await waitFor(() => {
      expect(handleHideChangeModal).toBeCalled();
    });
  });
});
