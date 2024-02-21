import React, { useEffect, useContext, useState } from "react";
import ChartOptions from "./ChartOptions";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";
import axios from "axios";
import { handleResponseError } from "../../../../../../../utils/errorHandling";
import DropdownMultiColumns from "../../../../../../components/dropdown-multi-columns/DropdownMultiColumns";
import ReportTimeframeSelect from "../../../../../../../components/report-timeframe-select/ReportTimeframeSelect";
import { TextInput, Checkbox, Button } from "@mantine/core";
import SingleDropdown from "../../../../../../../components/single-level-dropdown/SingleDropdown";
import { useForm } from "@mantine/form";
import "./style/EditTrendReport.scss";

const EditTrendReport = ({
  data,
  setOpenEditDrawer,
  units,
  loading,
  setLoading,
  handleNewItemInReportDetails,
}) => {
  const [metricsData, setMetricsData] = useState([]);
  const [predefinedChartData, setPredefinedChartData] = useState([]);
  const [listOfUnits, setListOfUnits] = useState(units);

  const { selectedCompany } = useContext(CompaniesContext);

  const form = useForm({
    validate: (values) => {
      const errors = {};
      if (!values.title) {
        errors.title = "Title is required";
      }

      if (values.title && values.title.length > 50) {
        errors.title = "Title must be less than 50 characters";
      }

      if (values.charts && values.charts.length === 0) {
        errors.charts = "Please select at least one chart";
      }

      if (!values.frequency_period) {
        errors.frequency_period = "Time Period is required";
      }

      return errors;
    },
  });

  useEffect(() => {
    initiatedForm(data.chart_item);
    fetchPrerequisetes();
  }, [data]);

  // this function will fetch "predefined_chart" and "metrics":
  // save the metric data in {metricsData} state
  // for the predefined charts => every chart has its {required} list we need to add the default metric options
  // display_type = line and show_moving_average = false
  const fetchPrerequisetes = () => {
    axios
      .get(`analysis/trend_analysis/${selectedCompany.uuid}/`)
      .then((res) => {
        setMetricsData(res.data.metrics);

        if (res.data.predefined_chart) {
          const predefinedCharts = res.data.predefined_chart.map((chart) => ({
            value: chart.name,
            label: chart.name,
            suggestedCharts: chart.required.map((requiredChart) => ({
              ...requiredChart,
              show_moving_average: false,
              display_type: "line",
            })),
          }));
          setPredefinedChartData([
            {
              value: "Custom",
              label: "Custom",
              suggestedCharts: [],
            },
            ...predefinedCharts,
          ]);
        }
      })
      .catch((err) => {
        // status = 406 means the company calculations still in progress
        if (err.response.status !== 406) handleResponseError(err);
      });
  };

  const initiatedForm = (chartData) => {
    let initialValues = {
      type: chartData.type,
      title: chartData.title,
      frequency_period: chartData.is_valid ? chartData.frequency_period : "",
      period: chartData.is_valid ? chartData.period : "",
      show_data_info: chartData.params.show_data_info,
      selected_chart: {
        value: chartData.params.selected_chart,
        label: chartData.params.selected_chart,
      },
      charts: data?.chart_item.params.charts,
    };
    form.setValues(initialValues);
    form.setDirty(false);
    form.setTouched(false);
  };
  // handle check/uncheck the moving avg
  const handleMovingAvgChange = (isChecked, chartIndex) => {
    let listOfCharts = form.getInputProps("charts").value;

    listOfCharts = listOfCharts.map((singleChart, singleChartIndex) => {
      if (chartIndex === singleChartIndex)
        return { ...singleChart, show_moving_average: isChecked };
      return singleChart;
    });

    form.setValues({
      charts: listOfCharts,
    });
  };
  // handle check/uncheck the chart type
  // chartType will be line/bar
  const handleChartTypeChange = (chartType, chartIndex) => {
    let listOfCharts = form.getInputProps("charts").value;

    listOfCharts = listOfCharts.map((singleChart, singleChartIndex) => {
      if (chartIndex === singleChartIndex)
        return { ...singleChart, display_type: chartType };
      return singleChart;
    });

    form.setValues({
      charts: listOfCharts,
    });
  };

  // handle remove selected metric
  const handleRemoveSelectedMetric = (chartIndex) => {
    let listOfCharts = form.getInputProps("charts").value;

    listOfCharts = listOfCharts.filter((currentChart, currentChartIndex) => {
      if (chartIndex !== currentChartIndex) return currentChart;
    });

    form.setValues({
      selected_chart: { value: "Custom", label: "Custom" },
      charts: [...listOfCharts],
    });
    handleListOfUnits(listOfCharts);
  };

  // handle add new metric with default options
  // chart type = line
  // show moving avg = false
  const handleAddNewMetric = (new_metric) => {
    let listOfCharts = form.getInputProps("charts").value;
    let newChartList = [
      ...listOfCharts,
      {
        ...new_metric,
        show_moving_average: false,
        display_type: "line",
      },
    ];
    form.setValues({
      selected_chart: { value: "Custom", label: "Custom" },
      charts: [...newChartList],
    });
    handleListOfUnits(newChartList);
  };

  const handleListOfUnits = (newChartList) => {
    let ListOfNewUnits = new Set();

    newChartList.map((chart) => {
      ListOfNewUnits.add(chart.type);
    });

    setListOfUnits(ListOfNewUnits);
  };

  const handleSelectPredefinedChart = (predefinedChartName) => {
    let selectedChart = predefinedChartData.filter((item) => {
      if (item.value === predefinedChartName) return item;
    });

    form.setValues({
      selected_chart: {
        value: predefinedChartName,
        label: predefinedChartName,
      },
      charts:
        selectedChart.length > 0 ? [...selectedChart[0].suggestedCharts] : [],
    });
  };
  const handleSubmit = (values) => {
    setLoading(true);

    const {
      type,
      frequency_period,
      period,
      title,
      selected_chart,
      show_data_info,
      charts,
    } = values;

    let requestBody = {
      type,
      frequency_period,
      period,
      title,
      params: {
        selected_chart: selected_chart.value,
        show_table: data.chart_item.params.show_table,
        show_data_info: show_data_info,
        charts: charts,
      },
    };

    axios
      .put(`report/chart_item/${data.chart_item.uuid}`, requestBody)
      .then((res) => {
        handleNewItemInReportDetails(res.data);

        form.reset();
        setOpenEditDrawer(false);
      })
      .catch((err) => {
        handleResponseError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="edit_trend_analysis" data-testid="edit_trend_div">
      <p className="page__title">Edit Chart</p>
      <div className="form_container">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className="form_content">
            <div className="section p_t_24">
              <p className="sub__title m_b_16">Chart view</p>
              <div>
                <TextInput
                  className="chart__view__input"
                  label="Chart title"
                  {...form.getInputProps("title")}
                  data-testid="title_input"
                />
              </div>
              <div>
                <label className="select__label">
                  Select a predefined chart
                </label>
                <SingleDropdown
                  onChange={(e) => {
                    handleSelectPredefinedChart(e.value);
                  }}
                  data={predefinedChartData}
                  value={form.getInputProps("selected_chart").value}
                  optionLabel={"label"}
                  optionValue={"value"}
                  data-testid="predefined_chart_select"
                />
              </div>
            </div>
            <div className="section">
              <p>Chart Metric</p>
              {form.getInputProps("charts").value &&
                form.getInputProps("charts").value.length > 0 &&
                form.getInputProps("charts").value.map((chart, chartIndex) => {
                  return (
                    <div className="single_metric">
                      <p className="metric_name">{chart.name}</p>
                      <div className="metric_options">
                        <span>
                          <ChartOptions
                            chart={chart}
                            chartIndex={chartIndex}
                            handleMovingAvgChange={handleMovingAvgChange}
                            handleChartTypeChange={handleChartTypeChange}
                          />
                        </span>
                        <span
                          onClick={() => handleRemoveSelectedMetric(chartIndex)}
                          className="cancel_icon"
                        >
                          <i className="fa-solid fa-xmark "></i>
                        </span>
                      </div>
                    </div>
                  );
                })}
              {form.errors && form.errors.charts ? (
                <p className="error_msg">{form.errors.charts}</p>
              ) : null}
            </div>
            <div className="section m_b_24">
              {form.getInputProps("charts").value &&
                form.getInputProps("charts").value.length < 5 && (
                  <div style={{ height: "30px" }}>
                    <DropdownMultiColumns
                      currentList={form.getInputProps("charts").value}
                      handleAddNewMetric={handleAddNewMetric}
                      currentYAxisUnits={listOfUnits} // ["Number", "Percentage", "Monetary"]
                      labelComponent={
                        <div className="add_metric_div">
                          <i className="fa-solid fa-plus"></i>&nbsp; Add a
                          metric
                        </div>
                      }
                      data={metricsData}
                    />
                  </div>
                )}
            </div>
            <div className="seperator"></div>
            <div className="section m_b_24 ">
              <p className="sub__title m_b_16">Chart time period</p>
              <ReportTimeframeSelect
                form={form}
                freqFormField={"frequency_period"}
                periodFormField={"period"}
              />
            </div>
            <div className="seperator"></div>

            <div className="section">
              <p className="sub__title m_b_16">More information</p>
              <Checkbox
                radius="xs"
                label={<span className="checkbox__label">Show data info</span>}
                data-testid={`show_data_info_checkbox`}
                error={form.errors["show_data_info"]}
                {...form.getInputProps("show_data_info", {
                  type: "checkbox",
                })}
              />
            </div>
          </div>

          <div className="btns__div">
            <div className="btns__content">
              <Button
                size="lg"
                radius={6}
                type="submit"
                disabled={loading}
                w={"45%"}
                data-testid="save_btn"
                className="save_btn"
              >
                Save changes
              </Button>
              <Button
                ml="lg"
                size="lg"
                w={"30%"}
                radius={6}
                variant="outline"
                disabled={loading}
                className="cancel_btn"
                onClick={() => {
                  setOpenEditDrawer(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditTrendReport;
