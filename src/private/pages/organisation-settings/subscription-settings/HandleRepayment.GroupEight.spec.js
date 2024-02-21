import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AxiosMock from "axios";
import HandleRepayment from "./HandleRepayment";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");

const mockedUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("HandleRepayment", () => {
  const mockSubscriptionInfo = {
    status: "activating",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch invalid invoices iframe and render it", async () => {
    const mockInvoiceCheckoutUrl = "https://example.com/invoice";
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        invoiceStatus: "",
        invoiceCheckoutUrl: mockInvoiceCheckoutUrl,
      },
    });

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ subscriptionInfo: mockSubscriptionInfo }}
        >
          <HandleRepayment />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        "/subscription/subscriptions/event"
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("repayment-iframe")).toHaveAttribute(
        "src",
        mockInvoiceCheckoutUrl
      );
    });
  });

  it("should navigate to home page if subscription status is not activating", async () => {
    const mockInvoiceCheckoutUrl = "https://example.com/invoice";

    AxiosMock.get.mockResolvedValueOnce({
      data: {
        invoiceStatus: "",
        invoiceCheckoutUrl: null,
      },
    });

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ subscriptionInfo: { status: "" } }}
        >
          <HandleRepayment />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should navigate to subscription settings page if fetching invalid invoices fails", async () => {
    AxiosMock.get.mockRejectedValueOnce(
      new Error("Failed to fetch invalid invoices")
    );

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ subscriptionInfo: mockSubscriptionInfo }}
        >
          <HandleRepayment />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        "/subscription/subscriptions/event"
      );
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        "/organisation-settings/subscription-settings"
      );
    });
  });
});
