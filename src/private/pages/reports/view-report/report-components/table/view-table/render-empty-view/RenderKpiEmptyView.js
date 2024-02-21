import React from "react";
import emptySeg from "../../../../../../../../assets/images/emptySeg.svg";
import "./style/RenderEmptyView.scss";

const RenderKpiEmptyView = () => {
  return (
    <div>
      <div className="seg_empty_content">
        <img src={emptySeg} alt="empty_section" />
        <p className="text">No KPI’s available</p>
      </div>
    </div>
  );
};

export default RenderKpiEmptyView;
