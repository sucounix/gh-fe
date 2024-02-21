import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NoAuthHeader from "./NoAuthHeader";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("NoAuthHeader", () => {
  it("renders the logo", () => {
    render(
      <BrowserRouter>
        <NoAuthHeader />
      </BrowserRouter>
    );
    const logo = screen.getByTestId("femto_logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("alt", "femtologo");
  });

  it("navigates to login page when 'Sign in' is clicked", () => {
    render(
      <BrowserRouter>
        <NoAuthHeader />
      </BrowserRouter>
    );
    const signInButton = screen.getByText("Sign in");
    fireEvent.click(signInButton);

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/login");
  });
});
