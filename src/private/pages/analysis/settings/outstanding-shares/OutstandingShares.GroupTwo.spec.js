import React from "react";
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import AxiosMock from "axios";
import OutstandingShares from "./OutstandingShares";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: 123,
  }),
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Outstanding Shares", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render as fixed value and render the value from backend", async () => {
    await act(() =>
      Promise.all([
        AxiosMock.get.mockResolvedValueOnce({
          data: {
            timeframe: [2022, 2023],
          },
        }),
        AxiosMock.get.mockResolvedValueOnce({
          data: {
            values: [
              { date: 2022, value: 100, uuid: "1" },
              { date: 2023, value: 200, uuid: "2" },
              { date: 2024, value: 300, uuid: "3" },
            ],
          },
        }),
      ])
    );

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          companies: [
            {
              uuid: 123,
              outstanding_shares: "fixed",
            },
          ],
          selectedCompany: {
            uuid: 123,
            currency: "USD",
            outstanding_shares: "fixed",
          },
          setCompanies: jest.fn(),
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        <OutstandingShares />
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("form__content")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("fixed__view")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("fixed_input")).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId("fixed_input"), {
      target: { value: 200 },
    });
    await waitFor(() => {
      expect(screen.getByTestId("save_button_fixed")).toBeInTheDocument();
    });

    await waitFor(() => {
      AxiosMock.put.mockResolvedValueOnce({
        data: {},
      });
    });
    fireEvent.click(screen.getByTestId("save_button_fixed"));

    await waitFor(() => {
      expect(AxiosMock.put).toHaveBeenCalledWith("/analysis/shares/123/", {
        type: "fixed",
        value: 200,
      });
    });
  });

  it("should render variable data if company's variable", async () => {
    await act(() =>
      Promise.all([
        AxiosMock.get.mockResolvedValueOnce({
          data: {
            timeframe: [2022, 2023],
          },
        }),
        AxiosMock.get.mockResolvedValueOnce({
          data: {
            values: [
              { date: 2022, value: 100, uuid: "1" },
              { date: 2023, value: 200, uuid: "2" },
              { date: 2024, value: 300, uuid: "3" },
            ],
          },
        }),
      ])
    );
    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          companies: [
            {
              uuid: 123,
              outstanding_shares: "variable",
            },
          ],
          selectedCompany: {
            uuid: 123,
            currency: "USD",
            outstanding_shares: "variable",
          },
          setCompanies: jest.fn(),
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        <OutstandingShares />
      </CompaniesContext.Provider>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(`analysis/shares/timeframe/123`);
    });
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(`/analysis/shares/123`, {
        params: { type: "variable", year: 2023 },
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("form__content")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("variable__visible")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("single__row__component")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("variable__input__0__0")).toBeInTheDocument();
    });
    const inputs = screen.getAllByTestId("variable__input__0__0");

    await waitFor(() => {
      expect(inputs[0]).toHaveValue(100);
    }).then(() => {
      fireEvent.change(inputs[0], {
        target: { value: 200 },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("save_button_variable")).toBeInTheDocument();
      AxiosMock.put.mockResolvedValueOnce({
        data: {},
      });
    });
  });

  it("should render as fixed value and switch to variable", async () => {
    await act(() =>
      Promise.all([
        AxiosMock.get.mockResolvedValueOnce({
          data: {
            timeframe: [2022, 2023],
          },
        }),
        AxiosMock.get.mockResolvedValueOnce({
          data: {
            type: "fixed",
            value: 100,
          },
        }),
      ])
    );

    window.ResizeObserver = ResizeObserver;

    render(
      <CompaniesContext.Provider
        value={{
          companies: [
            {
              uuid: 123,
              outstanding_shares: "fixed",
            },
          ],
          selectedCompany: {
            uuid: 123,
            currency: "USD",
            outstanding_shares: "fixed",
          },
          setCompanies: jest.fn(),
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
        }}
      >
        <OutstandingShares />
      </CompaniesContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("form__content")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("fixed__view")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("fixed_input")).toBeInTheDocument();
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        values: [
          { date: 2022, value: 100, uuid: "1" },
          { date: 2023, value: 200, uuid: "2" },
          { date: 2024, value: 300, uuid: "3" },
        ],
      },
    });
    await waitFor(() => {
      expect(screen.getByTestId("tab_Fixed Shares")).toBeInTheDocument();
      waitFor(() => {
        // eslint-disable-next-line
        fireEvent.click(screen.getByTestId("set-variable-shares"));
      }).then(() => {
        expect(screen.getByTestId("variable__visible")).toBeInTheDocument();
      });
    });
  });

  it("should render variable data and copy values into future values", async () => {
    await act(() =>
      Promise.all([
        AxiosMock.get.mockResolvedValueOnce({
          data: {
            timeframe: [2022, 2023],
          },
        }),
        AxiosMock.get.mockResolvedValueOnce({
          data: {
            values: [
              { date: 2022, value: 100, uuid: "1" },
              { date: 2023, value: 200, uuid: "2" },
              { date: 2024, value: 300, uuid: "3" },
            ],
          },
        }),
      ])
    );

    window.ResizeObserver = ResizeObserver;
    render(
      <CompaniesContext.Provider
        value={{
          companies: [
            {
              uuid: 123,
              outstanding_shares: "variable",
            },
          ],
          selectedCompany: {
            uuid: 123,
            currency: "USD",
            outstanding_shares: "variable",
          },
          setCompanies: jest.fn(),
          fetchSelectedCompany: jest.fn(),
          isSelectedCompanyReady: true,
          isOSharesTimeframeReady: true,
        }}
      >
        <OutstandingShares />
      </CompaniesContext.Provider>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(`analysis/shares/timeframe/123`);
    });
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalledWith(`/analysis/shares/123`, {
        params: { type: "variable", year: 2023 },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("form__content")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("variable__visible")).toBeInTheDocument();
    });

    const inputs_0 = screen.queryAllByTestId("variable__input__0__0");
    const inputs_1 = screen.queryAllByTestId("variable__input__0__1");
    const inputs_2 = screen.queryAllByTestId("variable__input__0__2");

    await waitFor(() => {
      expect(inputs_0[0]).toHaveValue(100);
    });
    await waitFor(() => {
      expect(inputs_1[0]).toHaveValue(200);
    });
    await waitFor(() => {
      expect(inputs_2[0]).toHaveValue(300);
    });

    fireEvent.click(screen.getByTestId("menu__target__0__0"));
    fireEvent.click(screen.getByTestId("copy__0__0"));
    await waitFor(() => {
      expect(inputs_1[0]).toHaveValue(100);
    });
  });
});
