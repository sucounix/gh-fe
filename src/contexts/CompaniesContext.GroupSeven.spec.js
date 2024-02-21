import React, { useContext } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CompaniesContext, CompaniesProvider } from "./CompaniesContext";
import { SubscriptionContext } from "./SubscriptionContext";
import AxiosMock from "axios";

jest.mock("axios");

const TestingComponent = () => {
  const {
    companies,
    selectedCompany,
    setSelectedCompany,
    fetchCompanyList,
    deleteCompanyPrefernces,
    checkWhetherCompanyIsDone,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);

  return (
    <div data-testid="children_component">
      <button
        onClick={() => {
          fetchCompanyList(false, false);
        }}
        data-testid="not_update_selected_company"
      >
        Don't update the selected company
      </button>
      <button
        onClick={() => {
          fetchCompanyList(true, false);
        }}
        data-testid="update_selected_company"
      >
        update the selected company
      </button>
      <button
        onClick={fetchSelectedCompany}
        data-testid="fetch_selectd_company_btn"
      >
        fetch selected company
      </button>
      <button
        data-testid="clear_selected_company"
        onClick={() => {
          setSelectedCompany(null);
        }}
      >
        clear selected company
      </button>
      <button
        data-testid="take_first_item"
        onClick={() => {
          fetchCompanyList(true, true);
        }}
      >
        take the first item
      </button>
      <button
        data-testid="delete_Company_Prefernces_btn"
        onClick={deleteCompanyPrefernces}
      >
        delete Company Prefernces
      </button>
      <p data-testid="selected_company_name">{selectedCompany?.name}</p>
      {isSelectedCompanyReady ? (
        <p data-testid="selected_company_ready">
          the selected company is ready
        </p>
      ) : (
        <p data-testid="selected_company_not_ready">
          the selected company isn't ready
        </p>
      )}
      {!checkWhetherCompanyIsDone() ? (
        <p data-testid="calculations_in_progress">
          Calculations still in progress
        </p>
      ) : (
        <p data-testid="calculations_are_done">Calculations are done!</p>
      )}
      <ul>
        {companies?.map((company, compnayIndex) => {
          return (
            <li data-testid={`company_${compnayIndex}`}>{company.name}</li>
          );
        })}
      </ul>
    </div>
  );
};

