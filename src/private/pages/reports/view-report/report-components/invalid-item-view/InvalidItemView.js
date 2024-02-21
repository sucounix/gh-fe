import React from "react";
import invalid_table_item from "../../../../../../assets/images/invalid_table_item.png";
import invalid_chart_trend_item from "../../../../../../assets/images/invalid_chart_trend_item.png";
import invalid_chart_breakeven_item from "../../../../../../assets/images/invalid_chart_breakeven_item.png";
import invalid_chart_waterfall_item from "../../../../../../assets/images/invalid_chart_waterfall_item.png";
import { Alert } from "@mantine/core";
import "./InvalidItemView.scss";

const InvalidItemView = ({ itemType, itemSubType = "", testId }) => {
  const renderImage = () => {
    if (itemType === "table") return invalid_table_item;
    if (itemType === "chart") {
      if (itemSubType === "breakeven") return invalid_chart_breakeven_item;
      if (itemSubType === "waterfall") return invalid_chart_waterfall_item;
      if (itemSubType === "trend_analysis") return invalid_chart_trend_item;
    }
  };
  return (
    <div className="invalid_item" data-testid={testId}>
      <Alert
        variant="light"
        color="red"
        padding={0}
        icon={<i class="fa-regular fa-circle-xmark"></i>}
      >
        <span className="alert_text">
          {`Please change the time period for this ${itemType} as it does not match the company data that you have updated`}
        </span>
      </Alert>
      <img src={renderImage()} alt="invalid table item" className="item_img" />
    </div>
  );
};

export default InvalidItemView;
