import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { Flex, Loader } from "@mantine/core";
import CashFlowFilter from "./CashFlowFilter";
import axios from "axios";
import CashFlowWaterfall from "./cash-flow-waterfall/CashFlowWaterfall";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";
import { handleResponseError } from "../../../../../utils/errorHandling";
import { notifications } from "@mantine/notifications";
import TableComponent from "../../../../../components/table/Table";
import CompanyLoading from "../../../../components/company-loading/CompanyLoading";
import "./style/CashFlow.scss";

const CashFlow = () => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(null);

  const { timeFrameResult } = useContext(TimeFrameContext);
  const {
    selectedCompany,
    isTimeframeReady,
    isAPIPreferencesReady,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);
  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);
  const { companyPreferencesFilter } = useContext(
    CompanyPreferencesFilterContext
  );
  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    if (
      companyPreferencesApi &&
      isAPIPreferencesReady &&
      isTimeframeReady &&
      isSelectedCompanyReady
    ) {
      fetchCashFlow();
    }
  }, [
    timeFrameResult,
    companyPreferencesApi,
    isTimeframeReady,
    isAPIPreferencesReady,
    isSelectedCompanyReady,
  ]);

  const fetchCashFlow = () => {
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
          is_hide: companyPreferencesApi?.hideYoYCF,
          analysis_statement: "Cash Flow",
          view_name: companyPreferencesApi.currentViewCashFlow?.value,
        },
      })
      .then((res) => {
        setTableData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        handleResponseError(e);
        setLoading(false);
        notifications?.show({
          title: "Error",
          message: "An error occured while fetching data",
          color: "red",
        });
      });
  };
  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="Cash flow" />;
  }
  return (
    <>
      {companyPreferencesFilter && <CashFlowFilter />}
      <div>
        {loading ? (
          <Flex align={"center"} justify="center" h="100%" mt="10%">
            <Loader />
          </Flex>
        ) : (
          tableData !== null && (
            <>
              {companyPreferencesApi ? (
                companyPreferencesFilter.viewCashFlowWaterFall ? (
                  <>
                    <CashFlowWaterfall cashflowData={tableData} />
                  </>
                ) : (
                  <div style={{ marginTop: "20px" }}>
                    <TableComponent
                      data={tableData}
                      testIdSuffix="CF"
                      headerTestId={`header_CF_${companyPreferencesApi.currentViewCashFlow?.testId}`}
                    />
                  </div>
                )
              ) : null}
            </>
          )
        )}
      </div>
    </>
  );
};

export default CashFlow;
