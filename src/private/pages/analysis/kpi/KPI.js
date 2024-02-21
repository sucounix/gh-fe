import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import SelectTimeFrame from "../../../components/select-time-frame/SelectTimeFrame";
import KPIFilter from "./KPIFilter";
import axios from "axios";
import { Flex, Loader } from "@mantine/core";
import { handleResponseError } from "../../../../utils/errorHandling";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import RenderEmptySection from "./RenderEmptySection";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import "./style/KPI.scss";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import CompanyLoading from "../../../components/company-loading/CompanyLoading";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { notifications } from "@mantine/notifications";
import TableComponent from "../../../../components/table/Table";
import ReportCTA from "../../../../components/report-cta/ReportCTA";

const KPI = () => {
  const params = useParams();

  const [kpiLoading, setKpiLoading] = useState(true);
  const [isEmptyKpi, setIsEmptyKpi] = useState(false);
  const [tableData, setTableData] = useState(null);

  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);
  const { companyPreferencesFilter } = useContext(
    CompanyPreferencesFilterContext
  );
  const { timeFrameResult, timeFrameRequestData, handleSelectTimeFrame } =
    useContext(TimeFrameContext);

  const { setBreadCrumbs } = useContext(BreadcrumbsContext);
  const {
    selectedCompany,
    isTimeframeReady,
    isAPIPreferencesReady,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);

  useLayoutEffect(() => {
    setBreadCrumbs([{ title: "Analysis" }, { title: "KPI's" }]);
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
      fetchKPI(companyPreferencesApi.KPIFilter);
    }
  }, [
    timeFrameResult,
    companyPreferencesApi,
    params.companyId,
    isTimeframeReady,
    isAPIPreferencesReady,
    isSelectedCompanyReady,
  ]);

  const fetchKPI = (filter) => {
    axios
      .get(`/analysis/analysis_statement/${selectedCompany.uuid}/`, {
        params: {
          financial_year: timeFrameResult.actual_year,
          period: timeFrameResult.period
            ? timeFrameResult.period
            : timeFrameResult.actual_year,
          analysis_statement: "KPIs",
          is_summary: false,
          view_name: filter,
          is_hide: companyPreferencesApi.hideKPIBudget,
        },
      })
      .then((res) => {
        setTableData(res.data);
        setIsEmptyKpi(res.data.rows.length === 0);
        setKpiLoading(false);
      })
      .catch((e) => {
        handleResponseError(e);
        setKpiLoading(false);
        notifications?.show({
          title: "Error",
          message: "An error occured while fetching data",
          color: "red",
        });
      });
  };
  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="KPI's" />;
  }

  return (
    <div className="kpi">
      <ReportCTA page="kpi" />
      <div className="finance__header">
        {timeFrameResult && timeFrameRequestData && (
          <SelectTimeFrame
            companyFrequency={localStorage.getItem(
              `${params.companyId}_companyFreq`
            )}
            timeframe={timeFrameRequestData.timeframe}
            initialValue={timeFrameResult}
            handleSelectTimeFrame={handleSelectTimeFrame}
          />
        )}
      </div>
      <div className="Kpi__content">
        {companyPreferencesApi && companyPreferencesFilter && (
          <KPIFilter
            numOfAlerts={
              tableData?.headers.alerts ? tableData?.headers.alerts : 0
            }
            isEmptyKpi={isEmptyKpi}
          />
        )}
        {kpiLoading || !timeFrameResult ? (
          <Flex align={"center"} justify="center" h="100%" mt="10%">
            <Loader />
          </Flex>
        ) : isEmptyKpi ? (
          <RenderEmptySection />
        ) : (
          <div style={{ marginTop: "20px" }}>
            {tableData && (
              <TableComponent
                data={tableData}
                checkAlerts={true}
                neglectColourColumns={[1, 2, 4]}
                testIdSuffix="KPIs"
                headerTestId={`header_KPIs`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPI;
