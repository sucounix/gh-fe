import React from "react";
import { Popover, Checkbox } from "@mantine/core";
import barchart from "../../../../../../../assets/images/barchart.png";
import "./style/EditTrendReport.scss";

const ChartOptions = ({
  chart,
  chartIndex,
  handleMovingAvgChange,
  handleChartTypeChange,
}) => {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target data-testid={"chart-popup"}>
        <i className="fa-solid fa-ellipsis-vertical options_icon"></i>
      </Popover.Target>
      <Popover.Dropdown>
        <div>
          <p className="options_dropdown_title">Chart settings</p>
          <div
            className={
              chart.display_type === "line" ? "active_option" : "option"
            }
            data-testid={"chart-type-line-btn"}
            onClick={() => {
              handleChartTypeChange("line", chartIndex);
            }}
          >
            <span className="icon">
              <i className="fa-regular fa-chart-line"></i>
            </span>
            <span> Line chart</span>
          </div>
          <div
            className={
              chart.display_type === "bar" ? "active_option" : "option"
            }
            data-testid={"chart-type-bar-btn"}
            onClick={() => {
              handleChartTypeChange("bar", chartIndex);
            }}
          >
            <span className="icon">
              <img src={barchart} alt="barchart" />
            </span>
            <span> Bar chart</span>
          </div>
          <div className="seperator__div"></div>

          <div className="moving__avg__div" data-testid={"moving-average-ch"}>
            <Checkbox
              label="Moving average"
              checked={chart.show_moving_average}
              onChange={(e) => {
                handleMovingAvgChange(e.target.checked, chartIndex);
              }}
            />
          </div>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ChartOptions;
