import React from "react";
import "./style/RowEdit.scss";

const RowEdit = ({ rowName, onEditClick, editBtnTestId }) => {
  return (
    <div className="row_edit_wrapper">
      <span className="rowName" data-testid={`budget_variable_${rowName}`}>
        {rowName}
      </span>
      <span
        className="edit__btn"
        data-testid={editBtnTestId}
        onClick={onEditClick}
      >
        <i className="fa fa-edit edit__row__icon"></i>
        <span className="span__edit">Edit</span>
      </span>
    </div>
  );
};

export default RowEdit;
