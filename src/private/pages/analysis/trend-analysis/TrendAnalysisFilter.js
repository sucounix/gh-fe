import React, { useEffect, useState, useContext } from "react";
import { Flex, Grid, SegmentedControl } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import "./style/TrendAnalysis.scss";
import SingleDropdown from "../../../../components/single-level-dropdown/SingleDropdown";

const TrendAnalysisFilter = ({ predefinedChartData, chartColors }) => {
  const [viewChartChecked, setViewChartChecked] = useState(true);
  // // array of objects
  // [{ value: "Profit", label: "Profit" }];
  const [predfinedDataOptions, setPredefinedDataOptions] = useState([]);
  const [selectPredefineChart, setSelectPredefineChart] = useState("");

  const { companyPreferencesFilter, setCompanyFilterPreferences } = useContext(
    CompanyPreferencesFilterContext
  );

  const { companyPreferencesApi, setCompanyAPIPreferences } = useContext(
    CompanyPreferencesApiContext
  );

  const { width } = useViewportSize();

  const toggleChartOptions = [
    {
      value: "Show",
      label: <i className="fa-solid fa-chart-mixed"></i>,
    },
    {
      value: "Hide",
      label: <i className="fa-solid fa-table"></i>,
    },
  ];

  useEffect(() => {
    if (predefinedChartData) {
      predefinedChartData.map((item) => {
        setPredefinedDataOptions((prevState) => [
          ...prevState,
          { value: item.name, label: item.name },
        ]);
      });
    }
  }, []);

  useEffect(() => {
    if (companyPreferencesFilter) {
      setViewChartChecked(companyPreferencesFilter.viewChartTA);
      setSelectPredefineChart(companyPreferencesFilter.predefineChartTA);
    }
  }, [companyPreferencesFilter]);

  const handleSelectPredefinedChart = (e) => {
    let predfiendMatched = predefinedChartData.find((item) => {
      return item.name === e;
    });

    // when select predefined chart
    // should replace the selected metrics with the required array
    // and should replace the selected metrics options with the default options
    if (predfiendMatched) {
      let metricsOptions = [];
      let new_metric_options = {};
      for (let i = 0; i < predfiendMatched.required.length; i++) {
        new_metric_options = {
          metricUuid: predfiendMatched.required[i].uuid,
          chartType: "line",
          showMovingAvg: false,
          color: chartColors[i],
        };
        metricsOptions.push(new_metric_options);
      }

      setCompanyFilterPreferences({
        ...companyPreferencesFilter,
        predefineChartTA: e,
        selectedMetricsOptionsTA: metricsOptions,
      });
      setCompanyAPIPreferences({
        ...companyPreferencesApi,
        selectedMetricsTA: predfiendMatched ? predfiendMatched.required : [],
      });
    } else {
      setCompanyFilterPreferences({
        ...companyPreferencesFilter,
        predefineChartTA: e,
      });
    }
    setSelectPredefineChart(e);
  };

  const handleChangeShowChart = (e) => {
    setViewChartChecked(e);
    setCompanyFilterPreferences({
      ...companyPreferencesFilter,
      viewChartTA: e,
    });
  };

  return (
    <Grid className="trendanalysis__filter">
      <Grid.Col span={3} h={100}>
        <div>
          <label className="select__label">Select a predefined chart</label>
          <SingleDropdown
            onChange={(e) => {
              handleSelectPredefinedChart(e.value);
            }}
            data={predfinedDataOptions}
            value={predfinedDataOptions.find(
              (view) => view.value === selectPredefineChart
            )}
            optionLabel={"label"}
            optionValue={"value"}
          />
        </div>
      </Grid.Col>

      <Grid.Col span={9}>
        <Flex align="flex-end" justify={"flex-end"} h={80}>
          <div className="">
            <label style={{ marginRight: "10px" }}>View</label>
            <SegmentedControl
              data-testid="view_trend_analysis_chart"
              size={width < 810 && "xs"}
              onChange={(e) => {
                handleChangeShowChart(e === "Show");
              }}
              data={toggleChartOptions}
              defaultValue={viewChartChecked ? "Show" : "Hide"}
              value={viewChartChecked ? "Show" : "Hide"}
            />
          </div>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};
export default TrendAnalysisFilter;
