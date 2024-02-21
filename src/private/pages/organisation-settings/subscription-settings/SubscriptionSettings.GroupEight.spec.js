import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SubscriptionSettings from "./SubscriptionSettings";
import AxiosMock from "axios";
import { UserContext } from "../../../../contexts/UserContext";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";

jest.mock("axios");
const dummyUser = {
  uuid: "2e21a0b4-ad86-4947-81fc-bfbddcdf4bc8",
  email: "userTest@gmail.com",
  register_type: "social",
  name: "user test",
  phone_number: null,
  role: null,
};

describe("Subscription settings page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when render the page , should fetch the subscription token first , then render the UI", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: { customerToken: "testToken_123" },
    });

    render(
      <SubscriptionContext.Provider
        value={{
          fetchSubscriptionInfo: jest.fn(),
          subscriptionInfo: {
            planCode: "starter",
            pricingModal: "Free",
            status: "active",
          },
        }}
      >
        <UserContext.Provider
          value={{
            user: dummyUser,
          }}
        >
          <SubscriptionSettings />
        </UserContext.Provider>
      </SubscriptionContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        "/subscription/subscriptions/token"
      );
    });

    await waitFor(() => {
      const subscription__settings = screen.getByTestId(
        "subscription__settings_iframe"
      );
      expect(subscription__settings).toBeInTheDocument();
    });
  });

  it("when the component is unmounted , the fetchSubscriptionInfo method should be called ", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: { customerToken: "testToken_123" },
    });

    const fetchSubscriptionInfo = jest.fn();

    const { unmount } = render(
      <SubscriptionContext.Provider
        value={{
          fetchSubscriptionInfo: fetchSubscriptionInfo,
          subscriptionInfo: {
            planCode: "starter",
            pricingModal: "Free",
            status: "active",
          },
        }}
      >
        <UserContext.Provider
          value={{
            user: dummyUser,
          }}
        >
          <SubscriptionSettings />
        </UserContext.Provider>
      </SubscriptionContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        "/subscription/subscriptions/token"
      );
    });

    await waitFor(() => {
      const subscription__settings = screen.getByTestId(
        "subscription__settings_iframe"
      );
      expect(subscription__settings).toBeInTheDocument();
    });
    unmount();

    await waitFor(() => {
      expect(fetchSubscriptionInfo).toBeCalled();
    });
  });

  it("If the subscription was activating , should fetch subscription info and  invalid invoice iframe first , then render the UI", async () => {
    jest.useFakeTimers();

    AxiosMock.all.mockResolvedValueOnce([
      {
        data: {
          planCode: "starter",
          pricingModal: "Free",
          status: "activating",
        },
      },
      {
        data: {
          id: "a1ddd93b-44fc-4e6c-89f6-3803c760fcc7",
          invoiceCheckoutUrl:
            "https://subscribe.subsbase.io/femto-test/invoice/a1ddd93b-44fc-4e6c-89f6-3803c760fcc7",
          invoiceStatus: "Open",
        },
      },
    ]);

    render(
      <SubscriptionContext.Provider
        value={{
          fetchSubscriptionInfo: jest.fn(),
          subscriptionInfo: {
            planCode: "starter",
            pricingModal: "Free",
            status: "activating",
          },
        }}
      >
        <UserContext.Provider
          value={{
            user: dummyUser,
          }}
        >
          <SubscriptionSettings />
        </UserContext.Provider>
      </SubscriptionContext.Provider>
    );
    jest.runAllTimers();

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith("/subscription/subscriptions");
    });
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        "/subscription/subscriptions/event"
      );
    });
    await waitFor(() => {
      const repayment_iframe = screen.getByTestId("repayment_iframe");
      expect(repayment_iframe).toBeInTheDocument();
    });
  });
});
