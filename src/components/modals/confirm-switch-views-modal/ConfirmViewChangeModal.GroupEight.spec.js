import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ConfirmViewChangeModal from "./ConfirmViewChangeModal";

describe("Confirm View Change modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the confirmChangeShow flag = true", async () => {
    const handleHideChangeViewModal = jest.fn();
    const handleSubmit = jest.fn();

    render(
      <BrowserRouter>
        <ConfirmViewChangeModal
          confirmChangeShow={true}
          submitLoading={false}
          type={"variable"}
          handleSubmit={handleSubmit}
          form={{ values: {} }}
          item="alerts"
          handleHideChangeViewModal={handleHideChangeViewModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("sure-change-modal")).toBeInTheDocument();
    });
  });

  it("when click on confirm button, the handleSubmit should be called", async () => {
    const handleHideChangeViewModal = jest.fn();
    const handleSubmit = jest.fn();

    render(
      <BrowserRouter>
        <ConfirmViewChangeModal
          confirmChangeShow={true}
          submitLoading={false}
          type={"variable"}
          handleSubmit={handleSubmit}
          form={{ values: {} }}
          item="alerts"
          handleHideChangeViewModal={handleHideChangeViewModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("sure-change-modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("switch_view_confirm_btn"));
    await waitFor(() => {
      expect(handleSubmit).toBeCalled();
    });
  });

  it("when click on close button, the handleHideChangeViewModal should be called", async () => {
    const handleHideChangeViewModal = jest.fn();
    const handleSubmit = jest.fn();

    render(
      <BrowserRouter>
        <ConfirmViewChangeModal
          confirmChangeShow={true}
          submitLoading={false}
          type={"variable"}
          handleSubmit={handleSubmit}
          form={{ values: {} }}
          item="alerts"
          handleHideChangeViewModal={handleHideChangeViewModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("sure-change-modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close_popup"));
    await waitFor(() => {
      expect(handleHideChangeViewModal).toHaveBeenCalled();
    });
  });

  it("If the type = variable , the right contnet should appear", async () => {
    const handleHideChangeViewModal = jest.fn();
    const handleSubmit = jest.fn();

    render(
      <BrowserRouter>
        <ConfirmViewChangeModal
          confirmChangeShow={true}
          submitLoading={false}
          type={"variable"}
          handleSubmit={handleSubmit}
          form={{ values: {} }}
          item="alerts"
          handleHideChangeViewModal={handleHideChangeViewModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("sure-change-modal")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("confirm__view__modal__title").textContent
      ).toBe("Are you want to change to variable  alerts");
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("confirm__view__modal__subtitle").textContent
      ).toBe(
        "This is a warning message that if you press save all the fixed amount will be changed to a variable  amount "
      );
    });
  });

  it("If the type = fixed , the right contnet should appear", async () => {
    const handleHideChangeViewModal = jest.fn();
    const handleSubmit = jest.fn();

    render(
      <BrowserRouter>
        <ConfirmViewChangeModal
          confirmChangeShow={true}
          submitLoading={false}
          type={"fixed"}
          handleSubmit={handleSubmit}
          form={{ values: {} }}
          item="alerts"
          handleHideChangeViewModal={handleHideChangeViewModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("sure-change-modal")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("confirm__view__modal__title").textContent
      ).toBe("Are you want to change to fixed  alerts");
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("confirm__view__modal__subtitle").textContent
      ).toBe(
        "This is a warning message that if you press save all the variable amount will be changed to a fixed  amount "
      );
    });
  });
});
