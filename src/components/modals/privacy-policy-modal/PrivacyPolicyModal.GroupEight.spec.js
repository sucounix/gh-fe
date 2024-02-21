import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

describe("Privacy Policy Modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the showPP flag = true", async () => {
    const handleHidePrivacyPolicy = jest.fn();
    render(
      <BrowserRouter>
        <PrivacyPolicyModal
          showPP={true}
          handleHidePrivacyPolicy={handleHidePrivacyPolicy}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("privacy_policy_modal")).toBeInTheDocument();
    });
  });
  it("when click on close button , the handle privacy policy hide should be called", async () => {
    const handleHidePrivacyPolicy = jest.fn();
    render(
      <BrowserRouter>
        <PrivacyPolicyModal
          showPP={true}
          handleHidePrivacyPolicy={handleHidePrivacyPolicy}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("privacy_policy_modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close_popup"));
    await waitFor(() => {
      expect(handleHidePrivacyPolicy).toBeCalled();
    });
  });
});
