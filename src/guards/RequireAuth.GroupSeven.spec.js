import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import { UserContext } from "../contexts/UserContext";
import { Auth } from "aws-amplify";

const mockUsedLocation = jest.fn();
const mockUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"), // use actual for all non-hook parts
  useParams: jest.fn(),
  useLocation: () => mockUsedLocation,
  useNavigate: () => mockUsedNavigate,
  Outlet: () => <div data-testid="outlet_contnet">Outlet</div>,
}));
const cognitoUser = {
  signInUserSession: {
    idToken: {
      jwtToken: "test_token_123",
    },
  },
};
const cognitoUserWithoutIdToken = {
  signInUserSession: {
    idToken: null,
  },
};
const cognitoUserWithoutJwtToken = {
  signInUserSession: {
    idToken: { jwtToken: null },
  },
};
describe("Require auth guard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("if the cognitoUser has jwtToken then should save it in localstorage.", async () => {
    const fetchUserFn = jest.fn();

    jest.spyOn(Auth, "currentAuthenticatedUser").mockReturnValue(cognitoUser);

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ fetchUser: fetchUserFn, user: null }}>
          <RequireAuth />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBe(`test_token_123`);
    });
  });

  it("if the cognitoUser has jwtToken and the user =null then fetch the user.", async () => {
    const fetchUserFn = jest.fn();

    jest.spyOn(Auth, "currentAuthenticatedUser").mockReturnValue(cognitoUser);

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ fetchUser: fetchUserFn, user: null }}>
          <RequireAuth />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetchUserFn).toBeCalled();
    });
  });

  it("if the cognitoUser has jwtToken and the user is exist then fetch the user.", async () => {
    const fetchUserFn = jest.fn();

    jest.spyOn(Auth, "currentAuthenticatedUser").mockReturnValue(cognitoUser);

    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{ fetchUser: fetchUserFn, user: { uuid: "1" } }}
        >
          <RequireAuth />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetchUserFn).not.toBeCalled();
    });
  });

  it("if the cognitoUser has jwtToken then should redirect to the desired page.", async () => {
    const fetchUserFn = jest.fn();

    jest.spyOn(Auth, "currentAuthenticatedUser").mockReturnValue(cognitoUser);

    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{ fetchUser: fetchUserFn, user: { uuid: "1" } }}
        >
          <RequireAuth />
        </UserContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("outlet_contnet")).toBeInTheDocument();
    });
  });

  it("if the cognitoUser hasn't jwtToken then should call logout method.", async () => {
    const fetchUserFn = jest.fn();
    const logoutUserFn = jest.fn();

    jest
      .spyOn(Auth, "currentAuthenticatedUser")
      .mockReturnValue(cognitoUserWithoutJwtToken);

    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            fetchUser: fetchUserFn,
            logoutUser: logoutUserFn,
            user: { uuid: "1" },
          }}
        >
          <RequireAuth />
        </UserContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(logoutUserFn).toBeCalled();
    });
  });

  it("if the cognitoUser hasn't IdToken then should call logout method.", async () => {
    const fetchUserFn = jest.fn();
    const logoutUserFn = jest.fn();

    jest
      .spyOn(Auth, "currentAuthenticatedUser")
      .mockReturnValue(cognitoUserWithoutIdToken);

    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            fetchUser: fetchUserFn,
            logoutUser: logoutUserFn,
            user: { uuid: "1" },
          }}
        >
          <RequireAuth />
        </UserContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(logoutUserFn).toBeCalled();
    });
  });
});
