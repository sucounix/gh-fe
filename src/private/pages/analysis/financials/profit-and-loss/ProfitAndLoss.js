import { Center, Loader } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useContext, useState, useLayoutEffect } from "react";
import { handleResponseError } from "../../../../../utils/errorHandling";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { notifications } from "@mantine/notifications";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";
import TableComponent from "../../../../../components/table/Table";
import ProfitAndLossFilter from "./ProfitAndLossFilter";
import CompanyLoading from "../../../../components/company-loading/CompanyLoading";
import "./style/ProfitAndLoss.scss";

const ProfitAndLoss = () => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(null);

  const { companyPreferencesFilter } = useContext(
    CompanyPreferencesFilterContext
  );
  const { timeFrameResult } = useContext(TimeFrameContext);
  const {
    selectedCompany,
    isTimeframeReady,
    isAPIPreferencesReady,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);
  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    if (
      timeFrameResult &&
      companyPreferencesApi &&
      isTimeframeReady &&
      isAPIPreferencesReady &&
      isSelectedCompanyReady
    ) {
      setLoading(true);
      axios
        .get(`/analysis/analysis_statement/${selectedCompany.uuid}/`, {
          params: {
            financial_year: timeFrameResult.actual_year,
            period:
              timeFrameResult.period &&
              timeFrameResult.frequency_period !== "annual"
                ? timeFrameResult.period
                : timeFrameResult.actual_year,
            is_hide: companyPreferencesApi?.hideYoYPL,
            analysis_statement: "Profit & Loss",
            view_type: companyPreferencesApi.viewPL?.value,
            view_name: companyPreferencesApi.isStandardPL
              ? "Standard"
              : "EBITDA",
          },
        })
        .then((res) => {
          setTableData(res.data);
        })
        .catch((e) => {
          handleResponseError(e);
          notifications?.show({
            title: "Error",
            message: "An error occured while fetching data",
            color: "red",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    timeFrameResult,
    companyPreferencesApi,
    isTimeframeReady,
    isAPIPreferencesReady,
    isSelectedCompanyReady,
  ]);
  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="Profit and loss" />;
  }

  return (
    <>
      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        companyPreferencesApi &&
        companyPreferencesFilter &&
        timeFrameResult && (
          <div className="pl__wrapper" data-testid="pl__wrapper">
            <ProfitAndLossFilter />
            <div style={{ marginTop: "20px" }}>
              {tableData && (
                <TableComponent
                  data={tableData}
                  testIdSuffix="PL"
                  headerTestId={`header_PL_${companyPreferencesApi.viewPL?.testId}`}
                />
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};
export default ProfitAndLoss;
