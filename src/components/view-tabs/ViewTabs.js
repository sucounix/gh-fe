import React from "react";
import "./style/ViewTabs.scss";

function ViewTabs({ view, setView, options, smallText = false }) {
  const renderOptionClassName = (index) => {
    if (smallText) {
      if (view === options[index].value)
        return "view__type__option_small view__type__option__active_small";
      else {
        return "view__type__option_small ";
      }
    } else {
      if (view === options[index].value)
        return "view__type__option view__type__option__active";
      else {
        return "view__type__option ";
      }
    }
  };
  return (
    <div className="view__tabs__container" data-testid="viewTabs">
      <div
        className={renderOptionClassName(0)}
        onClick={() => {
          setView(options[0].value);
        }}
        data-testid={`tab_${options[0].label}`}
      >
        <span
          className={smallText ? "small_text" : "view__type__title"}
          data-testid={`option_0_label`}
        >
          {options[0].label}
        </span>
      </div>
      <div
        className={renderOptionClassName(1)}
        onClick={() => {
          setView(options[1].value);
        }}
        data-testid={`tab_${options[1].label}`}
      >
        <span
          className={smallText ? "small_text" : "view__type__title"}
          data-testid={`option_1_label`}
        >
          {options[1].label}
        </span>
      </div>
    </div>
  );
}

export default ViewTabs;
