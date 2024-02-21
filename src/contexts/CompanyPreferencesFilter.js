import React, { createContext, useState, useContext } from "react";
import { CompaniesContext } from "./CompaniesContext";

const CompanyPreferencesFilterContext = createContext({});

function CompanyPreferencesFilterProvider({ children }) {
  const [companyPreferencesFilter, setCompanyPreferencesFilter] =
    useState(null);
  const { selectedCompany } = useContext(CompaniesContext);
  const defaultValue = {
    viewCashFlowWaterFall: false,
    viewEquityPlusLiabilitiesBS: true,
    viewCurrentFirstBS: true,
    showSamePeriodLastYearSeg: true,
    viewChartTA: true, // view chart trend analysis
    selectedMetricsOptionsTA: [], // list of selected metrics in trend analyis
    predefineChartTA: "Custom", //predefind chart in trend analysis
    selectedMetricsSeg: ["Revenue Segmentation"],
  };

  const getCompanyFilterPreferences = (companyUUID) => {
    if (localStorage.getItem(`${companyUUID}_filter`)) {
      setCompanyPreferencesFilter(
        JSON.parse(localStorage.getItem(`${companyUUID}_filter`))
      );
    } else {
      localStorage.setItem(
        `${companyUUID}_filter`,
        JSON.stringify(defaultValue)
      );
      setCompanyPreferencesFilter(defaultValue);
    }
  };

  const setCompanyFilterPreferences = (data) => {
    if (selectedCompany) {
      setCompanyPreferencesFilter(data);

      localStorage.setItem(
        `${selectedCompany?.uuid}_filter`,
        JSON.stringify(data)
      );
    }
  };

  return (
    <CompanyPreferencesFilterContext.Provider
      value={{
        companyPreferencesFilter,
        getCompanyFilterPreferences,
        setCompanyFilterPreferences,
      }}
    >
      {children}
    </CompanyPreferencesFilterContext.Provider>
  );
}

export { CompanyPreferencesFilterProvider, CompanyPreferencesFilterContext };
