import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TOSModal from "./TOSModal";

describe("TOS modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the showToS flag = true", async () => {
    const handleHideTOSModal = jest.fn();
    render(
      <BrowserRouter>
        <TOSModal showToS={true} handleHideTOSModal={handleHideTOSModal} />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("tos_modal")).toBeInTheDocument();
    });
  });

  it("when click on close button , the handleHideTOSModal should be called", async () => {
    const handleHideTOSModal = jest.fn();
    render(
      <BrowserRouter>
        <TOSModal showToS={true} handleHideTOSModal={handleHideTOSModal} />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("tos_modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close_popup"));

    await waitFor(() => {
      expect(handleHideTOSModal).toBeCalled();
    });
  });
});
