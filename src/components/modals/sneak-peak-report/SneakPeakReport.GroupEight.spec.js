import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SneakPeakReport from "./SneakPeakReport";

describe("Sneak peak report modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should rendered", async () => {
    const handleHideSneakPeakModal = jest.fn();
    render(
      <BrowserRouter>
        <SneakPeakReport
          name={"test report 1"}
          image={""}
          handleHideSneakPeakModal={handleHideSneakPeakModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("sneak-peak-report")).toBeInTheDocument();
    });
  });
  it("when click on back button , the handleHideSneakPeakModal should be called", async () => {
    const handleHideSneakPeakModal = jest.fn();
    render(
      <BrowserRouter>
        <SneakPeakReport
          name={"test report 1"}
          image={""}
          handleHideSneakPeakModal={handleHideSneakPeakModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("sneak-peak-report")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close-sneak-peak-modal"));
    await waitFor(() => {
      expect(handleHideSneakPeakModal).toHaveBeenCalled();
    });
  });
});
