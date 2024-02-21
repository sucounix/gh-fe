import React, { useContext, useEffect, useState } from "react";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import SideMenu from "../../layout/sidemenu/SideMenu";
import { SideMenuContext } from "../../../contexts/SideMenuContext";
import "./style/OrganisationSettings.scss";
import Submenu from "../../../components/submenu/Submenu";

const OrganisationSettings = () => {
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);
  const { isOpen } = useContext(SideMenuContext);
  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === `/organisation-settings` ||
      location.pathname === `/organisation-settings/`
    )
      navigate(`/organisation-settings/company-profile`);
    setBreadCrumbs([{ title: "Analysis" }, { title: "Settings" }]);
  }, []);
  useEffect(() => {
    if (location.pathname.includes("company-profile")) setActiveTab(1);
    else if (location.pathname.includes("user-profile")) setActiveTab(2);
    else if (location.pathname.includes("subscription-settings"))
      setActiveTab(3);
  }, [location]);
  return (
    <div
      className="organisation__settings__view"
      data-testid="organisation_settings_view"
    >
      <SideMenu />
      <div
        className={
          isOpen
            ? "organisation__settings__container sidemenu_open"
            : "organisation__settings__container sidemenu_close"
        }
      >
        <div className="organisation__settings__view__content">
          <Submenu
            title="Organisation Settings"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            links={[
              {
                to: "/organisation-settings/company-profile",
                title: "Company Profile",
              },
              {
                to: "/organisation-settings/user-profile",
                title: "User Profile",
              },
              {
                to: "/organisation-settings/subscription-settings",
                title: "Subscription Settings",
              },
            ]}
          />
          <div className="outlet__content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationSettings;
