import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WaitingConfirmEmail from "./WaitingConfirmEmail";
import { Auth } from "aws-amplify";
import { BrowserRouter } from "react-router-dom";

jest.mock("aws-amplify", () => ({
  Auth: {
    resendSignUp: jest.fn(),
  },
}));

describe("WaitingConfirmEmail", () => {
  const email = "test@example.com";
  const resendCounter = 10;
  const setResendCounter = jest.fn();
  const initCountingDown = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(
      <BrowserRouter>
        <WaitingConfirmEmail
          email={email}
          resendCounter={resendCounter}
          setResendCounter={setResendCounter}
          initCountingDown={initCountingDown}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("Verify your email address")).toBeInTheDocument();
    expect(
      screen.getByText(
        "we’ve sent you a verification link, please check your email inbox and click on the link to verify your account."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Can't find verification link ? Check your spam folder!")
    ).toBeInTheDocument();
    expect(screen.getByTestId("resend-email-btn")).toBeInTheDocument();
  });

  it("displays the resend counter if it is greater than 0", () => {
    render(
      <BrowserRouter>
        <WaitingConfirmEmail
          email={email}
          resendCounter={resendCounter}
          setResendCounter={setResendCounter}
          initCountingDown={initCountingDown}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("Resend in:")).toBeInTheDocument();
    expect(screen.getByText(`${resendCounter} s`)).toBeInTheDocument();
  });

  it("does not display the resend counter if it is 0", () => {
    const resendCounter = 0;

    render(
      <BrowserRouter>
        <WaitingConfirmEmail
          email={email}
          resendCounter={resendCounter}
          setResendCounter={setResendCounter}
          initCountingDown={initCountingDown}
        />
      </BrowserRouter>
    );

    expect(screen.queryByText(`${resendCounter} s`)).toBeNull();
  });

  it("calls the handleResendVerifcation function when the resend button is clicked", async () => {
    Auth.resendSignUp.mockImplementation(() => Promise.resolve());

    render(
      <BrowserRouter>
        <WaitingConfirmEmail
          email={email}
          resendCounter={0}
          setResendCounter={setResendCounter}
          initCountingDown={initCountingDown}
        />
      </BrowserRouter>
    );

    const resendButton = screen.getByTestId("resend-email-btn");
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(Auth.resendSignUp).toHaveBeenCalledTimes(1);
    });

    expect(Auth.resendSignUp).toHaveBeenCalledWith(email);
    expect(setResendCounter).toHaveBeenCalledTimes(1);
    expect(setResendCounter).toHaveBeenCalledWith(30);
    expect(initCountingDown).toHaveBeenCalledTimes(1);
  });
});
