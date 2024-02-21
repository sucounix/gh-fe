import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import UploadExcel from "./UploadExcel";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import * as errorhandling from "../../../utils/errorHandling";
import { TutorialVideosContext } from "../../../contexts/TutorialVideos";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";

jest.mock("axios");

describe("Upload Excel", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the upload button should be disabled by default", async () => {
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
              selectedCompany: {
                uuid: 1,
              },
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <SubscriptionContext.Provider
              value={{
                isAllowedToAddNewCompany: jest.fn(),
              }}
            >
              <UploadExcel />
            </SubscriptionContext.Provider>
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    const uploadButton = screen.getByTestId("upload_file_input");
    expect(uploadButton).toBeDisabled();
  });

  it("the upload button should work when submitting", async () => {
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
              selectedCompany: {
                uuid: 1,
              },
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <SubscriptionContext.Provider
              value={{
                isAllowedToAddNewCompany: jest.fn(),
              }}
            >
              <UploadExcel />
            </SubscriptionContext.Provider>
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    AxiosMock.post.mockResolvedValueOnce({
      data: {},
    });

    const startMonthSelectInput = screen.getByTestId("fiscal-year-start-month");
    const frequencySelectInput = screen.getByTestId("period-frequency");

    fireEvent.click(startMonthSelectInput);
    fireEvent.click(screen.getByText("January"));

    fireEvent.click(frequencySelectInput);
    fireEvent.click(screen.getByText("Monthly"));

    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      ],
    });

    expect(AxiosMock.post).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("upload_progress_id")).toBeInTheDocument();
  });

  it("should submit file and display success", async () => {
    const mockDeleteCompanyPrefernces = jest.fn();

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
              selectedCompany: {
                uuid: 1,
              },
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
              deleteCompanyPrefernces: mockDeleteCompanyPrefernces,
            }}
          >
            <SubscriptionContext.Provider
              value={{
                isAllowedToAddNewCompany: jest.fn(),
              }}
            >
              <UploadExcel />
            </SubscriptionContext.Provider>
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    AxiosMock.post.mockResolvedValueOnce({
      data: {
        name: "tes",
      },
    });

    const startMonthSelectInput = screen.getByTestId("fiscal-year-start-month");
    const frequencySelectInput = screen.getByTestId("period-frequency");

    fireEvent.click(startMonthSelectInput);
    fireEvent.click(screen.getByText("January"));

    fireEvent.click(frequencySelectInput);
    fireEvent.click(screen.getByText("Monthly"));

    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      ],
    });

    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockDeleteCompanyPrefernces).toHaveBeenCalledTimes(1);
    });
  });

  it("should submit file and display error", async () => {
    AxiosMock.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          message: "Error",
        },
      },
    });
    jest.useFakeTimers();

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
              selectedCompany: {
                uuid: 1,
              },
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
              setSelectedCompany: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                isAllowedToAddNewCompany: jest.fn(),
              }}
            >
              <UploadExcel />
            </SubscriptionContext.Provider>
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    const startMonthSelectInput = screen.getByTestId("fiscal-year-start-month");
    const frequencySelectInput = screen.getByTestId("period-frequency");

    fireEvent.click(startMonthSelectInput);
    fireEvent.click(screen.getByText("January"));

    fireEvent.click(frequencySelectInput);
    fireEvent.click(screen.getByText("Monthly"));

    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      ],
    });

    await waitFor(() => {
      expect(AxiosMock.post).toBeCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId("failure-message")).toBeInTheDocument();
    });
  });

  it("if the user reach to the max limit of his plan , the request will fail 403", async () => {
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{
            breadCrumbs: [],
            setBreadCrumbs: jest.fn(),
          }}
        >
          <CompaniesContext.Provider
            value={{
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
              companies: [
                {
                  uuid: 1,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
                {
                  uuid: 2,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
                {
                  uuid: 3,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
                {
                  uuid: 4,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
                {
                  uuid: 5,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
              ],
              selectedCompany: {
                uuid: 1,
              },
              setSelectedCompany: jest.fn(),
              deleteCompanyPrefernces: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                isAllowedToAddNewCompany: jest.fn(),
              }}
            >
              <UploadExcel />
            </SubscriptionContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    AxiosMock.post.mockRejectedValueOnce({
      response: {
        status: 403,
        data: {
          detail:
            "You have reached to the max limit. please upgrade your subscription plan.",
        },
      },
    });
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    const startMonthSelectInput = screen.getByTestId("fiscal-year-start-month");
    const frequencySelectInput = screen.getByTestId("period-frequency");

    fireEvent.click(startMonthSelectInput);
    fireEvent.click(screen.getByText("January"));

    fireEvent.click(frequencySelectInput);
    fireEvent.click(screen.getByText("Monthly"));

    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      ],
    });
    const handleResponseErrorSpy = jest.spyOn(
      errorhandling,
      "handleResponseError"
    );
    handleResponseErrorSpy.mockReturnValue();

    expect(screen.getByTestId("Still_Processing_Modal")).toBeInTheDocument();
    await waitFor(() => {
      expect(AxiosMock.post).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(handleResponseErrorSpy).toBeCalledTimes(1);
    });
  });

  it("if the user try to update the company and the calculations is still in progress , the request will fail 406", async () => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    AxiosMock.post.mockRejectedValueOnce({
      response: {
        status: 406,
        data: {
          detail: "error",
        },
      },
    });
    jest.useFakeTimers();

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{
            breadCrumbs: [],
            setBreadCrumbs: jest.fn(),
          }}
        >
          <CompaniesContext.Provider
            value={{
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
              companies: [
                {
                  uuid: 1,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
                {
                  uuid: 2,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
                {
                  uuid: 3,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
                {
                  uuid: 4,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
                {
                  uuid: 5,
                  name: "XPOVI Corporation",
                  data_source: "Excel",
                  modified: "2023-01-31T14:01:24Z",
                },
              ],
              selectedCompany: {
                uuid: 1,
              },
              setSelectedCompany: jest.fn(),
              deleteCompanyPrefernces: jest.fn(),
              setCompanies: jest.fn(),
            }}
          >
            <SubscriptionContext.Provider
              value={{
                isAllowedToAddNewCompany: jest.fn(),
              }}
            >
              <UploadExcel />
            </SubscriptionContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    const startMonthSelectInput = screen.getByTestId("fiscal-year-start-month");
    const frequencySelectInput = screen.getByTestId("period-frequency");

    fireEvent.click(startMonthSelectInput);
    fireEvent.click(screen.getByText("January"));

    fireEvent.click(frequencySelectInput);
    fireEvent.click(screen.getByText("Monthly"));

    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      ],
    });

    await waitFor(() => {
      expect(AxiosMock.post).toBeCalled();
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId("upload_progress_id")
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("Still_Processing_Modal")).toBeInTheDocument();
    });
  });

  it("should submit file, display error and inputs have the same value when trying again", async () => {
    jest.useFakeTimers();

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
              selectedCompany: {
                uuid: 1,
              },
              isTimeframeReady: true,
              isAPIPreferencesReady: true,
            }}
          >
            <SubscriptionContext.Provider
              value={{
                isAllowedToAddNewCompany: jest.fn(),
              }}
            >
              <UploadExcel />
            </SubscriptionContext.Provider>
          </CompaniesContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    AxiosMock.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          message: "Error",
        },
      },
    });

    const startMonthSelectInput = screen.getByTestId("fiscal-year-start-month");
    const frequencySelectInput = screen.getByTestId("period-frequency");

    fireEvent.click(startMonthSelectInput);
    fireEvent.click(screen.getByText("January"));

    fireEvent.click(frequencySelectInput);
    fireEvent.click(screen.getByText("Monthly"));

    await waitFor(() => {
      expect(screen.getAllByText("January")).toHaveLength(2);
    });

    await waitFor(() => {
      expect(screen.getAllByText("Monthly")).toHaveLength(2);
    });

    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      ],
    });

    expect(AxiosMock.post).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId("failure-message")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("try-upload-again")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("try-upload-again"));
    });
    await waitFor(() => {
      expect(screen.getByText("January")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Monthly")).toBeInTheDocument();
    });
  });

  it("the tutorial button is exist and when click on it the getVideo method will be called", async () => {
    const getVideo = jest.fn();
    render(
      <BreadcrumbsContext.Provider
        value={{
          breadCrumbs: [],
          setBreadCrumbs: jest.fn(),
        }}
      >
        <BrowserRouter>
          <TutorialVideosContext.Provider value={{ getVideo }}>
            <CompaniesContext.Provider
              value={{
                selectedCompany: {
                  uuid: 1,
                },
                isTimeframeReady: true,
                isAPIPreferencesReady: true,
              }}
            >
              <SubscriptionContext.Provider
                value={{
                  isAllowedToAddNewCompany: jest.fn(),
                }}
              >
                <UploadExcel />
              </SubscriptionContext.Provider>
            </CompaniesContext.Provider>
          </TutorialVideosContext.Provider>
        </BrowserRouter>
      </BreadcrumbsContext.Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("TutorialVideoOutline_btn")
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("TutorialVideoOutline_btn"));
    await waitFor(() => {
      expect(getVideo).toBeCalled();
    });
  });
});
