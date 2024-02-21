import React from "react";
import emptySeg from "../../../../../../../../assets/images/emptySeg.svg";
import "./style/RenderEmptyView.scss";

const RenderSegEmptyView = ({ data }) => {
  return (
    <div>
      <div className="seg_empty_content">
        <img src={emptySeg} alt="empty_section" />
        <p className="text">
          Ooops, No results found for {data.table_item.params.view_name}
        </p>
      </div>
    </div>
  );
};

export default RenderSegEmptyView;
