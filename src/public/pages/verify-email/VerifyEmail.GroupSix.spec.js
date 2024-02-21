import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, useParams } from "react-router-dom";
import { Auth } from "aws-amplify";
import VerifyEmail from "./VerifyEmail";

jest.mock("aws-amplify", () => ({
  ...jest.requireActual("aws-amplify"),
  Auth: {
    ...jest.requireActual("aws-amplify").Auth,
    confirmSignUp: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    user_name: "testuser",
    verifyCode: "123456",
    email: "test@example.com",
  }),
}));

describe("VerifyEmail", () => {
  it("should render loading spinner while confirming sign up", async () => {
    Auth.confirmSignUp.mockResolvedValueOnce();

    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );

    expect(screen.getByAltText("loading")).toBeInTheDocument();
  });

  it("should render success verification component when code is verified successfully", async () => {
    Auth.confirmSignUp.mockResolvedValueOnce();

    render(
      <BrowserRouter>
        <VerifyEmail />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(Auth.confirmSignUp).toHaveBeenCalledWith("testuser", "123456");
    });

    await waitFor(() => {
      expect(
        screen.getByText("Your email verification done successfully")
      ).toBeInTheDocument();
    });
  });

  it("should render fail verification component when code verification fails", async () => {
    Auth.confirmSignUp.mockRejectedValueOnce({});

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(Auth.confirmSignUp).toHaveBeenCalledWith("testuser", "123456");
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Your email verification done successfully")
      ).not.toBeInTheDocument();
    });
  });
});
