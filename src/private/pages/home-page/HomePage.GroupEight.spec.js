import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { TimeFrameContext } from "../../../contexts/TimeFrameContext";
import { UserContext } from "../../../contexts/UserContext";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";

jest.mock("axios");
const dummyUser = {
  uuid: "2e21a0b4-ad86-4947-81fc-bfbddcdf4bc8",
  email: "test@gmail.com",
  register_type: "social",
  name: "test user",
  phone_number: null,
  role: null,
};

const fetchCompanyList = jest.fn();
const deleteCompanyPrefernces = jest.fn();
const setBreadCrumbs = jest.fn();
const clearTimeFrameResult = jest.fn();

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts

  useLocation: () => ({
    pathname: "/",
    state: {
      quickbooks_error: { details: "Company with this name already exists." },
    },
  }),
}));

describe("Home Page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("if the user doesn't has any companies , the welcome content should appear only", async () => {
    const fetchCompanyList = jest.fn();
    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            isAllowedToAddNewCompany: jest.fn(() => {
              return true;
            }),
          }}
        >
          <UserContext.Provider value={{ user: dummyUser }}>
            <BreadcrumbsContext.Provider
              value={{
                breadCrumbs: [],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <TimeFrameContext.Provider
                value={{
                  clearTimeFrameResult: jest.fn(),
                }}
              >
                <CompaniesContext.Provider
                  value={{
                    companies: [],
                    setCompanies: jest.fn(),
                    fetchCompanyList,
                  }}
                >
                  <HomePage />
                </CompaniesContext.Provider>
              </TimeFrameContext.Provider>
            </BreadcrumbsContext.Provider>
          </UserContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetchCompanyList).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId("welcome_content")).toBeInTheDocument();
    });

    await waitFor(() => {
      const Your_Companies = screen.queryByText("Your Companies");

      expect(Your_Companies).not.toBeInTheDocument();
    });
  });

  it("if the user has at least one companies , the welcome content and the list of companies", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            uuid: 1,
            name: "XPOVI Corporation",
            data_source: "Excel",
            modified: "2023-01-31T14:01:24Z",
          },
        ],
      })
    );
    const fetchCompanyList = jest.fn();

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            isAllowedToAddNewCompany: jest.fn(() => {
              return true;
            }),
          }}
        >
          <UserContext.Provider value={{ user: dummyUser }}>
            <BreadcrumbsContext.Provider
              value={{
                breadCrumbs: [],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <TimeFrameContext.Provider
                value={{
                  clearTimeFrameResult: jest.fn(),
                }}
              >
                <CompaniesContext.Provider
                  value={{
                    companies: [{ uuid: 12 }],
                    setCompanies: jest.fn(),
                    fetchCompanyList,
                  }}
                >
                  <HomePage />
                </CompaniesContext.Provider>
              </TimeFrameContext.Provider>
            </BreadcrumbsContext.Provider>
          </UserContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetchCompanyList).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId("welcome_content")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("list_companies")).toBeInTheDocument();
    });
  });

  it("when click on delete , the delete modal should appear", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            uuid: 12,
            is_enabled: true,
            data_source: "Excel",
            period_frequency: "month",
            name: "compnay 1",
            modified: "11-2-2022",
          },
        ],
      })
    );
    const fetchCompanyList = jest.fn();
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            isAllowedToAddNewCompany: jest.fn(() => {
              return true;
            }),
          }}
        >
          <UserContext.Provider value={{ user: dummyUser }}>
            <BreadcrumbsContext.Provider
              value={{
                breadCrumbs: [],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <TimeFrameContext.Provider
                value={{
                  clearTimeFrameResult: jest.fn(),
                }}
              >
                <CompaniesContext.Provider
                  value={{
                    companies: [
                      {
                        uuid: 12,
                        is_enabled: true,
                        data_source: "Excel",
                        period_frequency: "month",
                        name: "compnay 1",
                        modified: "11-2-2022",
                      },
                    ],
                    setCompanies: jest.fn(),
                    fetchCompanyList,
                  }}
                >
                  <HomePage />
                </CompaniesContext.Provider>
              </TimeFrameContext.Provider>
            </BreadcrumbsContext.Provider>
          </UserContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetchCompanyList).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId("company_options")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("company_options"));
    });

    await waitFor(() => {
      const delete_btn = screen.getByTestId("delete_btn");

      expect(delete_btn).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(delete_btn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("delete_modal")).toBeInTheDocument();
    });
  });

  it("when confirm the delete , should send delete request", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            uuid: 12,
            is_enabled: true,
            data_source: "Excel",
            period_frequency: "month",
            name: "compnay 1",
            modified: "11-2-2022",
          },
        ],
      })
    );
    const fetchCompanyList = jest.fn();
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            isAllowedToAddNewCompany: jest.fn(() => {
              return true;
            }),
          }}
        >
          <UserContext.Provider value={{ user: dummyUser }}>
            <BreadcrumbsContext.Provider
              value={{
                breadCrumbs: [],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <TimeFrameContext.Provider
                value={{
                  clearTimeFrameResult: jest.fn(),
                }}
              >
                <CompaniesContext.Provider
                  value={{
                    companies: [
                      {
                        uuid: 12,
                        is_enabled: true,
                        data_source: "Excel",
                        period_frequency: "month",
                        name: "compnay 1",
                        modified: "11-2-2022",
                      },
                    ],
                    selectedCompany: {
                      uuid: 12,
                      is_enabled: true,
                      data_source: "Excel",
                      period_frequency: "month",
                      name: "compnay 1",
                      modified: "11-2-2022",
                    },
                    setCompanies: jest.fn(),
                    fetchCompanyList,
                    deleteCompanyPrefernces: jest.fn(),
                  }}
                >
                  <HomePage />
                </CompaniesContext.Provider>
              </TimeFrameContext.Provider>
            </BreadcrumbsContext.Provider>
          </UserContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(fetchCompanyList).toBeCalledTimes(1);
    });

    await waitFor(() => {
      const company_options = screen.getByTestId("company_options");
      expect(company_options).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(company_options);
    });
    await waitFor(() => {
      const delete_btn = screen.getByTestId("delete_btn");
      expect(delete_btn).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(delete_btn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("delete_modal")).toBeInTheDocument();
      const delete_confirm_btn = screen.getByTestId("delete_confirm_btn");
      AxiosMock.delete.mockResolvedValueOnce({});
      // eslint-disable-next-line
      fireEvent.click(delete_confirm_btn);
    });

    await waitFor(() => {
      expect(AxiosMock.delete).toHaveBeenCalledWith("/company/12/");
    });
  });

  it("when cancel the delete , the modal should disappear", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            uuid: 12,
            is_enabled: true,
            data_source: "Excel",
            period_frequency: "month",
            name: "compnay 1",
            modified: new Date("2023-01-31T14:01:24Z"),
          },
        ],
      })
    );
    const fetchCompanyList = jest.fn();
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            isAllowedToAddNewCompany: jest.fn(() => {
              return true;
            }),
          }}
        >
          <UserContext.Provider value={{ user: dummyUser }}>
            <BreadcrumbsContext.Provider
              value={{
                breadCrumbs: [],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <TimeFrameContext.Provider
                value={{
                  clearTimeFrameResult: jest.fn(),
                }}
              >
                <CompaniesContext.Provider
                  value={{
                    companies: [
                      {
                        uuid: 12,
                        is_enabled: true,
                        data_source: "Excel",
                        period_frequency: "month",
                        name: "compnay 1",
                        modified: "11-2-2022",
                      },
                    ],
                    setCompanies: jest.fn(),
                    fetchCompanyList,
                  }}
                >
                  <HomePage />
                </CompaniesContext.Provider>
              </TimeFrameContext.Provider>
            </BreadcrumbsContext.Provider>
          </UserContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetchCompanyList).toBeCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId("company_options")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("company_options"));
    });

    await waitFor(() => {
      const delete_btn = screen.getByTestId("delete_btn");
      expect(delete_btn).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(delete_btn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("delete_modal")).toBeInTheDocument();
    });

    const delete_cancel_btn = screen.getByTestId("delete_cancel_btn");
    fireEvent.click(delete_cancel_btn);

    await waitFor(() => {
      expect(screen.getByTestId("delete_modal_title")).not.toBeVisible();
    });
  });

  it("when the user click on quickbooks integration button, should render the modal to take the data period", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            uuid: 1,
            name: "XPOVI Corporation",
            data_source: "Excel",
            modified: "2023-01-31T14:01:24Z",
          },
        ],
      })
    );
    const fetchCompanyList = jest.fn();

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            isAllowedToAddNewCompany: jest.fn(() => {
              return true;
            }),
          }}
        >
          <UserContext.Provider value={{ user: dummyUser }}>
            <BreadcrumbsContext.Provider
              value={{
                breadCrumbs: [],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <TimeFrameContext.Provider
                value={{
                  clearTimeFrameResult: jest.fn(),
                }}
              >
                <CompaniesContext.Provider
                  value={{
                    companies: [{ uuid: 12 }],
                    setCompanies: jest.fn(),
                    fetchCompanyList,
                  }}
                >
                  <HomePage />
                </CompaniesContext.Provider>
              </TimeFrameContext.Provider>
            </BreadcrumbsContext.Provider>
          </UserContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(fetchCompanyList).toBeCalledTimes(1);
    });
    await waitFor(() => {
      const quickbooks__btn = screen.getByTestId("quickbooks__btn");
      // eslint-disable-next-line
      fireEvent.click(quickbooks__btn);
      expect(screen.getByTestId("Q__date__period__modal")).toBeInTheDocument();
    });
  });

  it("if there is a Quickbooks integration error , the error modal should appear", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            uuid: 1,
            name: "XPOVI Corporation",
            data_source: "Excel",
            modified: "2023-01-31T14:01:24Z",
          },
        ],
      })
    );
    const fetchCompanyList = jest.fn();

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            isAllowedToAddNewCompany: jest.fn(() => {
              return true;
            }),
          }}
        >
          <UserContext.Provider value={{ user: dummyUser }}>
            <BreadcrumbsContext.Provider
              value={{
                breadCrumbs: [],
                setBreadCrumbs: jest.fn(),
              }}
            >
              <TimeFrameContext.Provider
                value={{
                  clearTimeFrameResult: jest.fn(),
                }}
              >
                <CompaniesContext.Provider
                  value={{
                    companies: [{ uuid: 12 }],
                    setCompanies: jest.fn(),
                    fetchCompanyList,
                  }}
                >
                  <HomePage />
                </CompaniesContext.Provider>
              </TimeFrameContext.Provider>
            </BreadcrumbsContext.Provider>
          </UserContext.Provider>
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(fetchCompanyList).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("Q_error__modal")).toBeInTheDocument();
    });
  });

  it("renders the welcome content if the user doesn't have any companies", () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            companies: [],
            fetchCompanyList,
            selectedCompany: null,
            deleteCompanyPrefernces,
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              setBreadCrumbs,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                clearTimeFrameResult,
              }}
            >
              <UserContext.Provider
                value={{
                  user: dummyUser,
                }}
              >
                <SubscriptionContext.Provider
                  value={{
                    isAllowedToAddNewCompany: jest.fn(() => true),
                  }}
                >
                  <HomePage />
                </SubscriptionContext.Provider>
              </UserContext.Provider>
            </TimeFrameContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    expect(fetchCompanyList).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("welcome_content")).toBeInTheDocument();
    expect(screen.queryByText("Your Companies")).not.toBeInTheDocument();
  });

  it("renders the welcome content and the list of companies if the user has at least one company", () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            companies: [{ uuid: 1 }],
            fetchCompanyList,
            selectedCompany: null,
            deleteCompanyPrefernces,
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              setBreadCrumbs,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                clearTimeFrameResult,
              }}
            >
              <UserContext.Provider
                value={{
                  user: dummyUser,
                }}
              >
                <SubscriptionContext.Provider
                  value={{
                    isAllowedToAddNewCompany: jest.fn(() => true),
                  }}
                >
                  <HomePage />
                </SubscriptionContext.Provider>
              </UserContext.Provider>
            </TimeFrameContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    expect(fetchCompanyList).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("welcome_content")).toBeInTheDocument();
    expect(screen.getByTestId("list_companies")).toBeInTheDocument();
  });

  it("opens the delete modal when the delete button is clicked", () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            companies: [{ uuid: 12 }],
            fetchCompanyList,
            selectedCompany: null,
            deleteCompanyPrefernces,
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              setBreadCrumbs,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                clearTimeFrameResult,
              }}
            >
              <UserContext.Provider
                value={{
                  user: dummyUser,
                }}
              >
                <SubscriptionContext.Provider
                  value={{
                    isAllowedToAddNewCompany: jest.fn(() => true),
                  }}
                >
                  <HomePage />
                </SubscriptionContext.Provider>
              </UserContext.Provider>
            </TimeFrameContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    expect(fetchCompanyList).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId("company_options"));
    fireEvent.click(screen.getByTestId("delete_btn"));
    expect(screen.getByTestId("delete_modal")).toBeInTheDocument();
  });

  it("sends a delete request when the delete is confirmed", () => {
    AxiosMock.delete.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            companies: [
              {
                uuid: 12,
                is_enabled: true,
                data_source: "Excel",
                period_frequency: "month",
                name: "compnay 1",
                modified: "11-2-2022",
              },
            ],
            fetchCompanyList,
            selectedCompany: {
              uuid: 12,
              is_enabled: true,
              data_source: "Excel",
              period_frequency: "month",
              name: "compnay 1",
              modified: "11-2-2022",
            },
            deleteCompanyPrefernces,
          }}
        >
          <BreadcrumbsContext.Provider
            value={{
              setBreadCrumbs,
            }}
          >
            <TimeFrameContext.Provider
              value={{
                clearTimeFrameResult,
              }}
            >
              <UserContext.Provider
                value={{
                  user: dummyUser,
                }}
              >
                <SubscriptionContext.Provider
                  value={{
                    isAllowedToAddNewCompany: jest.fn(() => true),
                  }}
                >
                  <HomePage />
                </SubscriptionContext.Provider>
              </UserContext.Provider>
            </TimeFrameContext.Provider>
          </BreadcrumbsContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    expect(fetchCompanyList).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId("company_options"));
    fireEvent.click(screen.getByTestId("delete_btn"));
    fireEvent.click(screen.getByTestId("delete_confirm_btn"));
    expect(AxiosMock.delete).toHaveBeenCalledTimes(1);
  });
});
