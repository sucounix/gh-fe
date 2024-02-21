import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AuthFooter from "./AuthFooter";

describe("Auth Footer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("it should be rendered.", async () => {
    render(
      <BrowserRouter>
        <AuthFooter />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("auth__footer")).toBeInTheDocument();
    });
  });

  it("when click on contact us button , the popup should be rendered.", async () => {
    render(
      <BrowserRouter>
        <AuthFooter />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("contact_us_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("contact_us_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("contact__modal")).toBeInTheDocument();
    });
  });

  it("when click on Terms button , the popup should be rendered.", async () => {
    render(
      <BrowserRouter>
        <AuthFooter />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("terms_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("terms_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("tos_modal")).toBeInTheDocument();
    });
  });

  it("when click on Privacy button , the popup should be rendered.", async () => {
    render(
      <BrowserRouter>
        <AuthFooter />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("privacy_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("privacy_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("privacy_policy_modal")).toBeInTheDocument();
    });
  });

  it("when click on Privacy close button , the popup should be rendered.", async () => {
    render(
      <BrowserRouter>
        <AuthFooter />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("privacy_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("privacy_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("pp_modal")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("close_popup")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close_popup"));
    await waitFor(() => {
      expect(screen.queryByTestId("pp_modal")).not.toBeInTheDocument();
    });
  });

  it("when click on Terms close button , the popup should be rendered.", async () => {
    render(
      <BrowserRouter>
        <AuthFooter />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("terms_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("terms_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("tos_modal")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("close_popup")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close_popup"));
    await waitFor(() => {
      expect(screen.queryByTestId("tos_modal")).not.toBeInTheDocument();
    });
  });

  it("when click on contact us close button , the popup should be rendered.", async () => {
    render(
      <BrowserRouter>
        <AuthFooter />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("contact_us_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("contact_us_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("contact__modal_content")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("close_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close_btn"));
    await waitFor(() => {
      expect(
        screen.queryByTestId("contact__modal_content")
      ).not.toBeInTheDocument();
    });
  });
});
