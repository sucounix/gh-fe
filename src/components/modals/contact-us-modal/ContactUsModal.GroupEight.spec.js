import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ContactUsModal from "./ContactUsModal";

describe("Contact us modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the showContactUs flag = true", async () => {
    const handlehideContactUsModal = jest.fn();
    render(
      <BrowserRouter>
        <ContactUsModal
          showContactUs={true}
          handlehideContactUsModal={handlehideContactUsModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("contact__modal")).toBeInTheDocument();
    });
  });

  it("when click on close button , the handlehideContactUsModal should be called", async () => {
    const handlehideContactUsModal = jest.fn();
    render(
      <BrowserRouter>
        <ContactUsModal
          showContactUs={true}
          handlehideContactUsModal={handlehideContactUsModal}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("contact__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close_btn"));

    await waitFor(() => {
      expect(handlehideContactUsModal).toBeCalled();
    });
  });
});
