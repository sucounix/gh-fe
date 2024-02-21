import React, { useContext } from "react";
import { Checkbox, Flex, Menu } from "@mantine/core";
import DropdownMultiColumns from "../../../components/dropdown-multi-columns/DropdownMultiColumns";
import barchart from "../../../../assets/images/barchart.png";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import "./style/TrendAnalysis.scss";

const TrendAnalysisMetrics = ({
  metricsData,
  currentYAxisUnits,
  isLine,
  isShowMovingAvg,
  chartColors,
}) => {
  const { companyPreferencesApi, setCompanyAPIPreferences } = useContext(
    CompanyPreferencesApiContext
  );
  const { companyPreferencesFilter, setCompanyFilterPreferences } = useContext(
    CompanyPreferencesFilterContext
  );

  // remove a selected metric
  const removeMetric = (metricIndex) => {
    // remove the metric
    let selectedMetricsCopy = [...companyPreferencesApi.selectedMetricsTA];
    selectedMetricsCopy.splice(metricIndex, 1);
    setCompanyAPIPreferences({
      ...companyPreferencesApi,
      selectedMetricsTA: selectedMetricsCopy,
    });

    // remove its the option
    let selectMetricOptionsCopy = [
      ...companyPreferencesFilter.selectedMetricsOptionsTA,
    ];
    selectMetricOptionsCopy.splice(metricIndex, 1);
    for (let i = 0; i < selectMetricOptionsCopy.length; i++) {
      selectMetricOptionsCopy[i].color = chartColors[i];
    }

    setCompanyFilterPreferences({
      ...companyPreferencesFilter,
      selectedMetricsOptionsTA: selectMetricOptionsCopy,
      predefineChartTA: "Custom",
    });
  };

  const handleAddNewMetric = (new_metric) => {
    let new_metric_options = {
      metricUuid: new_metric.uuid,
      chartType: "line",
      showMovingAvg: false,
      color: chartColors[companyPreferencesApi.selectedMetricsTA.length],
    };
    setCompanyFilterPreferences({
      ...companyPreferencesFilter,
      selectedMetricsOptionsTA: [
        ...companyPreferencesFilter.selectedMetricsOptionsTA,
        new_metric_options,
      ],
      predefineChartTA: "Custom",
    });

    setCompanyAPIPreferences({
      ...companyPreferencesApi,
      selectedMetricsTA: [
        ...companyPreferencesApi.selectedMetricsTA,
        new_metric,
      ],
    });
  };

  const handleViewMovingAvg = (value, metricUuid) => {
    let selectMetricOptionsCopy = [
      ...companyPreferencesFilter.selectedMetricsOptionsTA,
    ];
    let index = selectMetricOptionsCopy.findIndex((item) => {
      if (item.metricUuid === metricUuid) return item;
    });
    selectMetricOptionsCopy[index].showMovingAvg = value;

    setCompanyFilterPreferences({
      ...companyPreferencesFilter,
      selectedMetricsOptionsTA: selectMetricOptionsCopy,
    });
  };

  const handleChangeChartType = (newType, metricUuid) => {
    let selectMetricOptionsCopy = [
      ...companyPreferencesFilter.selectedMetricsOptionsTA,
    ];
    let index = selectMetricOptionsCopy.findIndex((item) => {
      if (item.metricUuid === metricUuid) return item;
    });
    selectMetricOptionsCopy[index].chartType = newType;

    setCompanyFilterPreferences({
      ...companyPreferencesFilter,
      selectedMetricsOptionsTA: selectMetricOptionsCopy,
    });
  };

  return (
    <>
      <div className="metrics__div" data-testid="trend-analysis-metrics">
        {companyPreferencesApi &&
          companyPreferencesApi.selectedMetricsTA.length > 0 &&
          companyPreferencesApi.selectedMetricsTA.map((metric, metricIndex) => {
            return (
              <Flex
                justify="center"
                align="center"
                key={`metric_selected_${metricIndex}`}
                className="single__metric__flex"
              >
                <Menu position="bottom-start">
                  <div className={"single__metric__div"}>
                    <Menu.Target data-testid={`metric_target_${metricIndex}`}>
                      <div>
                        <div className="select__div">
                          <p
                            className="singleMetric"
                            data-testid={`selected_metric_${metric.name}`}
                          >
                            {metric.name.length > 10
                              ? `${metric.name.substr(0, 10)}...`
                              : metric.name}
                            <i className="fas fa-angle-down arrow"></i>
                          </p>
                        </div>
                      </div>
                    </Menu.Target>
                    <div
                      className="remove__metric"
                      data-testid={`remove_metric_${metricIndex}`}
                      onClick={() => {
                        removeMetric(metricIndex);
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i>&nbsp;Remove
                    </div>
                  </div>
                  <Menu.Dropdown>
                    <div
                      className="title__menu__div"
                      data-testid={`title__menu__div_${metricIndex}`}
                    >
                      <p>Chart settings</p>
                    </div>
                    {/* line chart  */}
                    <Menu.Item>
                      <div
                        className={
                          isLine(metric) ? "active__chart__type" : "chart__type"
                        }
                        onClick={() =>
                          handleChangeChartType("line", metric.uuid)
                        }
                        data-testid={`line_chart_${metricIndex}`}
                      >
                        <span>
                          <i className="fa-regular fa-chart-line"></i>
                        </span>
                        <span> Line chart</span>
                      </div>
                    </Menu.Item>
                    {/* bar chart  */}
                    <Menu.Item>
                      <div
                        className={
                          !isLine(metric)
                            ? "active__chart__type"
                            : "chart__type"
                        }
                        onClick={() =>
                          handleChangeChartType("bar", metric.uuid)
                        }
                        data-testid={`bar_chart_${metricIndex}`}
                      >
                        <span>
                          <img src={barchart} alt="barchart" />
                        </span>
                        <span> bar chart</span>
                      </div>
                    </Menu.Item>
                    <div className="seperator__div"></div>
                    {/* moving avg  */}
                    <Menu.Item>
                      <div className="moving__avg__div">
                        <Checkbox
                          label="Moving average"
                          checked={isShowMovingAvg(metric)}
                          onChange={(e) => {
                            handleViewMovingAvg(e.target.checked, metric.uuid);
                          }}
                          data-testid={`mvg_avg_${metricIndex}`}
                        />
                      </div>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                {metricIndex < 4 && <div className="seperator"></div>}
              </Flex>
            );
          })}
        {companyPreferencesApi &&
          companyPreferencesApi.selectedMetricsTA.length < 5 && (
            <div className="add__metric__div" data-testid="add__metric__div">
              <DropdownMultiColumns
                currentList={companyPreferencesApi?.selectedMetricsTA}
                handleAddNewMetric={handleAddNewMetric}
                currentYAxisUnits={currentYAxisUnits} // ["Number", "Percentage", "Monetary"]
                labelComponent={
                  <div
                    style={{
                      width: "max-content",
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>&nbsp; Add a metric
                  </div>
                }
                data={metricsData}
              />
            </div>
          )}
      </div>
    </>
  );
};

export default TrendAnalysisMetrics;
