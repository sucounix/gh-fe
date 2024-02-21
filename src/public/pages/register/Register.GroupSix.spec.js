import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import Register from "./index";
import ENFile from "./locales/en.json";

jest.mock("aws-amplify", () => ({
  ...jest.requireActual("aws-amplify"),
  Auth: {
    ...jest.requireActual("aws-amplify").Auth,
    signUp: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
}));

describe("Register", () => {
  it("should render the registration form", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const registerForm = screen.getByTestId("register_form");
    expect(registerForm).toBeInTheDocument();
  });

  it("should show error messages when form fields are invalid", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const registerForm = screen.getByTestId("register_form");

    fireEvent.submit(registerForm);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Please agree to the privacy policy and user agreement"
        )
      ).toBeInTheDocument();
    });
  });

  it("should show error message when name contains special characters", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const registerForm = screen.getByTestId("register_form");

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "John@Doe" },
    });
    fireEvent.submit(registerForm);

    await waitFor(() => {
      expect(
        screen.getByText("Name must not contain special characters")
      ).toBeInTheDocument();
    });
  });

  it("should show error message when name is less than 3 characters", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const registerForm = screen.getByTestId("register_form");

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "Jo" },
    });
    fireEvent.submit(registerForm);

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 3 characters")
      ).toBeInTheDocument();
    });
  });

  it("should show error message when name contains numbers", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const registerForm = screen.getByTestId("register_form");

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "John123" },
    });
    fireEvent.submit(registerForm);

    await waitFor(() => {
      expect(
        screen.getByText("Name must not contain numbers")
      ).toBeInTheDocument();
    });
  });

  it("should show error message when email is invalid", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const registerForm = screen.getByTestId("register_form");

    fireEvent.change(screen.getByTestId("email_input"), {
      target: { value: "invalid-email" },
    });
    fireEvent.submit(registerForm);

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("should show error message when password is less than 8 characters", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const registerForm = screen.getByTestId("register_form");

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "pass" },
    });
    fireEvent.submit(registerForm);

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
    });
  });

  it("should show error message when password is the same as name", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const registerForm = screen.getByTestId("register_form");

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "John" },
    });
    fireEvent.submit(registerForm);

    await waitFor(() => {
      expect(screen.getByTestId("password-error")).toBeInTheDocument();
    });
  });

  it("should call Auth.signUp when form is submitted with valid data", async () => {
    Auth.signUp.mockImplementation(() =>
      Promise.resolve({
        user: {
          username: "'John Doe'",
          attributes: {
            email: "john@example.com",
            name: "John Doe",
            "custom:is_terms_accepted": "true",
          },
        },
      })
    );

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const registerForm = screen.getByTestId("register_form");

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("email_input"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("userAgreement_input"));
    fireEvent.submit(registerForm);

    await waitFor(() => {
      expect(Auth.signUp).toHaveBeenCalledWith({
        username: "john@example.com",
        password: "password123",
        attributes: {
          email: "john@example.com",
          name: "John Doe",
          "custom:is_terms_accepted": "true",
        },
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "we’ve sent you a verification link, please check your email inbox and click on the link to verify your account."
        )
      ).toBeInTheDocument();
    });
  });

  it("should show error message when email already exists", async () => {
    Auth.signUp.mockImplementation(() =>
      Promise.reject({
        message: ENFile.alreadyExistMessage,
      })
    );

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "John Doe" },
    });

    fireEvent.change(screen.getByTestId("email_input"), {
      target: {
        value: "john@example.com",
      },
    });

    fireEvent.change(screen.getByTestId("password-input"), {
      target: {
        value: "password123password",
      },
    });

    fireEvent.click(screen.getByTestId("userAgreement_input"));

    fireEvent.click(screen.getByTestId("submit_btn"));

    await waitFor(() => {
      expect(Auth.signUp).toHaveBeenCalledWith({
        username: "john@example.com",
        password: "password123password",
        attributes: {
          email: "john@example.com",
          name: "John Doe",
          "custom:is_terms_accepted": "true",
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("already-associated")).toBeInTheDocument();
    });
  });
});
