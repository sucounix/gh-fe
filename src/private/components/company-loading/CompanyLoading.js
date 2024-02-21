import React from "react";
import loadingSpinner from "../../../assets/images/loadingkpis.gif";
import "./CompanyLoading.css";

function CompanyLoading({ title }) {
  return (
    <div className="loading__wrapper">
      <img className="loading__spinner" src={loadingSpinner} alt="loading" />
      <span className="loading__title">Calculating your {title}...</span>
      <span className="loading__subtitle">
        Your {title} are being calculated, please refresh in a few seconds
      </span>
    </div>
  );
}

export default CompanyLoading;
