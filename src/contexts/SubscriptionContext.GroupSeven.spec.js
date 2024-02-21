import React, { useContext } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  SubscriptionProvider,
  SubscriptionContext,
} from "./SubscriptionContext";
import AxiosMock from "axios";

jest.mock("axios");

const TestingComponent = ({ companyList }) => {
  const {
    subscriptionInfo,
    fetchSubscriptionInfo,
    isAllowedToAddNewCompany,
    canCreateReport,
  } = useContext(SubscriptionContext);

  return (
    <div data-testid="children_component">
      <p data-testid="plan_code">{subscriptionInfo?.planCode}</p>
      <button
        data-testid="fetch_subscription_info"
        onClick={() => {
          fetchSubscriptionInfo();
        }}
      >
        fetch subscription
      </button>

      {isAllowedToAddNewCompany(null, companyList) ? (
        <p data-testid="add_new_company">can add new company</p>
      ) : (
        <p data-testid="cannot_add_new_company">cannot add new company</p>
      )}

      {canCreateReport() ? (
        <p data-testid="create_new_report">can create report</p>
      ) : (
        <p data-testid="cannot_create_new_report">cannot create report</p>
      )}
    </div>
  );
};

describe("Subscription Context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("when fetch subscription, should render plan code.", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        planCode: "starter",
        status: "active",
      },
    });

    render(
      <SubscriptionProvider>
        <TestingComponent companyList={[{ uuid: "123", quantity: 1 }]} />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("fetch_subscription_info")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_subscription_info"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("plan_code").textContent).toBe("starter");
    });
  });

  it("can't add new company if the subscription quntity equal the company list", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        planCode: "starter",
        status: "active",
        quantity: 1,
      },
    });

    render(
      <SubscriptionProvider>
        <TestingComponent companyList={[{ uuid: "123", name: "company 1" }]} />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("fetch_subscription_info")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_subscription_info"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("plan_code")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("plan_code").textContent).toBe("starter");
    });
    await waitFor(() => {
      expect(screen.getByTestId("cannot_add_new_company")).toBeInTheDocument();
    });
  });

  it("can't add new company if the subscription status is paused", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        planCode: "starter",
        status: "paused",
        quantity: 1,
      },
    });

    render(
      <SubscriptionProvider>
        <TestingComponent companyList={[{ uuid: "123", name: "company 1" }]} />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("fetch_subscription_info")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_subscription_info"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("plan_code").textContent).toBe("starter");
    });
    await waitFor(() => {
      expect(screen.getByTestId("cannot_add_new_company")).toBeInTheDocument();
    });
  });

  it("can't add new company if the subscription pricing modal is free and the company list has one company", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        planCode: "starter",
        status: "paused",
        quantity: 1,
        pricingModel: "Free",
      },
    });

    render(
      <SubscriptionProvider>
        <TestingComponent companyList={[{ uuid: "123", name: "company 1" }]} />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("fetch_subscription_info")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_subscription_info"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("plan_code").textContent).toBe("starter");
    });
    await waitFor(() => {
      expect(screen.getByTestId("cannot_add_new_company")).toBeInTheDocument();
    });
  });

  it("can add new company if the subscription status is active", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        planCode: "starter",
        status: "active",
        quantity: 2,
      },
    });

    render(
      <SubscriptionProvider>
        <TestingComponent companyList={[{ uuid: "123", name: "company 1" }]} />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("fetch_subscription_info")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_subscription_info"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("plan_code").textContent).toBe("starter");
    });
    await waitFor(() => {
      expect(screen.getByTestId("add_new_company")).toBeInTheDocument();
    });
  });

  it("can't create report if the subscription pricing modal is free", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        planCode: "starter",
        status: "paused",
        quantity: 1,
        pricingModel: "Free",
      },
    });

    render(
      <SubscriptionProvider>
        <TestingComponent companyList={[{ uuid: "123", name: "company 1" }]} />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("fetch_subscription_info")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_subscription_info"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("plan_code").textContent).toBe("starter");
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("cannot_create_new_report")
      ).toBeInTheDocument();
    });
  });

  it("can't create report if the subscription pricing modal is fixed", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        planCode: "report",
        status: "active",
        quantity: 1,
        pricingModel: "Fixed",
      },
    });

    render(
      <SubscriptionProvider>
        <TestingComponent companyList={[{ uuid: "123", name: "company 1" }]} />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("fetch_subscription_info")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("fetch_subscription_info"));

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("plan_code").textContent).toBe("report");
    });
    await waitFor(() => {
      expect(screen.getByTestId("create_new_report")).toBeInTheDocument();
    });
  });
});
