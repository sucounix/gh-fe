import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AstraChatSubHeader from "./AstraChatSubHeader";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

describe("Astra chat sub header", () => {
  it("If the isAstraTokensEnough = false , the recharge tokens should be rendered", async () => {
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: { used: 50, balance: 1000 },
              },
            ],
          },
        }}
      >
        <CompaniesContext.Provider
          value={{ selectedCompany: { currency: "EGP" } }}
        >
          <AstraChatSubHeader
            threadId={"thread_123"}
            isAstraTokensEnough={false}
            handleCreateNewSession={jest.fn()}
          />
        </CompaniesContext.Provider>
      </SubscriptionContext.Provider>
    );

    expect(screen.getByTestId("recharge_tokens")).toBeInTheDocument();
  });

  it("when click on add extra in recharge tokens , it should navigate to subscription settings", async () => {
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: { used: 50, balance: 1000 },
              },
            ],
          },
        }}
      >
        <CompaniesContext.Provider
          value={{ selectedCompany: { currency: "EGP" } }}
        >
          <AstraChatSubHeader
            threadId={"thread_123"}
            isAstraTokensEnough={false}
            handleCreateNewSession={jest.fn()}
          />
        </CompaniesContext.Provider>
      </SubscriptionContext.Provider>
    );

    expect(screen.getByTestId("recharge_tokens")).toBeInTheDocument();
    expect(screen.getByTestId("recharge__btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("recharge__btn"));
    await waitFor(() => {
      expect(mockedUsedNavigate).toBeCalledWith(
        "/organisation-settings/subscription-settings"
      );
    });
  });

  it("If the isAstraTokensEnough = false and subscriptionInfo=null , the recharge tokens shouldn't be rendered", async () => {
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: null,
        }}
      >
        <CompaniesContext.Provider
          value={{ selectedCompany: { currency: "EGP" } }}
        >
          <AstraChatSubHeader
            threadId={"thread_123"}
            isAstraTokensEnough={false}
            handleCreateNewSession={jest.fn()}
          />
        </CompaniesContext.Provider>
      </SubscriptionContext.Provider>
    );

    expect(screen.queryByTestId("recharge_tokens")).not.toBeInTheDocument();
  });

  it("If the isAstraTokensEnough = true , the create new session should be rendered", async () => {
    render(
      <AstraChatSubHeader
        threadId={"thread_123"}
        isAstraTokensEnough={true}
        handleCreateNewSession={jest.fn()}
      />
    );

    expect(screen.getByTestId("create__new__session")).toBeInTheDocument();
  });

  it("renders the component with create new session button when astra tokens are enough", () => {
    const handleCreateNewSessionFn = jest.fn();
    render(
      <AstraChatSubHeader
        threadId={"thread_123"}
        isAstraTokensEnough={true}
        handleCreateNewSession={handleCreateNewSessionFn}
      />
    );

    const createNewSessionButton = screen.getByTestId("create__new__session");
    expect(createNewSessionButton).toBeInTheDocument();

    fireEvent.click(createNewSessionButton);
    expect(handleCreateNewSessionFn).toHaveBeenCalled();
  });

  it("At the initial step of chating , the initial token view should be rendered", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatSubHeader
          threadId={null}
          isAstraTokensEnough={true}
          handleCreateNewSession={jest.fn()}
        />
      </SubscriptionContext.Provider>
    );

    expect(fetchSubscriptionInfoFn).toBeCalled();
    expect(screen.getByTestId("initial__tokens")).toBeInTheDocument();
  });
});
