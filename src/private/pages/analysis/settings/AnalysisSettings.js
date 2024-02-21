import React, { useContext, useEffect, useState } from "react";
import "./style/AnalysisSettings.scss";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import Submenu from "../../../../components/submenu/Submenu";

function AnalysisSettings() {
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    setBreadCrumbs([{ title: "Analysis" }, { title: "Settings" }]);
  }, []);

  useEffect(() => {
    if (location.pathname.includes("data-update")) setActiveTab(1);
    else if (location.pathname.includes("outstanding-shares")) setActiveTab(2);
    else if (location.pathname.includes("chart-of-accounts")) setActiveTab(3);
    else if (location.pathname.includes("alerts")) setActiveTab(4);
    else if (location.pathname.includes("budgets")) setActiveTab(5);
    else if (location.pathname.includes("kpis")) setActiveTab(6);
    else navigate(`/company/${params.companyId}/analysis/settings/data-update`);
  }, [location]);

  return (
    <>
      <div className="analysis__settings__wrapper">
        <Submenu
          title="Analysis Settings"
          links={[
            {
              title: "Data Update",
              to: "data-update",
            },
            {
              title: "Outstanding Shares",
              to: "outstanding-shares",
            },
            {
              title: "Chart of accounts",
              to: "chart-of-accounts",
            },
            {
              title: "Alerts",
              to: "alerts",
            },
            {
              title: "Budget",
              to: "budgets",
            },
            {
              title: "KPI's",
              to: "kpis",
            },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div style={{ width: "84%" }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AnalysisSettings;
