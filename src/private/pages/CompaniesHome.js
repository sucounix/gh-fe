import React from "react";
import { Outlet } from "react-router";
import Header from "../layout/header/Header";
import "./companies-home-style/CompaniesHome.scss";
function CompaniesHome() {
  return (
    <>
      <Header />
      <div
        className="companies_home_content"
        data-testid="companies_home_content"
      >
        <Outlet />
      </div>
    </>
  );
}

export default CompaniesHome;
