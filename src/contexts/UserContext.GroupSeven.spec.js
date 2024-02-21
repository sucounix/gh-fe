import React, { useContext, useEffect } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { UserProvider, UserContext } from "./UserContext";
import { SubscriptionContext } from "./SubscriptionContext";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";

jest.mock("axios");
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

// if their is an id_token and the user state=null , then should fetchUser be called.
// if the fetchUser endpoint failed , then should called logoutUser method.
// when call loginHandler method should set the user state and id_token in localStorage.
// when call logoutUser method should clear the localStorage and redirect to the login page.

const TestingComponent = ({ userData, id_token }) => {
  const { user, setUser, loginHandler, logoutUser, fetchUser } =
    useContext(UserContext);

  return (
    <div data-testid="children_component">
      {user && <p data-testid="user_name">{user.name}</p>}
      <button data-testid="fetch_user_btn" onClick={fetchUser}>
        fetch user
      </button>
      <button
        data-testid="login_handler_btn"
        onClick={() => loginHandler(userData, id_token)}
      >
        login handler
      </button>
      <button data-testid="logout_btn" onClick={logoutUser}>
        logout
      </button>
    </div>
  );
};

describe("User Context", () => {
  it("if their is an id_token and the user state=null , then should fetchUser be called.", async () => {
    localStorage.setItem("id_token", "test_123");
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        name: "test user",
        uuid: "123",
      },
    });
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ setSubscriptionInfo: jest.fn() }}
        >
          <UserProvider>
            <TestingComponent />
          </UserProvider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("user_name").textContent).toBe("test user");
    });
  });

  it("if the fetchUser endpoint failed , then should called logoutUser method.", async () => {
    localStorage.setItem("id_token", "test_123");
    localStorage.setItem("user", { name: "test user" });
    AxiosMock.get.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ setSubscriptionInfo: jest.fn() }}
        >
          <UserProvider>
            <TestingComponent />
          </UserProvider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  it("when call loginHandler method should set the user state and id_token in localStorage.", async () => {
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ setSubscriptionInfo: jest.fn() }}
        >
          <UserProvider>
            <TestingComponent
              userData={{
                name: "test user",
                uuid: "123",
              }}
              id_token="test_123"
            />
          </UserProvider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("login_handler_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("login_handler_btn"));
    await waitFor(() => {
      expect(screen.queryByTestId("user_name").textContent).toBe("test user");
    });
    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe("test_123");
    });
  });

  it("when call logoutUser method should clear the localStorage and redirect to the login page.", async () => {
    localStorage.setItem("id_token", "test_123");
    localStorage.setItem("user", { name: "test user" });
    AxiosMock.get.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{ setSubscriptionInfo: jest.fn() }}
        >
          <UserProvider>
            <TestingComponent />
          </UserProvider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId("logout_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("logout_btn"));
    await waitFor(() => {
      expect(localStorage.getItem("user")).toBeNull();
    });
    await waitFor(() => {
      expect(window.location.pathname).toEqual(`/login`);
    });
  });
});
