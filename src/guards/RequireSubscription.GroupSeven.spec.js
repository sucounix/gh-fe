import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Router from "react-router";
import RequireSubscription from "./RequireSubscription";
import { CompaniesContext } from "../contexts/CompaniesContext";
import { SubscriptionContext } from "../contexts/SubscriptionContext";

const mockUsedLocation = jest.fn();
const mockUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"), // use actual for all non-hook parts
  useParams: jest.fn(),
  useLocation: () => mockUsedLocation,
  useNavigate: () => mockUsedNavigate,
  Outlet: () => <div data-testid="outlet_contnet">Outlet</div>,
}));

describe("Require Subscription guard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("if their no subscriptionInfo , then should call fetchSubscriptionInfo method.", async () => {
    const fetchSubscriptionInfo = jest.fn();
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{ companies: [{ uuid: "123", name: "company 1" }] }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: null,
              fetchSubscriptionInfo,
              subscriptionIsLoading: false,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(fetchSubscriptionInfo).toBeCalled();
    });
  });

  it("if their is no id_token then should redirect to login page.", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{ companies: [{ uuid: "123", name: "company 1" }] }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: { planCode: "starter", status: "active" },
              fetchSubscriptionInfo: jest.fn(),
              subscriptionIsLoading: false,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBeNull();
    });
    await waitFor(() => {
      expect(mockUsedNavigate).toBeCalledWith(`/login`, {
        state: { from: mockUsedLocation },
      });
    });
  });

  it("if their is id_token and subscriptionIsLoading=false and subscriptionInfo=null then should redirect to subscription page.", async () => {
    localStorage.setItem("id_token", "test_123");

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{ companies: [{ uuid: "123", name: "company 1" }] }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: null,
              fetchSubscriptionInfo: jest.fn(),
              subscriptionIsLoading: false,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe("test_123");
    });
    await waitFor(() => {
      expect(mockUsedNavigate).toBeCalledWith(`/subscription`, { state: null });
    });
  });

  it("if location.pathname !== subscription-settings and the status=activating then should redirect to subscription settings page.  ", async () => {
    localStorage.setItem("id_token", "test_123");

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{ companies: [{ uuid: "123", name: "company 1" }] }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: { planCode: "starter", status: "activating" },
              fetchSubscriptionInfo: jest.fn(),
              subscriptionIsLoading: false,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe("test_123");
    });

    await waitFor(() => {
      expect(mockUsedNavigate).toBeCalledWith(
        `/organisation-settings/subscription-settings`,
        { state: null }
      );
    });
  });

  it("if location.pathname !== subscription-settings and the status=cancelled then should redirect to subscription settings page.", async () => {
    localStorage.setItem("id_token", "test_123");

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{ companies: [{ uuid: "123", name: "company 1" }] }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: { planCode: "starter", status: "canceled" },
              fetchSubscriptionInfo: jest.fn(),
              subscriptionIsLoading: false,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe("test_123");
    });
    await waitFor(() => {
      expect(mockUsedNavigate).toBeCalledWith(
        `/organisation-settings/subscription-settings`,
        { state: null }
      );
    });
  });

  it("if location.pathname !== subscription-settings and the status=active and the company is not enabled then should redirect to not found page.  ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/test" });
    localStorage.setItem("id_token", "test_123");

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            companies: [{ uuid: "123", name: "company 1", is_enabled: false }],
          }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: { planCode: "starter", status: "active" },
              fetchSubscriptionInfo: jest.fn(),
              subscriptionIsLoading: false,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe("test_123");
    });
    await waitFor(() => {
      expect(mockUsedNavigate).toBeCalledWith("/not-found", { state: null });
    });
  });

  it("if location.pathname !== subscription-settings and the status=active and the company is enabled then should redirect to not found page.  ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/test" });
    localStorage.setItem("id_token", "test_123");

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            companies: [{ uuid: "123", name: "company 1", is_enabled: true }],
          }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: { planCode: "starter", status: "active" },
              fetchSubscriptionInfo: jest.fn(),
              subscriptionIsLoading: false,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe("test_123");
    });

    await waitFor(() => {
      expect(screen.getByTestId("outlet_contnet")).toBeInTheDocument();
    });
  });
  it("if the params doesn't exist then should redirect to not found page.  ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({});
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/test" });
    localStorage.setItem("id_token", "test_123");

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            companies: [{ uuid: "123", name: "company 1", is_enabled: true }],
          }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: { planCode: "starter", status: "active" },
              fetchSubscriptionInfo: jest.fn(),
              subscriptionIsLoading: false,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe("test_123");
    });

    await waitFor(() => {
      expect(screen.getByTestId("outlet_contnet")).toBeInTheDocument();
    });
  });

  it("if the company list is empty then should redirect to not found page.  ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/test" });
    localStorage.setItem("id_token", "test_123");

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            companies: [],
          }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: { planCode: "starter", status: "active" },
              fetchSubscriptionInfo: jest.fn(),
              subscriptionIsLoading: false,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe("test_123");
    });

    await waitFor(() => {
      expect(screen.getByTestId("outlet_contnet")).toBeInTheDocument();
    });
  });

  it("if the subscriptionIsLoading= true  then shouldn't redirect to any page.  ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/test" });
    localStorage.setItem("id_token", "test_123");

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            companies: [{ uuid: "123", name: "company 1", is_enabled: false }],
          }}
        >
          <SubscriptionContext.Provider
            value={{
              subscriptionInfo: { planCode: "starter", status: "active" },
              fetchSubscriptionInfo: jest.fn(),
              subscriptionIsLoading: true,
            }}
          >
            <RequireSubscription />
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe("test_123");
    });
    await waitFor(() => {
      expect(mockUsedNavigate).not.toBeCalled();
    });
  });
});
