import React, { useContext, useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { handleCurrencySymbol } from "../../../../../helpers/handleCurrency";
import { humanReadableNumberOneDecimal } from "../../../../../helpers/humanReadableNumberOneDecimal";
import { humanReadableNumber } from "../../../../../helpers/humanReadableNumber";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";
import "./style/TrendReport.scss";
import TrendAnalysisTable from "../../../../analysis/trend-analysis/TrendAnalysisTable";

function TrendReport({ item }) {
  const [mainChartItem, setMainChartItem] = useState(item);
  const [chartItem, setChartItem] = useState(mainChartItem?.chart_item);
  const [data, setData] = useState(mainChartItem?.chart_item.value.data);
  const [charts, setCharts] = useState(mainChartItem?.chart_item.params.charts);
  const [isTableShown, setIsTableShown] = useState(
    mainChartItem.chart_item.params.show_table
  );
  const [units, setUnits] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const { selectedCompany } = useContext(CompaniesContext);

  useEffect(() => {
    if (data) {
      prepareChartData(data);
      if (isTableShown) {
        prepareTableData(data);
      }
    }
  }, [data, isTableShown]);

  useEffect(() => {
    if (item) handleUpdateMainItem(item);
  }, [item]);

  const handleUpdateMainItem = (newItem) => {
    setMainChartItem(newItem);
    setChartItem(newItem.chart_item);
    setData(newItem?.chart_item.value.data);
    setCharts(newItem?.chart_item.params.charts);
    setIsTableShown(newItem.chart_item.params.show_table);
  };
  const handleNumbersFormat = (type, value) => {
    const formattedValue = humanReadableNumber(Math.abs(value));

    switch (type) {
      case "Percentage":
        return `${formattedValue}%`;
      case "Number":
        return value < 0 ? `(${formattedValue})` : formattedValue;
      case "Monetary":
        const currencySymbol = handleCurrencySymbol(selectedCompany.currency);
        return value < 0
          ? `${currencySymbol} (${formattedValue})`
          : `${currencySymbol} ${formattedValue}`;
      default:
        return "";
    }
  };

  const leftAxisFormatter = (value) => {
    if (units) {
      return handleNumbersFormat([...units][0], value);
    }
  };

  const rightAxisFormatter = (value) => {
    if (units?.size === 2) {
      return handleNumbersFormat([...units][1], value);
    }
  };

  const handleYaxisDirection = (item) => {
    if (units && [...units][0] === item.type) {
      return "left";
    } else {
      return "right";
    }
  };

  const frequencyPeriodNames = {
    month: "Monthly",
    quarter: "Quarterly",
    "semi-annual": "Semi Annual",
    annual: "Annual",
  };

  const chartColors = ["#00A0B6", "#E580C3", "#8449FF", "#FF9585", "#726D47"];
  const prepareChartData = (chartData) => {
    const _chartData = chartData.headers.map((header, i) => {
      const period = {
        name: header,
      };
      chartData.charts.forEach((chart) => {
        period[chart.chart_name] = chart.values[i].standard;
        period[`${chart.chart_name} moving avg`] =
          chart.values[i].moving_average;
      });
      return period;
    });

    const _units = new Set(charts.map((chart) => chart.type));

    setUnits(_units);
    setChartData(_chartData);
  };

  const prepareTableData = (tableData) => {
    if (tableData) {
      const _tableData = tableData.headers.map((header) => {
        const currentPeriodValues = { name: header };
        tableData.charts.forEach((chart) => {
          currentPeriodValues[chart.chart_name] = {
            value: chart.values[tableData.headers.indexOf(header)].standard,
            type: chart.type,
          };
        });
        return currentPeriodValues;
      });
      setTableData(_tableData);
    }
  };
  const renderCustomizedLabel = (props) => {
    const { x, y, value } = props;
    return (
      <g>
        <text
          x={x}
          y={y - 5}
          fill="#000"
          dy={-4}
          fontSize={"14px"}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {humanReadableNumberOneDecimal(value)}
        </text>
      </g>
    );
  };

  return (
    <div className="trend__report__wrapper">
      <div className="trend__chart__header">
        <div>
          <span className="trend__chart__title">{chartItem.title} </span>
        </div>
        <span className="trend__chart__period">
          {frequencyPeriodNames[chartItem.frequency_period]} {chartItem.period}
        </span>
      </div>
      {chartData && (
        <>
          <div
            className="chart__wrapper"
            style={{ minHeight: 500, display: "flex" }}
          >
            <div
              style={{
                width: "90%",
              }}
              data-testid="chart_view"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  width={"100%"}
                  height={"100%"}
                  data={chartData}
                  margin={{
                    top: 50,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="10 10"
                    stroke="rgb(0,0,0,0.5)"
                  />
                  <XAxis
                    dataKey="name"
                    style={{
                      fill: "#086972",
                      fontWeight: 400,
                      fontSize: "0.875rem",
                    }}
                  />
                  <YAxis yAxisId="left" tickFormatter={leftAxisFormatter} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={rightAxisFormatter}
                  />
                  {charts.map((item, itemIndex) => {
                    return item.display_type === "line" ? (
                      <React.Fragment key={`item_selected_line_${itemIndex}`}>
                        <Line
                          yAxisId={handleYaxisDirection(item)}
                          type="monotone"
                          unit={item.type}
                          dataKey={item.name}
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                          key={`normal_line_${itemIndex}`}
                          stroke={chartColors[itemIndex]}
                          isAnimationActive={false}
                        >
                          {mainChartItem.chart_item.params.show_data_info && (
                            <LabelList
                              dataKey={item.name}
                              position="top"
                              content={renderCustomizedLabel}
                            />
                          )}
                        </Line>

                        {item.show_moving_average && (
                          <Line
                            yAxisId={handleYaxisDirection(item)}
                            type="monotone"
                            unit={item.type}
                            dataKey={`${item.name} moving avg`}
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                            stroke={`${chartColors[itemIndex]}80`}
                            key={`avg_line_${itemIndex}`}
                            isAnimationActive={false}
                          >
                            {mainChartItem.chart_item.params.show_data_info && (
                              <LabelList
                                dataKey={`${item.name} moving avg`}
                                position="top"
                                content={renderCustomizedLabel}
                              />
                            )}
                          </Line>
                        )}
                      </React.Fragment>
                    ) : (
                      <React.Fragment key={`item_selected_bar_${itemIndex}`}>
                        <Bar
                          yAxisId={handleYaxisDirection(item)}
                          barSize={20}
                          unit={item.type}
                          dataKey={item.name}
                          key={`normal_bar_${itemIndex}`}
                          fill={chartColors[itemIndex]}
                          isAnimationActive={false}
                        >
                          {mainChartItem.chart_item.params.show_data_info && (
                            <LabelList
                              dataKey={item.name}
                              position="top"
                              content={renderCustomizedLabel}
                            />
                          )}
                        </Bar>
                        {item.show_moving_average && (
                          <Bar
                            yAxisId={handleYaxisDirection(item)}
                            barSize={20}
                            unit={item.type}
                            dataKey={`${item.name} moving avg`}
                            key={`avg_bar_${itemIndex}`}
                            fill={`${chartColors[itemIndex]}80`}
                            isAnimationActive={false}
                          >
                            {mainChartItem.chart_item.params.show_data_info && (
                              <LabelList
                                dataKey={`${item.name} moving avg`}
                                position="top"
                                content={renderCustomizedLabel}
                              />
                            )}
                          </Bar>
                        )}
                      </React.Fragment>
                    );
                  })}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div
              style={{
                width: "10%",
                paddingTop: "4.5rem",
              }}
            >
              {charts.map((item, itemIndex) => {
                return (
                  <div key={`selected_metric__${itemIndex}_`}>
                    <div
                      style={{
                        width: "100px",
                        height: "6px",
                        borderRadius: "15px",
                        backgroundColor: chartColors[itemIndex],
                      }}
                    ></div>
                    <p className="metric__side__name">{item.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {isTableShown && (
            <div className="trend__report__table">
              <TrendAnalysisTable
                data={tableData}
                selectedPredefinedChartName={
                  mainChartItem.chart_item.params.selected_chart
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TrendReport;