describe("Companies Context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  const subscriptionInfoData = {
    pricingModal: "Free",
    quantity: 1,
    status: "active",
    planCode: "starter",
  };

  it(" if the local storage contain a selected company, it should be rendered", async () => {
    localStorage.setItem(
      "selectedCompanyId",
      JSON.stringify({
        uuid: "123",
        name: "Company name 0",
        is_enabled: true,
      })
    );

    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: null,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(localStorage.getItem("selectedCompanyId")).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name")).toBeInTheDocument();
    });
  });

  it(" if their is a subscription info data , then should call company list endpoint", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
        },
      ],
    });
    localStorage.setItem("selectedCompanyId", null);

    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
  });

  it("if the company list = [] , should remove the  selectedCompanyId from localstorage", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [],
    });

    window.localStorage.setItem(
      "selectedCompanyId",
      JSON.stringify({ uuid: "123" })
    );
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(window.localStorage.getItem("selectedCompanyId")).toBeNull();
    });
  });

  it("if the updateSelectedCompany flag = false and the local storage contain the selectedCompanyId, then should call setSelectedCompany", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    window.localStorage.setItem(
      "selectedCompanyId",
      JSON.stringify({ uuid: "123" })
    );
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 2",
        },
      ],
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("not_update_selected_company")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("not_update_selected_company"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 2"
      );
    });
  });

  it("if the updateSelectedCompany flag = false and the local storage doesn't contain the selectedCompanyId, then shouldn't call setSelectedCompany", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    window.localStorage.removeItem("selectedCompanyId");
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    window.localStorage.removeItem("selectedCompanyId");

    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 2",
        },
      ],
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("not_update_selected_company")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("not_update_selected_company"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 1"
      );
    });
  });

  it("if the updateSelectedCompany flag = true, will check if the current selected company uuid status is_enabled=true will update the setSelectedCompany with the new response  ", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    localStorage.setItem("selectedCompanyId", null);

    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 2",
        },
      ],
    });
    await waitFor(() => {
      expect(screen.getByTestId("update_selected_company")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("update_selected_company"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 2"
      );
    });
  });

  it("if the updateSelectedCompany flag = true, will check if the current selected company uuid status is_enabled=false will update the setSelectedCompany with the first object in the response", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    localStorage.setItem(
      "selectedCompanyId",
      JSON.stringify({
        uuid: "123",
        is_enabled: true,
      })
    );

    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "456",
          is_enabled: true,
          name: "company name 0",
        },
        {
          uuid: "123",
          is_enabled: false,
          name: "company name 1",
        },
      ],
    });
    await waitFor(() => {
      expect(screen.getByTestId("update_selected_company")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("update_selected_company"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 0"
      );
    });
  });

  it("if the updateSelectedCompany flag = true and their is no selected company , should update setSelectedCompany and the localstorage with the first object in the response", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "455",
          is_enabled: true,
          name: "company name 0",
        },
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    localStorage.setItem("selectedCompanyId", null);

    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("clear_selected_company")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("clear_selected_company"));

    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "456",
          is_enabled: true,
          name: "company name 0",
        },
        {
          uuid: "123",
          is_enabled: false,
          name: "company name 1",
        },
      ],
    });
    await waitFor(() => {
      expect(screen.getByTestId("update_selected_company")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("update_selected_company"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 0"
      );
    });
  });

  it("if the updateSelectedCompany flag = true and their is a selected company but the takeFirstItem flag= true , should update setSelectedCompany and the localstorage with the first object in the response", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    localStorage.setItem("selectedCompanyId", null);

    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "456",
          is_enabled: true,
          name: "company name 0",
        },
        {
          uuid: "123",
          is_enabled: false,
          name: "company name 1",
        },
      ],
    });
    await waitFor(() => {
      expect(screen.getByTestId("take_first_item")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("take_first_item"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 0"
      );
    });
  });

  it("when call deleteCompanyPrefernces method , the localstorage should be clear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    localStorage.setItem("selectedCompanyId", null);

    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("delete_Company_Prefernces_btn")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("delete_Company_Prefernces_btn"));
    await waitFor(() => {
      expect(localStorage.getItem("123_companyFreq")).toBeNull();
    });
    await waitFor(() => {
      expect(localStorage.getItem("123_freq_timeframe")).toBeNull();
    });
    await waitFor(() => {
      expect(localStorage.getItem("123_filter")).toBeNull();
    });
    await waitFor(() => {
      expect(localStorage.getItem("123_api")).toBeNull();
    });
  });

  it("if their is a selected company and any of calculations flag = true , then checkWhetherCompanyIsDone should return true", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          is_budget_ready: true,
          name: "company name 1",
        },
      ],
    });
    localStorage.setItem("selectedCompanyId", null);

    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("calculations_in_progress")
      ).toBeInTheDocument();
    });
  });

  it("if their is a selected company and all the calculations flags = false , then checkWhetherCompanyIsDone should return false  ", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "789",
          is_enabled: true,
          is_kpi_ready: true,
          is_alert_ready: true,
          is_budget_ready: true,
          is_analysis_ready: true,
          name: "company name 4",
        },
      ],
    });
    localStorage.setItem("selectedCompanyId", null);
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 4"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("calculations_are_done")).toBeInTheDocument();
    });
  });

  it("if the fetch company list is failed , the company list shouldn't be rendered  ", async () => {
    AxiosMock.get.mockRejectedValueOnce({});
    localStorage.setItem("selectedCompanyId", null);
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("company_0")).not.toBeInTheDocument();
    });
  });

  it("when call fetchSelectedCompany , the selected company data should be updated", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    window.localStorage.setItem(
      "selectedCompanyId",
      JSON.stringify({ uuid: "123" })
    );
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        uuid: "123",
        is_enabled: true,
        name: "company name 2",
        is_kpi_ready: true,
        is_alert_ready: true,
        is_budget_ready: true,
        is_analysis_ready: true,
      },
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("fetch_selectd_company_btn")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("fetch_selectd_company_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 2"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_ready")).toBeInTheDocument();
    });
  });

  it("when call fetchSelectedCompany ,if the company not ready yet the not ready text should appear", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    window.localStorage.setItem(
      "selectedCompanyId",
      JSON.stringify({ uuid: "123" })
    );
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        uuid: "123",
        is_enabled: true,
        name: "company name 2",
        is_kpi_ready: true,
        is_alert_ready: true,
        is_budget_ready: true,
        is_analysis_ready: false,
      },
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("fetch_selectd_company_btn")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("fetch_selectd_company_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 2"
      );
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("selected_company_not_ready")
      ).toBeInTheDocument();
    });
  });

  it("if the fetchSelectedCompany method was failed , the selected company shouldn't update", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          uuid: "123",
          is_enabled: true,
          name: "company name 1",
        },
      ],
    });
    window.localStorage.setItem(
      "selectedCompanyId",
      JSON.stringify({ uuid: "123" })
    );
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionInfo: subscriptionInfoData,
        }}
      >
        <CompaniesProvider>
          <TestingComponent />
        </CompaniesProvider>
      </SubscriptionContext.Provider>
    );
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(`company/`);
    });
    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    AxiosMock.get.mockRejectedValueOnce({});
    await waitFor(() => {
      expect(
        screen.getByTestId("fetch_selectd_company_btn")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("fetch_selectd_company_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("selected_company_name").textContent).toBe(
        "company name 1"
      );
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("selected_company_not_ready")
      ).toBeInTheDocument();
    });
  });
});
