import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Auth } from "aws-amplify";
import FailVerification from "./index";
import { BrowserRouter } from "react-router-dom";
import ENFile from "./locales/en.json";

jest.mock("aws-amplify", () => ({
  ...jest.requireActual("aws-amplify"),
  Auth: {
    ...jest.requireActual("aws-amplify").Auth,
    resendSignUp: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
}));

describe("FailVerification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  const email = "test@example.com";

  it("should render the component", () => {
    render(
      <BrowserRouter>
        <FailVerification email={email} />
      </BrowserRouter>
    );

    const container = screen.getByTestId("fail-verification-container");
    expect(container).toBeInTheDocument();
  });

  it("should call Auth.resendSignUp when 'Send Again' button is clicked", () => {
    Auth.resendSignUp.mockImplementation(() => Promise.resolve({}));

    render(
      <BrowserRouter>
        <FailVerification email={email} />
      </BrowserRouter>
    );

    const sendAgainBtn = screen.getByTestId("send-again-btn");
    fireEvent.click(sendAgainBtn);

    expect(Auth.resendSignUp).toHaveBeenCalledWith(email);
  });

  it("should show error notification when resendSignUp fails", async () => {
    Auth.resendSignUp.mockImplementation(() => Promise.reject({}));

    render(
      <BrowserRouter>
        <FailVerification email={email} />
      </BrowserRouter>
    );

    const sendAgainBtn = screen.getByTestId("send-again-btn");
    fireEvent.click(sendAgainBtn);

    await waitFor(() => {
      expect(screen.getByText(ENFile.verificationExpired)).toBeInTheDocument();
    });
  });
});
