import React from "react";
import "./style/InputTabsForm.scss";

function InputTabsForm({ form, inputName, options, smallText = false }) {
  const renderOptionClassName = (index) => {
    if (smallText) {
      if (form.getInputProps(inputName).value === options[index].value)
        return "view__type__option_small view__type__option__active_small";
      else {
        return "view__type__option_small ";
      }
    } else {
      if (form.getInputProps(inputName).value === options[index].value)
        return "view__type__option view__type__option__active";
      else {
        return "view__type__option ";
      }
    }
  };
  return (
    <div className="view__tabs__container">
      <div
        className={renderOptionClassName(0)}
        onClick={() => {
          form.setFieldValue(inputName, options[0].value);
        }}
        data-testid={`tab_${options[0].label}`}
      >
        <span className={smallText ? "small_text" : "view__type__title"}>
          {options[0].label}
        </span>
      </div>
      <div
        className={renderOptionClassName(1)}
        onClick={() => {
          form.setFieldValue(inputName, options[1].value);
        }}
        data-testid={`tab_${options[1].label}`}
      >
        <span className={smallText ? "small_text" : "view__type__title"}>
          {options[1].label}
        </span>
      </div>
    </div>
  );
}

export default InputTabsForm;
