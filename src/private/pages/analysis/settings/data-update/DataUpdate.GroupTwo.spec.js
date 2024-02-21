import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AxiosMock from "axios";
import DataUpdate from "./DataUpdate";
import { BrowserRouter } from "react-router-dom";
import {
  uploadData,
  uploadDataQuickbooks,
  kpiData,
  listOfYearsKPIs,
} from "./DummyData";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";

jest.mock("axios");
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
  useParams: () => ({
    companyId: "123",
  }),
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("data update page index", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetch data and when click on edit period , the modal should appear", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: uploadData }),
      AxiosMock.get.mockResolvedValueOnce({ data: kpiData }),
    ]);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              is_kpi_ready: false,
              currency: "USD",
            },
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <DataUpdate />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      const edit_period_btn = screen.getByTestId("edit_period_btn");
      // eslint-disable-next-line
      fireEvent.click(edit_period_btn);
      expect(screen.getByTestId("edit_Period_modal")).toBeInTheDocument();
    });
  });

  it("when click on update financial data,the modal will appear,then if confirmed should redirect to upload screen", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: uploadData }),
      AxiosMock.get.mockResolvedValueOnce({ data: kpiData }),
    ]);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              is_kpi_ready: false,
              currency: "USD",
            },
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <DataUpdate />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      const update_excel_data = screen.getByTestId("update_excel_data");
      // eslint-disable-next-line
      fireEvent.click(update_excel_data);
    });
    await waitFor(() => {
      const confirm_replace_data_modal = screen.getByTestId(
        "confirm_replace_data_modal"
      );
      expect(confirm_replace_data_modal).toBeInTheDocument();
    });
    await waitFor(() => {
      const confirm_replace_btn = screen.getByTestId("confirm_replace_btn");
      // eslint-disable-next-line
      fireEvent.click(confirm_replace_btn);

      expect(mockedUsedNavigate).toHaveBeenCalledWith("/upload/excel", {
        state: { companyId: "123" },
      });
    });
  });

  it("when click on update breakdown data, should redirect to upload screen", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: uploadData }),
      AxiosMock.get.mockResolvedValueOnce({ data: kpiData }),
    ]);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              is_kpi_ready: false,
              currency: "USD",
            },
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <DataUpdate />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      const edit_period_btn = screen.getByTestId("breakdown_upload_link");
      // eslint-disable-next-line
      fireEvent.click(edit_period_btn);
      expect(window.location.href).toEqual(
        "http://localhost/company/123/analysis/segmentation-analysis"
      );
    });
  });

  it("when edit the period , the request should call", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: uploadData }),
      AxiosMock.get.mockResolvedValueOnce({ data: kpiData }),
      AxiosMock.post.mockResolvedValueOnce({ data: ["Jan 2022"] }),
    ]);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              is_kpi_ready: false,
              currency: "USD",
            },
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <TimeFrameContext.Provider
            value={{
              fetchTimeFrame: jest.fn(),
            }}
          >
            <DataUpdate />
          </TimeFrameContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      const edit_period_btn = screen.getByTestId("edit_period_btn");
      // eslint-disable-next-line
      fireEvent.click(edit_period_btn);
    });
    await waitFor(() => {
      const confirm_replace_data_modal = screen.getByTestId(
        "confirm_replace_data_modal"
      );
      expect(confirm_replace_data_modal).toBeInTheDocument();
    });
    await waitFor(() => {
      const confirm_replace_btn = screen.getByTestId("confirm_replace_btn");
      // eslint-disable-next-line
      fireEvent.click(confirm_replace_btn);
      expect(screen.getByTestId("edit_Period_modal")).toBeInTheDocument();
    });

    await waitFor(() => {
      const before_option = screen.getByTestId("before");
      // eslint-disable-next-line
      fireEvent.click(before_option);
    });
    await waitFor(() => {
      const confirm_change_period_btn = screen.getByTestId(
        "confirm_change_period_btn"
      );
      // eslint-disable-next-line
      fireEvent.click(confirm_change_period_btn);
      expect(AxiosMock.post).toHaveBeenCalledTimes(1);
    });
  });

  it("when fetch non-finacial kpi , the UI is render", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: uploadData }),
      AxiosMock.get.mockResolvedValueOnce({ data: listOfYearsKPIs }),
      AxiosMock.get.mockResolvedValueOnce({ data: kpiData }),
    ]);

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              is_kpi_ready: true,
              currency: "USD",
            },
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <DataUpdate />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      const non_finacail_kpi = screen.getByTestId("non_finacail_kpi");
      expect(non_finacail_kpi).toBeInTheDocument();
    });
  });

  it("when click on dots, the modal is appear", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: uploadData }),
      AxiosMock.get.mockResolvedValueOnce({ data: listOfYearsKPIs }),
      AxiosMock.get.mockResolvedValueOnce({ data: kpiData }),
    ]);
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              is_kpi_ready: true,
              currency: "USD",
            },
            fetchSelectedCompany: jest.fn(),
            isSelectedCompanyReady: true,
          }}
        >
          <DataUpdate />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      const non_finacail_kpi = screen.getByTestId("non_finacail_kpi");
      expect(non_finacail_kpi).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("menu__target__0__0")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("menu__target__0__0"));
    });
    await waitFor(() => {
      const adjust__modal__kpi = screen.getByTestId("adjust__modal__kpi__0__0");
      expect(adjust__modal__kpi).toBeInTheDocument();
    });
  });

  it("when change value and  click on save button , the request is called", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: uploadData }),
      AxiosMock.get.mockResolvedValueOnce({ data: listOfYearsKPIs }),
      AxiosMock.get.mockResolvedValueOnce({ data: kpiData }),
    ]);
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider value={{ fetchTimeFrame: jest.fn() }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
                is_kpi_ready: true,
                data_source: "Excel", //# Excel or Quickbooks
                currency: "USD",
              },
              fetchSelectedCompany: jest.fn(),
              isSelectedCompanyReady: true,
            }}
          >
            <DataUpdate />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      const non_finacail_kpi = screen.getByTestId("non_finacail_kpi");
      expect(non_finacail_kpi).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("save_button_fixed")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("menu__target__0__0")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("menu__target__0__0"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("percentage_modify__0__0")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("percentage_modify__0__0"));
    });
    await waitFor(() => {
      const adjust__modal__kpi = screen.getByTestId("adjust__modal__kpi__0__0");
      expect(adjust__modal__kpi).toBeInTheDocument();
    });
    await waitFor(() => {
      // eslint-disable-next-line
      fireEvent.change(screen.getByTestId("variable__input__adjust"), {
        target: { value: 12 },
      });
      expect(screen.getByTestId("variable__input__adjust").value).toEqual("12");
    });
    await waitFor(() => {
      expect(screen.getByTestId("save_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("save_btn"));
    AxiosMock.put.mockResolvedValueOnce({ data: kpiData });
    await waitFor(() => {
      expect(screen.getByTestId("save_button_fixed")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("save_button_fixed"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalled();
    });
  });

  it("if the company with type Quickbooks , then the day periodically update dropdown should appear", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: uploadDataQuickbooks }),
      AxiosMock.get.mockResolvedValueOnce({ data: kpiData }),
    ]);

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            fetchTimeFrame: jest.fn(),
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
                is_kpi_ready: false,
                periodically_update: 5,
                currency: "USD",
                data_source: "Quickbooks",
                modified: "2020-01-01 20:10:06",
              },
              fetchSelectedCompany: jest.fn(),
              isSelectedCompanyReady: true,
            }}
          >
            <DataUpdate />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      const periodically__update__select = screen.getByTestId(
        "periodically__update__select"
      );
      expect(periodically__update__select).toBeInTheDocument();
    });
  });

  it("when user update the quickbooks data , should render the modal to take the data period", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({ data: uploadDataQuickbooks }),
      AxiosMock.get.mockResolvedValueOnce({ data: kpiData }),
    ]);

    render(
      <BrowserRouter>
        <TimeFrameContext.Provider
          value={{
            fetchTimeFrame: jest.fn(),
          }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
                is_kpi_ready: false,
                periodically_update: 5,
                currency: "USD",
                data_source: "Quickbooks",
                modified: "2020-01-01 20:10:06",
              },
              fetchSelectedCompany: jest.fn(),
              isSelectedCompanyReady: true,
            }}
          >
            <DataUpdate />
          </CompaniesContext.Provider>
        </TimeFrameContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      const update__quickbooks__data__btn = screen.getByTestId(
        "update__quickbooks__data__btn"
      );
      // eslint-disable-next-line
      fireEvent.click(update__quickbooks__data__btn);

      expect(screen.getByTestId("Q__date__period__modal")).toBeInTheDocument();
    });
  });
});
