import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import Login from "./index";
import { Auth } from "aws-amplify";
const mockedUsedNavigate = jest.fn();

jest.mock("aws-amplify", () => ({
  ...jest.requireActual("aws-amplify"),
  Auth: {
    ...jest.requireActual("aws-amplify").Auth,
    signIn: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("should render the login page correctly", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ fetchUser: jest.fn() }}>
          <Login />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("should display an error message if email is not provided", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ fetchUser: jest.fn() }}>
          <Login />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("submit__btn__login"));
    await waitFor(() => {
      expect(screen.getByTestId("email_input_error")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId("wrong__credentials")
      ).not.toBeInTheDocument();
    });
  });

  it("should display an error message if password is not provided", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ fetchUser: jest.fn() }}>
          <Login />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email_input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("submit__btn__login"));

    await waitFor(() => {
      expect(screen.getByTestId("password-error")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId("wrong__credentials")
      ).not.toBeInTheDocument();
    });
  });

  it("should submit the form if email and password are provided", async () => {
    Auth.signIn.mockImplementation(() =>
      Promise.resolve({
        signInUserSession: {
          idToken: {
            jwtToken: "123456",
          },
        },
      })
    );

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ fetchUser: jest.fn() }}>
          <Login />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email_input"), {
      target: {
        value: "test@email.com",
      },
    });

    fireEvent.change(screen.getByTestId("password_input"), {
      target: {
        value: "password",
      },
    });

    fireEvent.click(screen.getByTestId("submit__btn__login"));

    await waitFor(() => {
      expect(screen.queryByTestId("email_input_error")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(Auth.signIn).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
    });
  });
});
