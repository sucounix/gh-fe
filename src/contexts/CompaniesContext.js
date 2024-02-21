import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { handleResponseError } from "../utils/errorHandling";
import { SubscriptionContext } from "./SubscriptionContext";

const CompaniesContext = createContext({});

function CompaniesProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [isSelectedCompanyReady, setIsSelectedCompanyReady] = useState(false);
  const [isTimeframeReady, setIsTimeframeReady] = useState(false);
  const [isAPIPreferencesReady, setIsAPIPreferencesReady] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(
    localStorage.getItem("selectedCompanyId")
      ? JSON.parse(localStorage.getItem("selectedCompanyId"))
      : null
  );
  const { subscriptionInfo } = useContext(SubscriptionContext);

  useEffect(() => {
    if (subscriptionInfo) fetchCompanyList();
  }, [subscriptionInfo]);

  const fetchCompanyList = (
    // {updateSelectedCompany} will be {false} in 2 cases
    // --> deleting a company and this company is not a selected company
    // --> fetch the company list in the finanical page
    updateSelectedCompany = true,
    takeFirstItem = false //will be true when delete company then will take the first compnay as a selected compnay
  ) => {
    axios
      .get("company/")
      .then((res) => {
        setCompanies(res.data);
        if (res.data.length > 0) {
          if (updateSelectedCompany) {
            if (!selectedCompany || takeFirstItem) {
              setSelectedCompany(res.data[0]);
              localStorage.setItem(
                "selectedCompanyId",
                JSON.stringify(res.data[0])
              );
            } else {
              let currentSelectedCompany = res.data.find(
                (company) => company.uuid === selectedCompany.uuid
              );
              // in case the selected company became disabled after the downgrade
              // then we should replace it with the first company
              // because the first company will always enable
              if (
                currentSelectedCompany &&
                !currentSelectedCompany.is_enabled
              ) {
                setSelectedCompany(res.data[0]);
              } else {
                setSelectedCompany(currentSelectedCompany);
              }
            }
          } else {
            if (localStorage.getItem("selectedCompanyId")) {
              // will filter the response with the saved company in LocalStorage
              // so if this company has any updated flag will notice it
              setSelectedCompany(
                res.data.find((company) => {
                  return (
                    company.uuid ===
                    JSON.parse(localStorage.getItem("selectedCompanyId")).uuid
                  );
                })
              );
            }
          }
        } else {
          setSelectedCompany(null);

          localStorage.removeItem(`selectedCompanyId`);
        }
      })
      .catch((err) => {
        handleResponseError(err);
      });
  };

  const fetchSelectedCompany = () => {
    axios
      .get(`company/${selectedCompany?.uuid}/`)
      .then((res) => {
        setSelectedCompany(res?.data);
        localStorage.setItem("selectedCompanyId", JSON.stringify(res?.data));
        setIsSelectedCompanyReady(checkWhetherCompanyIsDone(res?.data));
      })
      .catch((error) => {
        setIsSelectedCompanyReady(false);
        handleResponseError(error);
      });
  };
  // will call this method twice
  // --> when delete a company from home page
  // --> when update data for a company (the backend create new one with a new UUID)
  // so should delete the old one
  const deleteCompanyPrefernces = (companyUUID) => {
    localStorage.removeItem(`${companyUUID}_companyFreq`);
    localStorage.removeItem(`${companyUUID}_freq_timeframe`);
    localStorage.removeItem(`${companyUUID}_filter`);
    localStorage.removeItem(`${companyUUID}_api`);
  };

  const checkWhetherCompanyIsDone = (currentCompany = null) => {
    let currentSelectedCompany = currentCompany
      ? currentCompany
      : selectedCompany;

    if (
      currentSelectedCompany &&
      currentSelectedCompany.is_kpi_ready &&
      currentSelectedCompany.is_alert_ready &&
      currentSelectedCompany.is_budget_ready &&
      currentSelectedCompany.is_analysis_ready
    )
      return true;
    return false;
  };
  return (
    <CompaniesContext.Provider
      value={{
        companies,
        selectedCompany,
        setSelectedCompany,
        setCompanies,
        fetchCompanyList,
        deleteCompanyPrefernces,
        checkWhetherCompanyIsDone,
        setIsAPIPreferencesReady,
        setIsTimeframeReady,
        isTimeframeReady,
        isAPIPreferencesReady,
        fetchSelectedCompany,
        isSelectedCompanyReady,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  );
}

export { CompaniesProvider, CompaniesContext };
