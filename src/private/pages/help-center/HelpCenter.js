import React, { useContext, useEffect, useState } from "react";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import SideMenu from "../../layout/sidemenu/SideMenu";
import { SideMenuContext } from "../../../contexts/SideMenuContext";
import "./style/HelpCenter.css";
import Submenu from "../../../components/submenu/Submenu";

const HelpCenter = () => {
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);
  const { isOpen } = useContext(SideMenuContext);

  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === `/help-center` ||
      location.pathname === `/help-center/`
    )
      navigate(`/help-center/faq`);
    setBreadCrumbs([{ title: "Help Center" }]);
  }, []);
  useEffect(() => {
    if (location.pathname.includes("faq")) setActiveTab(1);
    else if (location.pathname.includes("terms-and-conditions"))
      setActiveTab(2);
    else if (location.pathname.includes("privacy-policy")) setActiveTab(3);
  }, [location]);
  return (
    <div className="help_center__settings__view" data-testid="help_center">
      <SideMenu />
      <div
        className={
          isOpen
            ? "help_center__settings__container sidemenu_open"
            : "help_center__settings__container sidemenu_close"
        }
      >
        <div className="help_center__settings__view__content">
          <Submenu
            title="Help Center"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            links={[
              { to: "/help-center/faq", title: "FAQ" },
              {
                to: "/help-center/terms-and-conditions",
                title: "Terms and Conditions",
              },
              { to: "/help-center/privacy-policy", title: "Privacy Policy" },
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

export default HelpCenter;
