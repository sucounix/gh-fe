import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import axios from "axios";
import "./style/TrendAnalysis.scss";
import SelectTimeFrame from "../../../components/select-time-frame/SelectTimeFrame";
import { useParams } from "react-router-dom";
import { handleResponseError } from "../../../../utils/errorHandling";
import { Flex, Loader } from "@mantine/core";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import TrendAnalysisFilter from "./TrendAnalysisFilter";
import TrendAnalysisMetrics from "./TrendAnalysisMetrics";
import TrendAnalysisChart from "./TrendAnalysisChart";
import TrendAnalysisTable from "./TrendAnalysisTable";
import CompanyLoading from "../../../components/company-loading/CompanyLoading";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import ReportCTA from "../../../../components/report-cta/ReportCTA";

const TrendAnalysis = () => {
  const params = useParams();
  const {
    selectedCompany,
    fetchSelectedCompany,
    isSelectedCompanyReady,
    isTimeframeReady,
    isAPIPreferencesReady,
  } = useContext(CompaniesContext);

  const { timeFrameResult, timeFrameRequestData, handleSelectTimeFrame } =
    useContext(TimeFrameContext);

  const { companyPreferencesApi, setCompanyAPIPreferences } = useContext(
    CompanyPreferencesApiContext
  );

  const { companyPreferencesFilter, setCompanyFilterPreferences } = useContext(
    CompanyPreferencesFilterContext
  );

  const [metricsData, setMetricsData] = useState([]);

  // this will contain the total revenue metric to be selected by default
  const [defaultMetricSelected, setDefaultMetricSelected] = useState(null);
  const [chartData, setChartData] = useState([]);
  // {currentYAxisUnits} is a set will contain the types of the y-axis
  // the max length should be 2
  const [currentYAxisUnits, setCurrentYAxisUnits] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDataChart, setLoadingDataChart] = useState(false);
  const [loadingDataTable, setLoadingDataTable] = useState(false);
  const [chartColors] = useState([
    "#00A0B6",
    "#E580C3",
    "#8449FF",
    "#FF9585",
    "#726D47",
  ]);

  // array of objects
  // [
  //   {
  //     name: "Profit",
  //     required: [
  //       {
  //         uuid: "6c9e3611-e17b-4f4c-8602-ee01e97747f9",
  //         name: "Total Revenues",
  //         type: "Percentage",
  //         is_kpi: true,
  //       },
  //       ....
  //     ],
  //   },
  // ];
  const [predefinedChartData, setPredefinedChartData] = useState([]);
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);

  useLayoutEffect(() => {
    setBreadCrumbs([{ title: "Analysis" }, { title: "Trend Analysis" }]);
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    fetchPrerequisetes();
  }, [selectedCompany]);

  useEffect(() => {
    if (
      companyPreferencesApi &&
      companyPreferencesApi.selectedMetricsTA.length > 0 &&
      isTimeframeReady &&
      isAPIPreferencesReady &&
      isSelectedCompanyReady
    ) {
      // fetch charts of the selected metrics
      fetchCharts();
    }
  }, [
    companyPreferencesApi,
    timeFrameResult,
    isTimeframeReady,
    isAPIPreferencesReady,
    isSelectedCompanyReady,
  ]);

  useEffect(() => {
    if (
      defaultMetricSelected &&
      companyPreferencesApi &&
      companyPreferencesApi.selectedMetricsTA &&
      companyPreferencesApi.selectedMetricsTA.length === 0
    ) {
      initializeDefaultMetricsSelected(defaultMetricSelected);
    }
  }, [defaultMetricSelected, companyPreferencesApi]);

  // this function will fetch "predefined_chart" and "metrics":
  // save the metric data in {metricsData} state and save the default metric (Total Revenue) in {defaultMetricSelected} state
  const fetchPrerequisetes = () => {
    setLoadingDataChart(true);
    setLoadingDataTable(true);
    axios
      .get(`analysis/trend_analysis/${selectedCompany.uuid}/`)
      .then((res) => {
        let defaultMetric =
          res.data.metrics[0].children[0].sections[0].items.slice(-1);
        if (defaultMetric.length > 0) {
          setDefaultMetricSelected(defaultMetric);
        }

        setMetricsData(res.data.metrics);
        setPredefinedChartData([
          ...res.data.predefined_chart,
          { name: "Custom", required: [] },
        ]);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status !== 406) handleResponseError(err);
      });
  };

  // if the selectedMetrics is empty , then i need to fill it with the total revenue
  // with default options (line chart , hide moving avg chart , first color in the list)
  // save them in the localStorage (api,filter)
  const initializeDefaultMetricsSelected = (metric) => {
    let defaultOptions = {
      metricUuid: metric[0].uuid,
      chartType: "line",
      showMovingAvg: false,
      color: chartColors[0],
    };
    setCompanyAPIPreferences({
      ...companyPreferencesApi,
      selectedMetricsTA: metric,
    });
    setCompanyFilterPreferences({
      ...companyPreferencesFilter,
      selectedMetricsOptionsTA: [defaultOptions],
    });
  };

  //this function will take the selected metrics and fetch the charts
  const fetchCharts = () => {
    setLoadingDataChart(true);
    setLoadingDataTable(true);

    axios
      .post(`/analysis/trend_analysis/${selectedCompany.uuid}/`, {
        financial_year: timeFrameResult.actual_year,
        period:
          timeFrameResult.period &&
          timeFrameResult.frequency_period !== "annual"
            ? timeFrameResult.period
            : timeFrameResult.actual_year,
        charts:
          companyPreferencesApi &&
          companyPreferencesApi.selectedMetricsTA.length > 0
            ? companyPreferencesApi.selectedMetricsTA.map((metric) => {
                return {
                  uuid: metric.uuid,
                  name: metric.name,
                  type: metric.type,
                  is_kpi: metric.is_kpi,
                };
              })
            : [],
      })
      .then((res) => {
        handleChartObject(res.data);
        handleTableObject(res.data);
      })
      .catch((err) => {
        setLoadingDataChart(false);
        setLoadingDataTable(false);
        handleResponseError(err);
      });
  };

  const handleChartObject = (data) => {
    let chartDataArr = [];

    for (let i = 0; i < data.headers.length; i++) {
      // this will contain {name} , {value} and {moving avg value}
      let currentPeriodValues = {
        name: data.headers[i],
      };
      for (let j = 0; j < data.charts.length; j++) {
        currentPeriodValues[data.charts[j].chart_name] =
          data.charts[j].values[i].standard;
        currentPeriodValues[`${data.charts[j].chart_name} moving avg`] =
          data.charts[j].values[i].moving_average;
      }
      chartDataArr.push(currentPeriodValues);
    }
    // handle the current y-axis units
    // should the max length equal 2
    let yAxisTypes = new Set();
    for (let i = 0; i < companyPreferencesApi?.selectedMetricsTA.length; i++) {
      yAxisTypes.add(companyPreferencesApi.selectedMetricsTA[i].type);
    }

    setCurrentYAxisUnits(yAxisTypes);
    setChartData(chartDataArr);
    setLoadingDataChart(false);
  };

  const handleTableObject = (data) => {
    let tableDataArr = [];
    for (let i = 0; i < data.headers.length; i++) {
      // this will contain {name} , {value} and {moving avg value}
      let currentPeriodValues = {
        name: data.headers[i],
      };
      for (let j = 0; j < data.charts.length; j++) {
        currentPeriodValues[data.charts[j].chart_name] = {
          value: data.charts[j].values[i].standard,
          type: data.charts[j].type,
        };
      }
      tableDataArr.push(currentPeriodValues);
    }
    setTableData(tableDataArr);
    setLoadingDataTable(false);
  };

  // check if the chart type now is line/bar
  // will update it in {TrendAnalysisMetrics} component
  // and use it in {TrendAnalysisChart} component
  const isLine = (metric) => {
    let metrics_matched =
      companyPreferencesFilter.selectedMetricsOptionsTA.find((metricItem) => {
        return metricItem.metricUuid === metric.uuid;
      });
    if (metrics_matched && metrics_matched.chartType === "line") return true;
    return false;
  };

  const isShowMovingAvg = (metric) => {
    let metrics_matched =
      companyPreferencesFilter.selectedMetricsOptionsTA.find((metricItem) => {
        return metricItem.metricUuid === metric.uuid;
      });
    if (metrics_matched) return metrics_matched.showMovingAvg;
    return false;
  };

  const getColor = (metric) => {
    let metrics_matched =
      companyPreferencesFilter.selectedMetricsOptionsTA.find((metricItem) => {
        return metricItem.metricUuid === metric.uuid;
      });
    if (metrics_matched) return metrics_matched.color;
    return false;
  };

  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="Trend Analysis" />;
  }

  return (
    <div className="trendAnalysis">
      <ReportCTA page="trend" />
      <div className="trend__analysis__header">
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
      {loading ? (
        <Flex align={"center"} justify="center" h="100%">
          <Loader />
        </Flex>
      ) : (
        <div className="trend__analysis__content">
          <TrendAnalysisFilter
            predefinedChartData={predefinedChartData}
            chartColors={chartColors}
          />
          <TrendAnalysisMetrics
            metricsData={metricsData}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLine}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
          {loadingDataTable || loadingDataChart ? (
            <Flex align={"center"} justify="center" h="100%" mt="10%">
              <Loader />
            </Flex>
          ) : (
            chartData.length > 0 &&
            (companyPreferencesFilter ? (
              companyPreferencesFilter.viewChartTA ? (
                <TrendAnalysisChart
                  chartData={chartData}
                  currentYAxisUnits={currentYAxisUnits}
                  isLine={isLine}
                  isShowMovingAvg={isShowMovingAvg}
                  getColor={getColor}
                />
              ) : (
                <TrendAnalysisTable
                  data={tableData}
                  selectedPredefinedChartName={
                    companyPreferencesFilter?.predefineChartTA
                  }
                />
              )
            ) : null)
          )}
        </div>
      )}
    </div>
  );
};
export default TrendAnalysis;
