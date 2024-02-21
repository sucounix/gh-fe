import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "./RegisterForm";
import { BrowserRouter } from "react-router-dom";

describe("RegisterForm", () => {
  it("renders the form inputs correctly", async () => {
    render(
      <BrowserRouter>
        <RegisterForm
          form={{
            getInputProps: jest.fn(),
            errors: {},
          }}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("email_input")).toBeInTheDocument();
    });

    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("userAgreement_input")).toBeInTheDocument();
    expect(screen.getByTestId("submit_btn")).toBeInTheDocument();
  });

  it("displays an error message when email input is invalid", () => {
    const form = {
      getInputProps: jest.fn().mockReturnValue({
        required: true,
        error: "Invalid email",
      }),
      errors: { email: "Invalid email" },
    };

    render(
      <BrowserRouter>
        <RegisterForm form={form} />
      </BrowserRouter>
    );

    expect(screen.getByTestId("email_input_error")).toBeInTheDocument();
    expect(screen.queryAllByText("Invalid email")).toHaveLength(4);
  });

  it("displays a suggestion when email input is valid and showAlreadyExists is false", () => {
    const form = {
      getInputProps: jest.fn().mockReturnValue({
        required: true,
      }),
      errors: {},
    };
    const showAlreadyExists = false;

    render(
      <BrowserRouter>
        <RegisterForm form={form} showAlreadyExists={showAlreadyExists} />
      </BrowserRouter>
    );

    expect(
      screen.getByText("We suggest using the email address you use at work.")
    ).toBeInTheDocument();
  });

  it("displays an error message when showAlreadyExists is true", () => {
    const form = {
      getInputProps: jest.fn().mockReturnValue({
        required: true,
      }),
      errors: {},
    };
    const showAlreadyExists = true;

    render(
      <BrowserRouter>
        <RegisterForm form={form} showAlreadyExists={showAlreadyExists} />
      </BrowserRouter>
    );

    expect(screen.getByTestId("already-associated")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("displays a description for the password input", () => {
    const form = {
      getInputProps: jest.fn().mockReturnValue({
        required: true,
      }),
      errors: {},
    };

    render(
      <BrowserRouter>
        <RegisterForm form={form} />
      </BrowserRouter>
    );

    expect(
      screen.getByText("The Password should be at least 8 characters long.")
    ).toBeInTheDocument();
  });

  it("calls setShowToS when Terms of service link is clicked", async () => {
    const form = {
      getInputProps: jest.fn().mockReturnValue({
        type: "checkbox",
      }),
      errors: {},
    };
    const setShowToS = jest.fn();

    render(
      <BrowserRouter>
        <RegisterForm form={form} setShowToS={setShowToS} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("tos_btn"));

    await waitFor(() => {
      expect(screen.getByTestId("tos_modal")).toBeInTheDocument();
    });
  });

  it("calls setShowPP when Privacy policy link is clicked", async () => {
    const form = {
      getInputProps: jest.fn().mockReturnValue({
        type: "checkbox",
      }),
      errors: {},
    };
    const setShowPP = jest.fn();

    render(<RegisterForm form={form} setShowPP={setShowPP} />);

    fireEvent.click(screen.getByTestId("pp_btn"));

    await waitFor(() => {
      expect(screen.getByTestId("pp_modal")).toBeInTheDocument();
    });
  });
});
