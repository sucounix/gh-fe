import React from "react";
import { BrowserRouter } from "react-router-dom";
import SubscriptionRedirect from "./SubscriptionRedirect";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
jest.mock("axios");

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

const subscriptionInfoActivatingReport = {
  id: "7b713201-3b5f-4eb2-bf30-993934ceae40",
  name: "Test",
  planCode: "Reporting",
  pricingModel: "Paid",
  quantity: 15,
  status: "Activating",
  billingCycleUnit: "Month",
  billingCycleDuration: 1,
};
const subscriptionInfoActiveReport = {
  id: "7b713201-3b5f-4eb2-bf30-993934ceae40",
  name: "Test",
  planCode: "Reporting",
  pricingModel: "Paid",
  quantity: 15,
  status: "Active",
  billingCycleUnit: "Month",
  billingCycleDuration: 1,
};

const subscriptionInfoActiveStarter = {
  id: "7b713201-3b5f-4eb2-bf30-993934ceae40",
  name: "Test",
  planCode: "starter",
  pricingModel: "Free",
  quantity: 1,
  status: "Active",
  billingCycleUnit: "Month",
  billingCycleDuration: 1,
};
jest.useFakeTimers();

describe("subscriptio redirect", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => jest.clearAllMocks());

  it("if the method fetchSubscriptionInfo should be called when render the page", async () => {
    const fetchSubscriptionInfo = jest.fn();
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoActivatingReport,
            fetchSubscriptionInfo,
            REFETCH_SUBSCRIPTION_COUNT: 6,
          }}
        >
          <SubscriptionRedirect />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    expect(fetchSubscriptionInfo).toBeCalled();
  });

  it("if the plan is starter , should redirect to the home page", async () => {
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoActiveStarter,
            fetchSubscriptionInfo: jest.fn(),
            REFETCH_SUBSCRIPTION_COUNT: 6,
          }}
        >
          <SubscriptionRedirect />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(`/`);
    });
  });

  it("if the pricing modal isn't free and status is active , should redirect to the home page after 5 seconds", async () => {
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoActiveReport,
            fetchSubscriptionInfo: jest.fn(),
            REFETCH_SUBSCRIPTION_COUNT: 6,
          }}
        >
          <SubscriptionRedirect />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    jest.runAllTimers();

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(`/`);
    });
  });
  it("if the pricing modal isn't free and status is activating , should redirect to the subscription settings ", async () => {
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoActivatingReport,
            fetchSubscriptionInfo: jest.fn(),
            REFETCH_SUBSCRIPTION_COUNT: -1,
            subscriptionIsLoading: true,
          }}
        >
          <SubscriptionRedirect />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `/organisation-settings/subscription-settings`
      );
    });
  });
});
