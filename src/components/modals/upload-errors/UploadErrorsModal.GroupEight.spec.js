import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UploadErrorsModal from "./UploadErrorsModal";
import guidelines from "../../../assets/documents/Financial Upload Guidelines.pdf";

describe("upload Errors modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the show flag = true", async () => {
    const handleHideUploadError = jest.fn();
    const errorList = {
      D3: ["Incorrect time sequence"],
    };
    render(
      <BrowserRouter>
        <UploadErrorsModal
          guidelines={guidelines}
          errors={errorList}
          handleHideUploadError={handleHideUploadError}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("errors__modal")).toBeInTheDocument();
    });
  });

  it("when click on cancel button ,the handleHideUploadError should be called ", async () => {
    const handleHideUploadError = jest.fn();
    const errorList = {
      D3: ["Incorrect time sequence"],
    };
    render(
      <BrowserRouter>
        <UploadErrorsModal
          guidelines={guidelines}
          errors={errorList}
          handleHideUploadError={handleHideUploadError}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("errors__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("cancel_btn"));
    await waitFor(() => {
      expect(handleHideUploadError).toBeCalled();
    });
  });

  it("when click on view guidlines button ,the handleHideUploadError should be called ", async () => {
    const handleHideUploadError = jest.fn();
    const errorList = {
      D3: ["Incorrect time sequence"],
    };
    window.open = jest.fn();

    render(
      <BrowserRouter>
        <UploadErrorsModal
          guidelines={guidelines}
          errors={errorList}
          handleHideUploadError={handleHideUploadError}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("errors__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("view_guidelines_btn"));
    await waitFor(() => {
      expect(window.open).toBeCalled();
    });
  });
});
