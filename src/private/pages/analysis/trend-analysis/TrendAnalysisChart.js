import React, { useContext } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { handleCurrencySymbol } from "../../../../private/helpers/handleCurrency";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { humanReadableNumber } from "../../../helpers/humanReadableNumber";

const TrendAnalysisChart = ({
  chartData,
  currentYAxisUnits,
  isLine,
  isShowMovingAvg,
  getColor,
}) => {
  const { selectedCompany } = useContext(CompaniesContext);
  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);

  const handleNumbersFormat = (type, value) => {
    if (type === "Percentage") {
      return `${humanReadableNumber(value)}%`;
    }
    if (type === "Number") {
      if (value < 0) return `(${humanReadableNumber(value * -1)})`;
      return `${humanReadableNumber(value)}`;
    }
    if (type === "Monetary") {
      if (value < 0)
        return `${handleCurrencySymbol(
          selectedCompany.currency
        )} (${humanReadableNumber(value * -1)})`;
      return `${handleCurrencySymbol(
        selectedCompany.currency
      )} ${humanReadableNumber(value)}`;
    }
  };

  const formatterLeftYaxis = (value) => {
    if (currentYAxisUnits !== null) {
      return handleNumbersFormat([...currentYAxisUnits][0], value);
    }
  };

  const formatterRightYaxis = (value) => {
    if (currentYAxisUnits !== null && currentYAxisUnits.size === 2) {
      return handleNumbersFormat([...currentYAxisUnits][1], value);
    }
  };

  const handleYaxisDirection = (item) => {
    if (currentYAxisUnits !== null) {
      if ([...currentYAxisUnits][0] === item.type) return "left";
      return "right";
    }
  };

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgb(${r},${g},${b},0.5)`;
  }

  const CustomizedTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="chart-tooltip">
          <p>{label}</p>
          {payload.length > 0 &&
            payload.map((item, itemIndex) => {
              return (
                <div
                  style={{ color: item.stroke }}
                  key={`payload__${itemIndex}_`}
                >
                  <span>{item.name}&nbsp;:&nbsp;</span>
                  <span>{handleNumbersFormat(item.unit, item.value)}</span>
                </div>
              );
            })}
        </div>
      );
    }

    return null;
  };

  return (
    companyPreferencesApi &&
    companyPreferencesApi.selectedMetricsTA.length > 0 &&
    companyPreferencesApi.selectedMetricsTA && (
      <div className="chart__container" data-testid="chart_view">
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
            <CartesianGrid strokeDasharray="10 10" stroke="rgb(0,0,0,0.5)" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" tickFormatter={formatterLeftYaxis} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatterRightYaxis}
            />
            <Tooltip content={<CustomizedTooltip />} />
            {companyPreferencesApi.selectedMetricsTA.map((item, itemIndex) => {
              return isLine(item) ? (
                <React.Fragment key={`item_selected_line_${itemIndex}`}>
                  <Line
                    yAxisId={handleYaxisDirection(item)}
                    type="monotone"
                    unit={item.type}
                    dataKey={item.name}
                    stroke={getColor(item)}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    key={`normal_line_${itemIndex}`}
                  />
                  {isShowMovingAvg(item) && (
                    <Line
                      yAxisId={handleYaxisDirection(item)}
                      type="monotone"
                      unit={item.type}
                      dataKey={`${item.name} moving avg`}
                      stroke={hexToRgb(getColor(item))}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      key={`avg_line_${itemIndex}`}
                    />
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment key={`item_selected_bar_${itemIndex}`}>
                  {" "}
                  <Bar
                    yAxisId={handleYaxisDirection(item)}
                    barSize={20}
                    unit={item.type}
                    dataKey={item.name}
                    fill={getColor(item)}
                    key={`normal_bar_${itemIndex}`}
                  />
                  {isShowMovingAvg(item) && (
                    <Bar
                      yAxisId={handleYaxisDirection(item)}
                      barSize={20}
                      unit={item.type}
                      dataKey={`${item.name} moving avg`}
                      fill={hexToRgb(getColor(item))}
                      key={`avg_bar_${itemIndex}`}
                    />
                  )}
                </React.Fragment>
              );
            })}

            <Brush dataKey="name" marginTop="10px" />
          </ComposedChart>
        </ResponsiveContainer>

        {/* draw legends */}
        <div className="legend__div">
          {companyPreferencesApi.selectedMetricsTA.map((item, itemIndex) => {
            return (
              <div key={`selected_metric__${itemIndex}_`}>
                <div
                  style={{
                    width: "100px",
                    height: "6px",
                    borderRadius: "15px",
                    backgroundColor: getColor(item),
                  }}
                ></div>
                <p className="metric__side__name">{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default TrendAnalysisChart;
