import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TOSModalConfirm from "./TOSModalConfirm";
import AxiosMock from "axios";

jest.mock("axios");

describe("TOS confirm modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the showToS flag = true", async () => {
    const handleHideTOSModal = jest.fn();
    render(
      <BrowserRouter>
        <TOSModalConfirm
          showToS={true}
          handleHideTOSModal={handleHideTOSModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("tos_modal_confirm")).toBeInTheDocument();
    });
  });

  it("will send the update request after check the TOS", async () => {
    const handleHideTOSModal = jest.fn();
    AxiosMock.patch.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <TOSModalConfirm
          showToS={true}
          handleHideTOSModal={handleHideTOSModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("tos_modal_confirm")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("read_TOS"));
    fireEvent.click(screen.getByTestId("agree_TOS_btn"));

    await waitFor(() => {
      expect(AxiosMock.patch).toHaveBeenCalledWith(`/auth/user/`, {
        is_terms_accepted: true,
      });
    });
  });
  it("can't click on done without check the TOS", async () => {
    const handleHideTOSModal = jest.fn();
    AxiosMock.patch.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <TOSModalConfirm
          showToS={true}
          handleHideTOSModal={handleHideTOSModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("tos_modal_confirm")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("agree_TOS_btn"));

    await waitFor(() => {
      expect(AxiosMock.patch).not.toHaveBeenCalledWith(`/auth/user/`, {
        is_terms_accepted: true,
      });
    });
    fireEvent.click(screen.getByTestId("read_TOS"));

    fireEvent.click(screen.getByTestId("agree_TOS_btn"));

    await waitFor(() => {
      expect(AxiosMock.patch).toHaveBeenCalledWith(`/auth/user/`, {
        is_terms_accepted: true,
      });
    });
  });
});
