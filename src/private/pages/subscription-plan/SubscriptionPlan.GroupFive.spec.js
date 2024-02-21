import React from "react";
import { BrowserRouter } from "react-router-dom";
import SubscriptionPlan from "./SubscriptionPlan";
import { fireEvent, render, screen } from "@testing-library/react";
import { UserContext } from "../../../contexts/UserContext";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
import { initSubsbaseIntegration } from "./InitSubsbaseIntegration";
jest.mock("axios");

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

jest.mock("./InitSubsbaseIntegration", () => ({
  initSubsbaseIntegration: jest.fn(),
}));

describe("Subscription plan", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => jest.clearAllMocks());

  it("if the subscriptionInfo object != null , should redirect to the home page", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: {
                plan: {
                  planCode: "starter",
                  name: "starter",
                },
              },
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
  });

  it("if the subscriptionInfo object = null , should render the plans", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
  });

  it("if the toggle is monthly , should render the report kit monthly card", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
    expect(screen.getByTestId("report-plan-btn-monthly")).toBeInTheDocument();
  });

  it("if the user change the toggle to yearly , should render the report kit yearly card", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("yearly_option"));
    expect(screen.getByTestId("report-plan-btn-yearly")).toBeInTheDocument();
  });

  it("if the toggle is monthly , should render the astra kit monthly card", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
    expect(screen.getByTestId("astra-plan-btn-monthly")).toBeInTheDocument();
  });

  it("if the user change the toggle to yearly , should render the astra kit yearly card", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("yearly_option"));
    expect(screen.getByTestId("astra-plan-btn-yearly")).toBeInTheDocument();
  });

  it("when click on the get started button in starter plan , the initSubsbaseIntegration method should be called", async () => {
    jest.useFakeTimers();
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
    jest.runAllTimers();

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("starter-plan-btn"));
    expect(initSubsbaseIntegration).toBeCalled();
  });

  it("when click on the get started button in report kit plan (monthly), the initSubsbaseIntegration method should be called", async () => {
    jest.useFakeTimers();
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
    jest.runAllTimers();

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("report-plan-btn-monthly"));
    expect(initSubsbaseIntegration).toBeCalled();
  });

  it("when click on the get started button in report kit plan (yearly), the initSubsbaseIntegration method should be called", async () => {
    jest.useFakeTimers();
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
    jest.runAllTimers();

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("yearly_option"));
    fireEvent.click(screen.getByTestId("report-plan-btn-yearly"));
    expect(initSubsbaseIntegration).toBeCalled();
  });

  it("when click on the get started button in astra kit plan (monthly), the initSubsbaseIntegration method should be called", async () => {
    jest.useFakeTimers();
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
    jest.runAllTimers();

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("astra-plan-btn-monthly"));
    expect(initSubsbaseIntegration).toBeCalled();
  });

  it("when click on the get started button in astra kit plan (yearly), the initSubsbaseIntegration method should be called", async () => {
    jest.useFakeTimers();
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: {
              uuid: "123",
              name: "test name",
              email: "testemail@gmail.com",
            },
          }}
        >
          <SubscriptionContext.Provider
            value={{
              fetchSubscriptionInfo: jest.fn(),
              subscriptionInfo: null,
            }}
          >
            <SubscriptionPlan />
          </SubscriptionContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
    jest.runAllTimers();

    expect(screen.getByTestId("subscription__plan__view")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("yearly_option"));
    fireEvent.click(screen.getByTestId("astra-plan-btn-yearly"));
    expect(initSubsbaseIntegration).toBeCalled();
  });
});
