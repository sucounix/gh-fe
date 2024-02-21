import React, { useEffect, useState } from "react";
import CFOCashflowWaterfall from "../../../../analysis/financials/cash-flow/cash-flow-waterfall/views/CFOCashflowWaterfall";
import "./style/WaterfallReport.scss";
import UsesSourcesCashflowWaterfall from "../../../../analysis/financials/cash-flow/cash-flow-waterfall/views/UsesSourcesCashflowWaterfall";
import NetFreeCashflowWaterfall from "../../../../analysis/financials/cash-flow/cash-flow-waterfall/views/NetFreeCashflowWaterfall";
import EmptyWaterfallView from "../../../../analysis/financials/cash-flow/cash-flow-waterfall/views/EmptyWaterfallView";

const frequencyPeriodNames = {
  month: "Monthly",
  quarter: "Quarterly",
  "semi-annual": "Semi Annual",
  annual: "Annual",
};

function WaterfallReport({ item }) {
  const [chartData, setChartData] = useState(item);

  useEffect(() => {
    setChartData(item);
  }, [item]);

  const renderWaterfall = (type) => {
    switch (type) {
      case "Cash Flow (CFO - CFI - CFF)":
        return <CFOCashflowWaterfall data={chartData.chart_item.value.data} />;
      case "Uses & Sources of Cash Flow":
        return (
          <UsesSourcesCashflowWaterfall
            data={chartData.chart_item.value.data}
          />
        );
      case "Net free cash flow":
        return (
          <NetFreeCashflowWaterfall data={chartData.chart_item.value.data} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="waterfall__chart__report">
      {chartData?.chart_item?.value?.data?.rows?.length === 0 ? (
        <div className="waterfall__empty__view">
          <EmptyWaterfallView />
        </div>
      ) : (
        <>
          <div className="waterfall__header">
            <span
              className="waterfall__header__title"
              data-testid={"header-title-id"}
            >
              {chartData?.chart_item?.title}
            </span>
            <span
              className="waterfall__header__subtitle"
              data-testid={"header-subtitle-id"}
            >
              {frequencyPeriodNames[chartData?.chart_item?.frequency_period]}
              {"  "}
              {chartData?.chart_item?.period}
            </span>
          </div>
          <div style={{ marginTop: "1rem" }}>
            {chartData && chartData.chart_item && (
              <>{renderWaterfall(chartData.chart_item?.params?.view_name)}</>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default WaterfallReport;
