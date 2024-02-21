import React from "react";
import { Link } from "react-router-dom";
import { SegmentedControl } from "@mantine/core";
import "./style/RowWithToggle.scss";

const RowWithToggle = ({
  rowIcon,
  rowName,
  editRow = null,
  onSegmentedChange,
  segmentedDefaultValue,
  disableSegmentedControl,
  segmentedData,
  segmentedTestId,
}) => {
  // editRow is an object = {
  //     editTitle:'',
  //     linkTo:"",
  //     editTestId:''
  // }
  return (
    <div className="row__with__toggle">
      <div className="row__name__div">
        {rowIcon && <div className="row__icon">{rowIcon}</div>}
        <div className="row__name" data-testid={`KPI_row_${rowName}`}>
          {rowName}
        </div>
      </div>
      <div className="toggle__div">
        {editRow && (
          <Link
            data-testid={editRow?.editTestId}
            to={editRow?.linkTo}
            className="edit__div"
          >
            <i className="fa fa-edit editIcon"></i>
            <span className="edit__text">{editRow?.editTitle}</span>
          </Link>
        )}
        <SegmentedControl
          disabled={disableSegmentedControl}
          onChange={onSegmentedChange}
          defaultValue={segmentedDefaultValue}
          data={segmentedData}
          data-testid={segmentedTestId}
        />
      </div>
    </div>
  );
};

export default RowWithToggle;
