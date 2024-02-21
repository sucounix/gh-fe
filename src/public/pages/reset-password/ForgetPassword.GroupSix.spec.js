import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Auth } from "aws-amplify";
import ForgetPassword from "./ForgetPassword";
import { BrowserRouter } from "react-router-dom";

jest.mock("aws-amplify", () => ({
  ...jest.requireActual("aws-amplify"),
  Auth: {
    ...jest.requireActual("aws-amplify").Auth,
    forgotPassword: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
}));

describe("ForgetPassword", () => {
  it("should render the email input field", () => {
    render(
      <BrowserRouter>
        <ForgetPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId("email_input");
    expect(emailInput).toBeInTheDocument();
  });

  it("should display an error message if email is not provided", async () => {
    render(
      <BrowserRouter>
        <ForgetPassword />
      </BrowserRouter>
    );

    const resetPasswordBtn = screen.getByTestId("reset-password-btn");

    fireEvent.click(resetPasswordBtn);

    const emailInputError = screen.getByTestId("email_input_error");

    await waitFor(() => {
      expect(emailInputError).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(emailInputError.textContent).toBe("Email is required");
    });
  });

  it("should display an error message if invalid email is provided", async () => {
    render(
      <BrowserRouter>
        <ForgetPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId("email_input");
    const resetPasswordBtn = screen.getByTestId("reset-password-btn");

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(resetPasswordBtn);

    const emailInputError = screen.getByTestId("email_input_error");

    await waitFor(() => {
      expect(emailInputError).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(emailInputError.textContent).toBe("Invalid email address");
    });
  });

  it("should call Auth.forgotPassword when valid email is provided", async () => {
    Auth.forgotPassword.mockImplementation(() => Promise.resolve({}));

    render(
      <BrowserRouter>
        <ForgetPassword />
      </BrowserRouter>
    );
    const emailInput = screen.getByTestId("email_input");
    const resetPasswordBtn = screen.getByTestId("reset-password-btn");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(resetPasswordBtn);

    await waitFor(() => {
      expect(Auth.forgotPassword).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("should display the success message after email is sent successfully", async () => {
    Auth.forgotPassword.mockImplementation(() => Promise.resolve({}));

    render(
      <BrowserRouter>
        <ForgetPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId("email_input");
    const resetPasswordBtn = screen.getByTestId("reset-password-btn");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(resetPasswordBtn);

    await waitFor(() => {
      const emailSentAlert = screen.getByTestId("email_sent_alert");
      expect(emailSentAlert).toBeInTheDocument();
    });
  });

  it("should reset the form and go back to stage 0 when 'Re enter your email address' button is clicked", async () => {
    Auth.forgotPassword.mockImplementation(() => Promise.resolve({}));

    render(
      <BrowserRouter>
        <ForgetPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId("email_input");
    const resetPasswordBtn = screen.getByTestId("reset-password-btn");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(resetPasswordBtn);

    await waitFor(() => {
      expect(screen.getByTestId("re-enter-email-btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("re-enter-email-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("email_input")).toBeInTheDocument();
    });
  });
});
