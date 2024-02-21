import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UserProfile from "./UserProfile";
import AxiosMock from "axios";
import { UserContext } from "../../../../contexts/UserContext";
import { BrowserRouter } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import { Auth } from "aws-amplify";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "123",
  }),
}));

const user = {
  signInUserSession: {
    accessToken: {
      payload: {
        scope: "aws@testAgmai.com",
      },
    },
  },
};
const userSocial = {
  signInUserSession: {
    accessToken: {
      payload: {
        scope: "test@testAgmai.com",
      },
    },
  },
};

jest.mock("aws-amplify", () => ({
  ...jest.requireActual("aws-amplify"),
  Auth: {
    ...jest.requireActual("aws-amplify").Auth,
    currentAuthenticatedUser: jest.fn().mockImplementation(() =>
      Promise.resolve({
        signInUserSession: {
          accessToken: {
            payload: {
              scope: "aws@testAgmai.com",
            },
          },
        },
      })
    ),
    changePassword: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const dummyUser = {
  name: "user",
  uuid: "11222",
  role: "CEO",
  phone_number: "+201000000000",
  email: "user1@gmail.com",
  register_type: "normal",
};

describe("user profile", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("render normal account", async () => {
    // Mock Auth.currentAuthenticatedUser to return a user with AWS scope

    Auth.currentAuthenticatedUser.mockImplementation(() =>
      Promise.resolve(user)
    );

    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: dummyUser,
          }}
        >
          <UserProfile />
        </UserContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("password_input")).toBeInTheDocument();
    });
  });

  it("render social account", async () => {
    // Mock Auth.currentAuthenticatedUser to return a user with AWS scope

    Auth.currentAuthenticatedUser.mockImplementation(() =>
      Promise.resolve(userSocial)
    );

    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: dummyUser,
          }}
        >
          <UserProfile />
        </UserContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.queryByTestId("password_input")).not.toBeInTheDocument();
    });
  });

  it("validate attributes are valid for change password", async () => {
    Auth.currentAuthenticatedUser.mockImplementation(() =>
      Promise.resolve(user)
    );
    const mockSetOpenChangePassModal = jest.fn();

    Auth.changePassword.mockImplementation(() =>
      Promise.resolve(() => {
        mockSetOpenChangePassModal(false);
      })
    );

    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: dummyUser,
          }}
        >
          <UserProfile>
            <ChangePassword
              setOpenChangePassModal={mockSetOpenChangePassModal}
            />
          </UserProfile>
        </UserContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("password_input")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("change_password_btn"));

    fireEvent.change(screen.getByTestId("old_password"), {
      target: { value: "Test@123" },
    });

    fireEvent.change(screen.getByTestId("new_password"), {
      target: { value: "Test@1234" },
    });

    fireEvent.change(screen.getByTestId("confirm_new_password"), {
      target: { value: "Test@1234" },
    });

    const changePasswordForm = screen.getByTestId("changePassword_form");
    fireEvent.submit(changePasswordForm);
  });

  it("when change user info , the request should send", async () => {
    Promise.resolve(
      AxiosMock.patch.mockResolvedValueOnce({
        data: dummyUser,
      })
    );

    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{
            user: dummyUser,
          }}
        >
          <UserProfile />
        </UserContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("user_profile")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("email"), {
      target: dummyUser.email,
    });
    fireEvent.change(screen.getByTestId("phone_number"), {
      target: {
        value: "+201027581910",
      },
    });
    fireEvent.click(screen.getByTestId("role"));

    fireEvent.click(screen.getByText("CFO"));
    fireEvent.click(screen.getByTestId("save_btn"));

    await waitFor(() => {
      expect(AxiosMock.patch).toBeCalledTimes(1);
    });
  });
});
