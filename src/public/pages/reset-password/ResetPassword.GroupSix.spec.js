import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserContext } from "../../../contexts/UserContext";
import { BrowserRouter } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import { Auth } from "aws-amplify";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    user_id: "abc",
    verifyCode: "123",
  }),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

jest.mock("aws-amplify", () => ({
  ...jest.requireActual("aws-amplify"),
  Auth: {
    ...jest.requireActual("aws-amplify").Auth,
    forgotPasswordSubmit: jest
      .fn()
      .mockImplementation(() => Promise.resolve({})),
  },
}));

describe("ResetPassword", () => {
  it("should render the reset password form", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ logoutUser: jest.fn() }}>
          <ResetPassword />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(
      screen.getByText("Please enter your new password below")
    ).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("reset-password-btn")).toBeInTheDocument();
  });

  it("should show error message when password is not provided", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ logoutUser: jest.fn() }}>
          <ResetPassword />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("reset-password-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("password-error")).toHaveTextContent(
        "Password is required"
      );
    });
  });

  it("should show error message when password is less than 8 characters", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ logoutUser: jest.fn() }}>
          <ResetPassword />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "1234567" },
    });
    fireEvent.click(screen.getByTestId("reset-password-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("password-error")).toHaveTextContent(
        "Password must be at least 8 characters long"
      );
    });
  });

  it("should call forgotPasswordSubmit and logoutUser when form is submitted successfully", async () => {
    Auth.forgotPasswordSubmit.mockImplementation(() => Promise.resolve({}));

    const logoutUser = jest.fn();

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ logoutUser: logoutUser }}>
          <ResetPassword />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("reset-password-btn"));

    await waitFor(() => {
      expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith(
        "abc",
        "123",
        "password123"
      );
    });

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
    });
  });

  it("should handle error and navigate to forget-password page when form submission fails", async () => {
    Auth.forgotPasswordSubmit.mockRejectedValueOnce(
      new Error({
        message: "Invalid password format",
      })
    );

    const logoutUser = jest.fn();

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ logoutUser: logoutUser }}>
          <ResetPassword />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("reset-password-btn"));

    await waitFor(() => {
      expect(Auth.forgotPasswordSubmit).toHaveBeenCalledWith(
        "abc",
        "123",
        "password123"
      );
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/forget-password");
    });
  });
});
