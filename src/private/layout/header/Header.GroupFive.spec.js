import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import { UserContext } from "../../../contexts/UserContext";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

describe("Header", () => {
  beforeEach(() => {
    window = Object.assign(window, { innerWidth: 967 });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the breadcrumps should be rendered", async () => {
    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [{ title: "Analysis" }],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: null,
              setSelectedCompany: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <Header />
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("breadcrumps_0")).toBeInTheDocument();
    });
  });

  it("the user name should be rendered", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;

    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [{ title: "Analysis" }],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: null,
              setSelectedCompany: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <UserContext.Provider
              value={{
                user: {
                  name: "test user",
                  uuid: "123",
                },
                logoutUser: jest.fn(),
              }}
            >
              <Header />
            </UserContext.Provider>
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user_name_desktop")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("user_name_desktop").textContent).toBe(
        "Hello test user"
      );
    });
  });

  it("the organization settings should be rendered and when click on it should navigate to organization settings page", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{
            breadCrumbs: [],
            setBreadCrumbs: jest.fn(),
          }}
        >
          <UserContext.Provider
            value={{
              logoutUser: jest.fn(),
              user: {
                name: "test user",
              },
            }}
          >
            <CompaniesContext.Provider
              value={{
                companies: [],
                selectedCompany: null,
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <Header />
            </CompaniesContext.Provider>
          </UserContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    const account_settings_desktop = screen.getByTestId(
      "account_settings_desktop"
    );

    await waitFor(() => {
      expect(account_settings_desktop).toBeInTheDocument();
    });

    fireEvent.click(account_settings_desktop);
    const organisation_settings = screen.getByTestId(
      "organization_settings_link"
    );

    await waitFor(() => {
      expect(organisation_settings).toBeInTheDocument();
    });

    fireEvent.click(organisation_settings);

    await waitFor(() => {
      expect(organisation_settings.href).toContain(
        "http://localhost/organisation-settings/company-profile"
      );
    });
  });

  it("when click on help center , should navigate to the help center page", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{
            breadCrumbs: [],
            setBreadCrumbs: jest.fn(),
          }}
        >
          <UserContext.Provider
            value={{
              logoutUser: jest.fn(),
              user: {
                name: "test user",
              },
            }}
          >
            <CompaniesContext.Provider
              value={{
                companies: [],
                selectedCompany: null,
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <Header />
            </CompaniesContext.Provider>
          </UserContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    const help_center_link = screen.getByTestId("help_center_link");

    await waitFor(() => {
      expect(help_center_link).toBeInTheDocument();
    });

    fireEvent.click(help_center_link);

    await waitFor(() => {
      expect(help_center_link.href).toContain("/help-center/faq");
    });
    await waitFor(() => {
      expect(window.location.href).toEqual("http://localhost/help-center/faq");
    });
  });

  it("the selected company dropdown should be rendered, when click on it the list should appear and the enabled companies only will appear", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;
    window.history.pushState({}, "header", "http://localhost/help-center/faq");
    const setSelectedCompanyFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          isAllowedToAddNewCompany: jest.fn(() => {
            return true;
          }),
        }}
      >
        <BreadcrumbsContext.Provider
          value={{
            breadCrumbs: [{ title: "Analysis" }],
            setBreadCrumbs: jest.fn(),
          }}
        >
          <BrowserRouter>
            <CompaniesContext.Provider
              value={{
                companies: [
                  { uuid: "123", name: "company 1", is_enabled: true },
                  { uuid: "456", name: "company 2", is_enabled: true },
                  { uuid: "789", name: "company 3", is_enabled: false },
                ],
                selectedCompany: { uuid: "123", name: "company 1" },
                setSelectedCompany: setSelectedCompanyFn,
                setCompanies: jest.fn(),
              }}
            >
              <UserContext.Provider
                value={{
                  user: {
                    name: "test user",
                    uuid: "123",
                  },
                  logoutUser: jest.fn(),
                }}
              >
                <Header />
              </UserContext.Provider>
            </CompaniesContext.Provider>
          </BrowserRouter>
        </BreadcrumbsContext.Provider>
      </SubscriptionContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company 1"
      );
    });
    fireEvent.click(screen.getByTestId("selected_company_name"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_companies_list")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_456")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("selected_company_456"));
    await waitFor(() => {
      expect(setSelectedCompanyFn).toBeCalled();
    });
  });

  it("the selected company dropdown should be rendered, when click on it the list should appear and the diabled companies will not  appear", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;
    window.history.pushState({}, "header", "http://localhost/help-center/faq");

    render(
      <SubscriptionContext.Provider
        value={{
          isAllowedToAddNewCompany: jest.fn(() => {
            return true;
          }),
        }}
      >
        <BreadcrumbsContext.Provider
          value={{
            breadCrumbs: [{ title: "Analysis" }],
            setBreadCrumbs: jest.fn(),
          }}
        >
          <BrowserRouter>
            <CompaniesContext.Provider
              value={{
                companies: [
                  { uuid: "123", name: "company 1", is_enabled: true },
                  { uuid: "456", name: "company 2", is_enabled: true },
                  { uuid: "789", name: "company 3", is_enabled: false },
                ],
                selectedCompany: { uuid: "123", name: "company 1" },
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <UserContext.Provider
                value={{
                  user: {
                    name: "test user",
                    uuid: "123",
                  },
                  logoutUser: jest.fn(),
                }}
              >
                <Header />
              </UserContext.Provider>
            </CompaniesContext.Provider>
          </BrowserRouter>
        </BreadcrumbsContext.Provider>
      </SubscriptionContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company 1"
      );
    });
    fireEvent.click(screen.getByTestId("selected_company_name"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_companies_list")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId("selected_company_789")
      ).not.toBeInTheDocument();
    });
  });

  it("can create new company if their is availabilty in the subscription plan", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;
    const isAllowedToAddNewCompanyFn = jest.fn(() => {
      return true;
    });
    render(
      <SubscriptionContext.Provider
        value={{
          isAllowedToAddNewCompany: isAllowedToAddNewCompanyFn,
        }}
      >
        <BreadcrumbsContext.Provider
          value={{
            breadCrumbs: [{ title: "Analysis" }],
            setBreadCrumbs: jest.fn(),
          }}
        >
          <BrowserRouter>
            <CompaniesContext.Provider
              value={{
                companies: [
                  { uuid: "123", name: "company 1", is_enabled: true },
                  { uuid: "456", name: "company 2", is_enabled: true },
                  { uuid: "789", name: "company 3", is_enabled: false },
                ],
                selectedCompany: { uuid: "123", name: "company 1" },
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <UserContext.Provider
                value={{
                  user: {
                    name: "test user",
                    uuid: "123",
                  },
                  logoutUser: jest.fn(),
                }}
              >
                <Header />
              </UserContext.Provider>
            </CompaniesContext.Provider>
          </BrowserRouter>
        </BreadcrumbsContext.Provider>
      </SubscriptionContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company 1"
      );
    });
    fireEvent.click(screen.getByTestId("selected_company_name"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_companies_list")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("add_new_company_link")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("add_new_company_link"));
    await waitFor(() => {
      expect(isAllowedToAddNewCompanyFn).toBeCalled();
    });
    await waitFor(() => {
      expect(window.location.href).toEqual("http://localhost/upload/excel");
    });
  });

  it("if the user on free plan he can't create company more than one company", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;
    window.history.pushState({}, "header", "http://localhost/help-center/faq");

    render(
      <SubscriptionContext.Provider
        value={{
          isAllowedToAddNewCompany: jest.fn(() => {
            return false;
          }),
        }}
      >
        <BreadcrumbsContext.Provider
          value={{
            breadCrumbs: [{ title: "Analysis" }],
            setBreadCrumbs: jest.fn(),
          }}
        >
          <BrowserRouter>
            <CompaniesContext.Provider
              value={{
                companies: [
                  { uuid: "123", name: "company 1", is_enabled: true },
                  { uuid: "456", name: "company 2", is_enabled: true },
                  { uuid: "789", name: "company 3", is_enabled: false },
                ],
                selectedCompany: { uuid: "123", name: "company 1" },
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <UserContext.Provider
                value={{
                  user: {
                    name: "test user",
                    uuid: "123",
                  },
                  logoutUser: jest.fn(),
                }}
              >
                <Header />
              </UserContext.Provider>
            </CompaniesContext.Provider>
          </BrowserRouter>
        </BreadcrumbsContext.Provider>
      </SubscriptionContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company 1"
      );
    });
    fireEvent.click(screen.getByTestId("selected_company_name"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_companies_list")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("add_new_company_link").getAttribute("disabled")
      ).toBe("");
    });
  });

  it("if the path upload excel , then the selected company dropdown shouldn't be rendered", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;
    window.history.pushState({}, "header", "http://localhost/upload/excel");

    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [{ title: "Analysis" }],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <CompaniesContext.Provider
            value={{
              companies: [
                { uuid: "123", name: "company 1", is_enabled: true },
                { uuid: "456", name: "company 2", is_enabled: true },
                { uuid: "789", name: "company 3", is_enabled: false },
              ],
              selectedCompany: { uuid: "123", name: "company 1" },
              setSelectedCompany: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <UserContext.Provider
              value={{
                user: {
                  name: "test user",
                  uuid: "123",
                },
                logoutUser: jest.fn(),
              }}
            >
              <Header />
            </UserContext.Provider>
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("selected_company_name")
      ).not.toBeInTheDocument();
    });
  });

  it("if the path quickbooks callback , then the selected company dropdown shouldn't be rendered", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;
    window.history.pushState(
      {},
      "header",
      "http://localhost/quickbooks/callback"
    );

    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [{ title: "Analysis" }],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <CompaniesContext.Provider
            value={{
              companies: [
                { uuid: "123", name: "company 1", is_enabled: true },
                { uuid: "456", name: "company 2", is_enabled: true },
                { uuid: "789", name: "company 3", is_enabled: false },
              ],
              selectedCompany: { uuid: "123", name: "company 1" },
              setSelectedCompany: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <UserContext.Provider
              value={{
                user: {
                  name: "test user",
                  uuid: "123",
                },
                logoutUser: jest.fn(),
              }}
            >
              <Header />
            </UserContext.Provider>
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("selected_company_name")
      ).not.toBeInTheDocument();
    });
  });

  it("if the path home page , then the selected company dropdown shouldn't be rendered", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    window.ResizeObserver = ResizeObserver;
    window.history.pushState({}, "header", "http://localhost/");

    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [{ title: "Analysis" }],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <CompaniesContext.Provider
            value={{
              companies: [
                { uuid: "123", name: "company 1", is_enabled: true },
                { uuid: "456", name: "company 2", is_enabled: true },
                { uuid: "789", name: "company 3", is_enabled: false },
              ],
              selectedCompany: { uuid: "123", name: "company 1" },
              setSelectedCompany: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <UserContext.Provider
              value={{
                user: {
                  name: "test user",
                  uuid: "123",
                },
                logoutUser: jest.fn(),
              }}
            >
              <Header />
            </UserContext.Provider>
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("selected_company_name")
      ).not.toBeInTheDocument();
    });
  });

  it("if the inner width of the window is less than or equal 967px , the burger menu should appear", async () => {
    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: null,
              setSelectedCompany: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <Header />
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    await waitFor(() => {
      expect(window.innerWidth).toBe(967);
    });
    const burger_menu_btn = screen.getByTestId("burger_menu");
    await waitFor(() => {
      expect(burger_menu_btn).toBeInTheDocument();
    });
  });

  it("when click on the menu button, the menu items should appear", async () => {
    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: null,
              setSelectedCompany: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <Header />
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    const burger_menu_btn = screen.getByTestId("burger_menu");
    await waitFor(() => {
      expect(burger_menu_btn).toBeInTheDocument();
    });

    fireEvent.click(burger_menu_btn);
    const mobile_side_menu = screen.getByTestId("sideMenu_mobile");

    await waitFor(() => {
      expect(mobile_side_menu).toBeInTheDocument();
    });
  });

  it("when click on the close menu button, the menu items should disappear", async () => {
    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <CompaniesContext.Provider
            value={{
              companies: [],
              selectedCompany: null,
              setSelectedCompany: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <Header />
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    const burger_menu_btn = screen.getByTestId("burger_menu");
    await waitFor(() => {
      expect(burger_menu_btn).toBeInTheDocument();
    });

    fireEvent.click(burger_menu_btn);
    const mobile_side_menu = screen.getByTestId("sideMenu_mobile");

    await waitFor(() => {
      expect(mobile_side_menu).toBeInTheDocument();
    });
    const close_menu_btn_mobile = screen.getByTestId("close_menu_btn_mobile");
    await waitFor(() => {
      expect(burger_menu_btn).toBeInTheDocument();
    });

    fireEvent.click(close_menu_btn_mobile);

    await waitFor(() => {
      expect(mobile_side_menu).not.toBeInTheDocument();
    });
  });

  it("when click on logout (desktop view) , the method {logoutUser} should be called", async () => {
    window = Object.assign(window, { innerWidth: 1000 });
    const logoutUser = jest.fn();
    window.ResizeObserver = ResizeObserver;

    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <UserContext.Provider
            value={{
              logoutUser,
            }}
          >
            <CompaniesContext.Provider
              value={{
                companies: [],
                selectedCompany: null,
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <Header />
            </CompaniesContext.Provider>
          </UserContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    const account_settings_desktop = screen.getByTestId(
      "account_settings_desktop"
    );

    await waitFor(() => {
      expect(account_settings_desktop).toBeInTheDocument();
    });

    fireEvent.click(account_settings_desktop);
    const logout_btn = screen.getByTestId("logout_desktop");

    await waitFor(() => {
      expect(logout_btn).toBeInTheDocument();
    });

    fireEvent.click(logout_btn);

    await waitFor(() => {
      expect(logoutUser).toBeCalledTimes(1);
    });
  });

  it("when click on logout (mobile view) , the method {logoutUser} should be called", async () => {
    const logoutUser = jest.fn();

    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <UserContext.Provider
            value={{
              logoutUser,
            }}
          >
            <CompaniesContext.Provider
              value={{
                companies: [],
                selectedCompany: null,
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <Header />
            </CompaniesContext.Provider>
          </UserContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    const burger_menu_btn = screen.getByTestId("burger_menu");
    await waitFor(() => {
      expect(burger_menu_btn).toBeInTheDocument();
    });

    fireEvent.click(burger_menu_btn);
    const mobile_side_menu = screen.getByTestId("sideMenu_mobile");

    await waitFor(() => {
      expect(mobile_side_menu).toBeInTheDocument();
    });
    const logout_btn = screen.getByTestId("logout_mobile");
    fireEvent.click(logout_btn);
    await waitFor(() => {
      expect(logoutUser).toBeCalledTimes(1);
    });
  });

  it("check the navigation in mobile menu", async () => {
    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <UserContext.Provider
            value={{
              logoutUser: jest.fn(),
            }}
          >
            <CompaniesContext.Provider
              value={{
                companies: [{ uuid: "123", name: "company 1" }],
                selectedCompany: { uuid: "123", name: "company 1" },
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <Header />
            </CompaniesContext.Provider>
          </UserContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    const burger_menu_btn = screen.getByTestId("burger_menu");
    await waitFor(() => {
      expect(burger_menu_btn).toBeInTheDocument();
    });

    fireEvent.click(burger_menu_btn);
    const mobile_side_menu = screen.getByTestId("sideMenu_mobile");

    await waitFor(() => {
      expect(mobile_side_menu).toBeInTheDocument();
    });
    const mobile__menu__link_KPI = screen.getByTestId("mobile__menu__link_KPI");
    await waitFor(() => {
      expect(mobile__menu__link_KPI).toBeInTheDocument();
    });
    fireEvent.click(mobile__menu__link_KPI);
    await waitFor(() => {
      expect(mockedUsedNavigate).toBeCalledTimes(1);
    });
  });

  it("when click on logout (mobile view) , the organization settings should appear and when click on it should navigate to organization settings", async () => {
    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <UserContext.Provider
            value={{
              logoutUser: jest.fn(),
            }}
          >
            <CompaniesContext.Provider
              value={{
                companies: [],
                selectedCompany: null,
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <Header />
            </CompaniesContext.Provider>
          </UserContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    const burger_menu_btn = screen.getByTestId("burger_menu");
    await waitFor(() => {
      expect(burger_menu_btn).toBeInTheDocument();
    });

    fireEvent.click(burger_menu_btn);
    const mobile_side_menu = screen.getByTestId("sideMenu_mobile");

    await waitFor(() => {
      expect(mobile_side_menu).toBeInTheDocument();
    });
    const organization_settings_link_mobile = screen.getByTestId(
      "organization_settings_link_mobile"
    );
    fireEvent.click(organization_settings_link_mobile);
    await waitFor(() => {
      expect(organization_settings_link_mobile.href).toContain(
        "http://localhost/organisation-settings/company-profile"
      );
    });
  });

  it("when click on logout (mobile view) , the help center should appear and when click on it should navigate to faq page", async () => {
    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <UserContext.Provider
            value={{
              logoutUser: jest.fn(),
            }}
          >
            <CompaniesContext.Provider
              value={{
                companies: [],
                selectedCompany: null,
                setSelectedCompany: jest.fn(),
                setCompanies: jest.fn(),
              }}
            >
              <Header />
            </CompaniesContext.Provider>
          </UserContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    const burger_menu_btn = screen.getByTestId("burger_menu");
    await waitFor(() => {
      expect(burger_menu_btn).toBeInTheDocument();
    });

    fireEvent.click(burger_menu_btn);
    const mobile_side_menu = screen.getByTestId("sideMenu_mobile");

    await waitFor(() => {
      expect(mobile_side_menu).toBeInTheDocument();
    });
    const help_center_mobile_link = screen.getByTestId(
      "help_center_mobile_link"
    );
    fireEvent.click(help_center_mobile_link);
    await waitFor(() => {
      expect(help_center_mobile_link.href).toContain(
        "http://localhost/help-center/faq"
      );
    });
  });
});
