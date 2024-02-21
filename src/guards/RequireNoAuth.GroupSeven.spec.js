import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RequireNoAuth from "./RequireNoAuth";
import { UserContext } from "../contexts/UserContext";
import { CompaniesContext } from "../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../contexts/CompanyPreferencesFilter";
import { SubscriptionContext } from "../contexts/SubscriptionContext";
import { TutorialVideosContext } from "../contexts/TutorialVideos";
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
const user = {
  signInUserSession: {
    idToken: {
      jwtToken: "test_token_123",
    },
  },
};
const userWithoutIdToken = {
  signInUserSession: {
    idToken: null,
  },
};
const userWithoutJwtToken = {
  signInUserSession: {
    idToken: { jwtToken: null },
  },
};

describe("Require no-auth guard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("if the cognitoUser has jwtToken then it should redirect to home page.", async () => {
    const setCompaniesFn = jest.fn();
    const setSelectedCompanyFn = jest.fn();
    const setUserFn = jest.fn();
    const setSubscriptionInfoFn = jest.fn();
    const setCompanyAPIPreferencesFn = jest.fn();
    const setCompanyFilterPreferencesFn = jest.fn();
    const clearCurrentVideoFn = jest.fn();
    jest.spyOn(Auth, "currentAuthenticatedUser").mockReturnValue(user);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            setCompanies: setCompaniesFn,
            setSelectedCompany: setSelectedCompanyFn,
          }}
        >
          <SubscriptionContext.Provider
            value={{
              setSubscriptionInfo: setSubscriptionInfoFn,
            }}
          >
            <CompanyPreferencesApiContext.Provider
              value={{ setCompanyAPIPreferences: setCompanyAPIPreferencesFn }}
            >
              <CompanyPreferencesFilterContext.Provider
                value={{
                  setCompanyFilterPreferences: setCompanyFilterPreferencesFn,
                }}
              >
                <UserContext.Provider value={{ setUser: setUserFn }}>
                  <TutorialVideosContext.Provider
                    value={{ clearCurrentVideo: clearCurrentVideoFn }}
                  >
                    <RequireNoAuth />
                  </TutorialVideosContext.Provider>
                </UserContext.Provider>
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockUsedNavigate).toBeCalledWith(`/`);
    });
  });

  it("if the cognitoUser doesn't have idToken then it should redirect to the desired page and the localstorage should be cleared.", async () => {
    const setCompaniesFn = jest.fn();
    const setSelectedCompanyFn = jest.fn();
    const setUserFn = jest.fn();
    const setSubscriptionInfoFn = jest.fn();
    const setCompanyAPIPreferencesFn = jest.fn();
    const setCompanyFilterPreferencesFn = jest.fn();
    const clearCurrentVideoFn = jest.fn();
    jest
      .spyOn(Auth, "currentAuthenticatedUser")
      .mockReturnValue(userWithoutIdToken);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            setCompanies: setCompaniesFn,
            setSelectedCompany: setSelectedCompanyFn,
          }}
        >
          <SubscriptionContext.Provider
            value={{
              setSubscriptionInfo: setSubscriptionInfoFn,
            }}
          >
            <CompanyPreferencesApiContext.Provider
              value={{ setCompanyAPIPreferences: setCompanyAPIPreferencesFn }}
            >
              <CompanyPreferencesFilterContext.Provider
                value={{
                  setCompanyFilterPreferences: setCompanyFilterPreferencesFn,
                }}
              >
                <UserContext.Provider value={{ setUser: setUserFn }}>
                  <TutorialVideosContext.Provider
                    value={{ clearCurrentVideo: clearCurrentVideoFn }}
                  >
                    <RequireNoAuth />
                  </TutorialVideosContext.Provider>
                </UserContext.Provider>
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBeNull();
    });
    await waitFor(() => {
      expect(screen.getByTestId("outlet_contnet")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(setCompaniesFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setSelectedCompanyFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setUserFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setSubscriptionInfoFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setCompanyAPIPreferencesFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setCompanyFilterPreferencesFn).toBeCalled();
    });
    await waitFor(() => {
      expect(clearCurrentVideoFn).toBeCalled();
    });
  });

  it("if the cognitoUser doesn't have jwtToken then it should redirect to the desired page and the localstorage should be cleared.", async () => {
    const setCompaniesFn = jest.fn();
    const setSelectedCompanyFn = jest.fn();
    const setUserFn = jest.fn();
    const setSubscriptionInfoFn = jest.fn();
    const setCompanyAPIPreferencesFn = jest.fn();
    const setCompanyFilterPreferencesFn = jest.fn();
    const clearCurrentVideoFn = jest.fn();
    jest
      .spyOn(Auth, "currentAuthenticatedUser")
      .mockReturnValue(userWithoutJwtToken);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            setCompanies: setCompaniesFn,
            setSelectedCompany: setSelectedCompanyFn,
          }}
        >
          <SubscriptionContext.Provider
            value={{
              setSubscriptionInfo: setSubscriptionInfoFn,
            }}
          >
            <CompanyPreferencesApiContext.Provider
              value={{ setCompanyAPIPreferences: setCompanyAPIPreferencesFn }}
            >
              <CompanyPreferencesFilterContext.Provider
                value={{
                  setCompanyFilterPreferences: setCompanyFilterPreferencesFn,
                }}
              >
                <UserContext.Provider value={{ setUser: setUserFn }}>
                  <TutorialVideosContext.Provider
                    value={{ clearCurrentVideo: clearCurrentVideoFn }}
                  >
                    <RequireNoAuth />
                  </TutorialVideosContext.Provider>
                </UserContext.Provider>
              </CompanyPreferencesFilterContext.Provider>
            </CompanyPreferencesApiContext.Provider>
          </SubscriptionContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(localStorage.getItem("id_token")).toBeNull();
    });
    await waitFor(() => {
      expect(screen.getByTestId("outlet_contnet")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(setCompaniesFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setSelectedCompanyFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setUserFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setSubscriptionInfoFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setCompanyAPIPreferencesFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setCompanyFilterPreferencesFn).toBeCalled();
    });
    await waitFor(() => {
      expect(clearCurrentVideoFn).toBeCalled();
    });
  });
});
