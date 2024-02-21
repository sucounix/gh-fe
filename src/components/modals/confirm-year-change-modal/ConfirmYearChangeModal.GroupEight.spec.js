import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ConfirmYearChangeModal from "./ConfirmYearChangeModal";

describe("Confirm Year Change modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the confirmYearChange flag = true", async () => {
    const handleChangeYearModalHide = jest.fn();
    const setSelectedYear = jest.fn();

    render(
      <BrowserRouter>
        <ConfirmYearChangeModal
          confirmYearChange={true}
          error={null}
          setSelectedYear={setSelectedYear}
          handleChangeYearModalHide={handleChangeYearModalHide}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("confirm-year-change-modal")
      ).toBeInTheDocument();
    });
  });

  it("when click on close button, the handleChangeYearModalHide should be called", async () => {
    const handleChangeYearModalHide = jest.fn();
    const setSelectedYear = jest.fn();

    render(
      <BrowserRouter>
        <ConfirmYearChangeModal
          confirmYearChange={true}
          error={null}
          setSelectedYear={setSelectedYear}
          handleChangeYearModalHide={handleChangeYearModalHide}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("confirm-year-change-modal")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close_popup"));
    await waitFor(() => {
      expect(handleChangeYearModalHide).toBeCalled();
    });
  });

  it("when click on confirm button, the handleChangeYearModalHide should be called", async () => {
    const handleChangeYearModalHide = jest.fn();
    const setSelectedYear = jest.fn();
    render(
      <BrowserRouter>
        <ConfirmYearChangeModal
          confirmYearChange={true}
          error={null}
          setSelectedYear={setSelectedYear}
          handleChangeYearModalHide={handleChangeYearModalHide}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("confirm-year-change-modal")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm_btn"));
    await waitFor(() => {
      expect(setSelectedYear).toBeCalled();
    });
  });
});
