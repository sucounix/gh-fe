import React, { useState } from "react";
import ListCompany from "./ListCompany";
import "./style/CompanyProfile.scss";

const CompanyProfile = () => {
  return (
    <div className="company__profile__wrapper">
      <div className="company__profile__header">
        <span className="company__profile__header__title">Company Profile</span>
        <span className="company__profile__header__subtitle">
          Review your company profile
        </span>
      </div>
      <ListCompany />
    </div>
  );
};

export default CompanyProfile;
