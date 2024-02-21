import React, { createContext, useState, useContext, useEffect } from "react";
import { CompaniesContext } from "./CompaniesContext";

const CompanyPreferencesApiContext = createContext({});

function CompanyPreferencesApiProvider({ children }) {
  const [companyPreferencesApi, setCompanyPreferencesApi] = useState(null);
  const { selectedCompany, setIsAPIPreferencesReady } =
    useContext(CompaniesContext);
  const defaultValue = {
    isStandardPL: true, // standard/EBITDA in the P&L
    viewBS: { value: "Management accounts", testId: "Accounts" },
    viewPL: { value: "Management accounts", testId: "Accounts" },
    currentViewCashFlow: {
      value: "Cash Flow (CFO - CFI - CFF)",
      testId: "Cash Flow",
    },
    KPIFilter: "all", // will be one of all ,on_track ,off_track,alert
    selectedMetricsTA: [], // list of selected metrics in trend analyis
    hideYoYPL: false,
    hideYoYBS: false,
    hideYoYCF: false,
    hideKPIBudget: false,
    hideYoYSeg: false,
  };

  const getCompanyAPIPreferences = (companyUUID) => {
    if (localStorage.getItem(`${companyUUID}_api`)) {
      setCompanyPreferencesApi(
        JSON.parse(localStorage.getItem(`${companyUUID}_api`))
      );
    } else {
      localStorage.setItem(`${companyUUID}_api`, JSON.stringify(defaultValue));
      setCompanyPreferencesApi(defaultValue);
    }
    setIsAPIPreferencesReady(true);
  };

  const setCompanyAPIPreferences = (data) => {
    if (selectedCompany) {
      setCompanyPreferencesApi(data);

      localStorage.setItem(
        `${selectedCompany?.uuid}_api`,
        JSON.stringify(data)
      );
    }
  };

  return (
    <CompanyPreferencesApiContext.Provider
      value={{
        companyPreferencesApi,
        getCompanyAPIPreferences,
        setCompanyAPIPreferences,
      }}
    >
      {children}
    </CompanyPreferencesApiContext.Provider>
  );
}

export { CompanyPreferencesApiProvider, CompanyPreferencesApiContext };
