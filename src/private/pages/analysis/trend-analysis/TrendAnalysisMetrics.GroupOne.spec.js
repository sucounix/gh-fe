import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TrendAnalysisMetrics from "./TrendAnalysisMetrics";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import { isEmptyObject } from "@tiptap/react";

describe("TrendAnalysisMetrics", () => {
  const mockedData = [
    {
      name: "Profit & Loss",
      children: [
        {
          name: "Standard_pl",
          sections: [
            {
              name: "Revenues_Standard_pl",

              items: [
                {
                  is_kpi: false,
                  name: "Retail",
                  type: "Percentage",
                  uuid: "ebe4ee79-9977-495e-92b5-088a12a222c7",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  const currentYAxisUnits = ["Number", "Percentage", "Monetary"];
  const isLine = jest.fn();
  const isShowMovingAvg = jest.fn();
  const chartColors = ["#FF0000", "#00FF00", "#0000FF"];

  const setCompanyAPIPreferences = jest.fn();
  const setCompanyFilterPreferences = jest.fn();

  const companyPreferencesApi = {
    selectedMetricsTA: [],
  };

  const companyPreferencesFilter = {
    selectedMetricsOptionsTA: [],
    predefineChartTA: "Custom",
  };

  it("renders without errors", () => {
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLine}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );

    expect(screen.getByTestId("trend-analysis-metrics")).toBeInTheDocument();
  });

  it("displays selected metrics", () => {
    const metric1 = { name: "Metric 1" };
    const metric2 = { name: "Metric 2" };
    companyPreferencesApi.selectedMetricsTA = [metric1, metric2];

    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLine}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );

    expect(screen.getByTestId("selected_metric_Metric 1")).toBeInTheDocument();
    expect(screen.getByTestId("selected_metric_Metric 2")).toBeInTheDocument();
  });

  it("it their is not selectedMetricsTA they should not be displayed.", () => {
    companyPreferencesApi.selectedMetricsTA = [];

    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLine}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );

    expect(
      screen.queryByTestId("selected_metric_Metric 1")
    ).not.toBeInTheDocument();
  });

  it("if the selectedMetricsTA are less than 5 ,then the add__metric__div should be rendered.", () => {
    const metric1 = { name: "Metric 1" };
    const metric2 = { name: "Metric 2" };
    companyPreferencesApi.selectedMetricsTA = [metric1, metric2];

    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLine}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );

    expect(screen.getByTestId("add__metric__div")).toBeInTheDocument();
  });

  it("if the selectedMetricsTA are equal 5 ,then the add__metric__div shouldn't be rendered.", () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
      { name: "Metric 3" },
      { name: "Metric 4" },
      { name: "Metric 5" },
    ];

    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLine}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );

    expect(screen.queryByTestId("add__metric__div")).not.toBeInTheDocument();
  });

  it("when click on the target , the dropdown should be appear.", async () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
    ];

    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLine}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );

    expect(screen.getByTestId("metric_target_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("metric_target_0"));
    await waitFor(() => {
      expect(screen.getByTestId("title__menu__div_0")).toBeInTheDocument();
    });
  });

  it("when click on remove metric , the setCompanyAPIPreferences should be called.", async () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
    ];
    const setCompanyAPIPreferencesFn = jest.fn();
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences: setCompanyAPIPreferencesFn,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLine}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );

    expect(screen.getByTestId("remove_metric_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("remove_metric_0"));
    await waitFor(() => {
      expect(setCompanyAPIPreferencesFn).toBeCalledWith({
        selectedMetricsTA: [{ name: "Metric 2" }],
      });
    });
  });

  it("if the current metric is line , then the line chart option should has active__chart__type classname.", async () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
    ];
    const isLineFn = jest.fn(() => {
      return true;
    });
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences: setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLineFn}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );
    expect(screen.getByTestId("metric_target_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("metric_target_0"));
    await waitFor(() => {
      expect(screen.getByTestId("title__menu__div_0")).toBeInTheDocument();
    });
    expect(screen.getByTestId("line_chart_0").className).toBe(
      "active__chart__type"
    );
  });

  it("if the current metric is bar , then the bar chart option should has active__chart__type classname.", async () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
    ];
    const isLineFn = jest.fn(() => {
      return false;
    });
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences: setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLineFn}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );
    expect(screen.getByTestId("metric_target_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("metric_target_0"));
    await waitFor(() => {
      expect(screen.getByTestId("title__menu__div_0")).toBeInTheDocument();
    });
    expect(screen.getByTestId("bar_chart_0").className).toBe(
      "active__chart__type"
    );
  });

  it("when click on line chart option then the setCompanyFilterPreferences method should be called.", async () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
    ];
    companyPreferencesFilter.selectedMetricsOptionsTA = [
      { name: "Metric 1", chartType: "line", uuid: "123" },
      { name: "Metric 2", chartType: "line", uuid: "456" },
    ];
    const isLineFn = jest.fn(() => {
      return true;
    });
    const setCompanyFilterPreferencesFn = jest.fn();
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences: setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences: setCompanyFilterPreferencesFn,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLineFn}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );
    expect(screen.getByTestId("metric_target_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("metric_target_0"));
    await waitFor(() => {
      expect(screen.getByTestId("title__menu__div_0")).toBeInTheDocument();
    });
    expect(screen.getByTestId("line_chart_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("line_chart_0"));
    await waitFor(() => {
      expect(setCompanyFilterPreferencesFn).toBeCalled();
    });
  });

  it("when click on bar chart option then the setCompanyFilterPreferences method should be called.", async () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
    ];
    companyPreferencesFilter.selectedMetricsOptionsTA = [
      { name: "Metric 1", chartType: "bar", uuid: "123" },
      { name: "Metric 2", chartType: "bar", uuid: "456" },
    ];
    const isLineFn = jest.fn(() => {
      return true;
    });
    const setCompanyFilterPreferencesFn = jest.fn();
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences: setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences: setCompanyFilterPreferencesFn,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLineFn}
            isShowMovingAvg={isShowMovingAvg}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );
    expect(screen.getByTestId("metric_target_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("metric_target_0"));
    await waitFor(() => {
      expect(screen.getByTestId("title__menu__div_0")).toBeInTheDocument();
    });
    expect(screen.getByTestId("bar_chart_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("bar_chart_0"));
    await waitFor(() => {
      expect(setCompanyFilterPreferencesFn).toBeCalled();
    });
  });

  it("if the current metric has moving avg option then the moving avg option should be checked.", async () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
    ];
    companyPreferencesFilter.selectedMetricsOptionsTA = [
      { name: "Metric 1", chartType: "bar", uuid: "123" },
      { name: "Metric 2", chartType: "bar", uuid: "456" },
    ];
    const isShowMovingAvgFn = jest.fn(() => {
      return true;
    });
    const isLineFn = jest.fn(() => {
      return true;
    });
    const setCompanyFilterPreferencesFn = jest.fn();
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences: setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences: setCompanyFilterPreferencesFn,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLineFn}
            isShowMovingAvg={isShowMovingAvgFn}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );
    expect(screen.getByTestId("metric_target_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("metric_target_0"));
    await waitFor(() => {
      expect(screen.getByTestId("title__menu__div_0")).toBeInTheDocument();
    });
    expect(screen.getByTestId("mvg_avg_0").checked).toBeTruthy();
  });

  it("when click on moving avg option then the setCompanyFilterPreferences method should be called.", async () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
    ];
    companyPreferencesFilter.selectedMetricsOptionsTA = [
      { name: "Metric 1", chartType: "bar", uuid: "123", showMovingAvg: true },
      { name: "Metric 2", chartType: "bar", uuid: "456", showMovingAvg: true },
    ];
    const isShowMovingAvgFn = jest.fn(() => {
      return true;
    });
    const isLineFn = jest.fn(() => {
      return true;
    });
    const setCompanyFilterPreferencesFn = jest.fn();
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences: setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences: setCompanyFilterPreferencesFn,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={[]}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLineFn}
            isShowMovingAvg={isShowMovingAvgFn}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );
    expect(screen.getByTestId("metric_target_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("metric_target_0"));
    await waitFor(() => {
      expect(screen.getByTestId("title__menu__div_0")).toBeInTheDocument();
    });
    expect(screen.getByTestId("mvg_avg_0").checked).toBeTruthy();
    fireEvent.click(screen.getByTestId("mvg_avg_0"));
    await waitFor(() => {
      expect(setCompanyFilterPreferencesFn).toBeCalledWith({
        predefineChartTA: "Custom",
        selectedMetricsOptionsTA: [
          {
            chartType: "bar",
            name: "Metric 1",
            showMovingAvg: false,
            uuid: "123",
          },
          {
            chartType: "bar",
            name: "Metric 2",
            showMovingAvg: true,
            uuid: "456",
          },
        ],
      });
    });
  });

  it("when click on new metric , it should be added.", async () => {
    companyPreferencesApi.selectedMetricsTA = [
      { name: "Metric 1" },
      { name: "Metric 2" },
    ];
    companyPreferencesFilter.selectedMetricsOptionsTA = [
      { chartType: "bar", metricUuid: "123", showMovingAvg: true },
      { chartType: "bar", metricUuid: "456", showMovingAvg: true },
    ];
    const isShowMovingAvgFn = jest.fn(() => {
      return true;
    });
    const isLineFn = jest.fn(() => {
      return true;
    });
    const setCompanyFilterPreferencesFn = jest.fn();
    render(
      <CompanyPreferencesApiContext.Provider
        value={{
          companyPreferencesApi,
          setCompanyAPIPreferences: setCompanyAPIPreferences,
        }}
      >
        <CompanyPreferencesFilterContext.Provider
          value={{
            companyPreferencesFilter,
            setCompanyFilterPreferences: setCompanyFilterPreferencesFn,
          }}
        >
          <TrendAnalysisMetrics
            metricsData={mockedData}
            currentYAxisUnits={currentYAxisUnits}
            isLine={isLineFn}
            isShowMovingAvg={isShowMovingAvgFn}
            chartColors={chartColors}
          />
        </CompanyPreferencesFilterContext.Provider>
      </CompanyPreferencesApiContext.Provider>
    );
    await waitFor(() => [
      expect(
        screen.getByTestId("label_component_multi_columns")
      ).toBeInTheDocument(),
    ]);
    fireEvent.click(screen.getByTestId("label_component_multi_columns"));
    await waitFor(() => {
      expect(screen.getByTestId("level_3_metric_Retail")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("level_3_metric_Retail"));

    await waitFor(() => {
      expect(setCompanyFilterPreferencesFn).toBeCalledWith({
        predefineChartTA: "Custom",
        selectedMetricsOptionsTA: [
          {
            chartType: "bar",
            showMovingAvg: true,
            metricUuid: "123",
          },
          {
            chartType: "bar",
            showMovingAvg: true,
            metricUuid: "456",
          },
          {
            chartType: "line",
            color: "#0000FF",
            metricUuid: "ebe4ee79-9977-495e-92b5-088a12a222c7",
            showMovingAvg: false,
          },
        ],
      });
    });
  });
});
