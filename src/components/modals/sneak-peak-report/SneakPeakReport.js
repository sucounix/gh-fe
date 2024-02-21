import React from "react";
import "./SneakPeakReport.scss";

function SneakPeakReport({ handleHideSneakPeakModal, image, name }) {
  return (
    <div
      className="sneak__peak__wrapper"
      data-testid="sneak-peak-report"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="sneak__peak__header">
        <div>
          <i
            className="fas fa-chevron-left"
            data-testid="close-sneak-peak-modal"
            onClick={handleHideSneakPeakModal}
          ></i>
        </div>
        <div className="header__content">
          <span>{name}</span>
        </div>
        <div></div>
      </div>
      <div className="sneak__peak__body">
        <img
          src={image}
          style={{
            width: "100%",
          }}
          alt="report sneak peak"
        />
      </div>
    </div>
  );
}
export default SneakPeakReport;
