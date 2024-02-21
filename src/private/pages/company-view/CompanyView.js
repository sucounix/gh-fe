import React, { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideMenu from "../../layout/sidemenu/SideMenu";
import "./style/CompanyView.scss";
import { SideMenuContext } from "../../../contexts/SideMenuContext";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { handleChangeCompanyPathIsDone } from "../../helpers/HandleChangeCompanyPath";
import { TimeFrameContext } from "../../../contexts/TimeFrameContext";
import { CompanyPreferencesApiContext } from "../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../contexts/CompanyPreferencesFilter";
function CompanyView() {
  const { isOpen } = useContext(SideMenuContext);

  const { selectedCompany, setIsTimeframeReady, setIsAPIPreferencesReady } =
    useContext(CompaniesContext);
  const { fetchTimeFrame } = useContext(TimeFrameContext);
  const { getCompanyAPIPreferences } = useContext(CompanyPreferencesApiContext);

  const { getCompanyFilterPreferences } = useContext(
    CompanyPreferencesFilterContext
  );

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCompany) {
      let newPath = handleChangeCompanyPathIsDone({
        newCompany: selectedCompany,
        location,
      });
      // when change the {selectedCompany}
      // if the current path has a company UUID
      // then we need to change it to the new UUID
      // and re-fetch the timeframe for the new {selectedCompany}
      if (newPath) {
        setIsAPIPreferencesReady(false);
        setIsTimeframeReady(false);

        navigate(newPath);
        fetchTimeFrame(selectedCompany?.uuid);
        getCompanyAPIPreferences(selectedCompany?.uuid);
        getCompanyFilterPreferences(selectedCompany?.uuid);
      }
    }
  }, [selectedCompany?.uuid]);

  return (
    <div className="CompanyView" data-testid="CompanyView">
      <SideMenu />
      <div
        className={
          isOpen
            ? "company_content sidemenu_open"
            : "company_content sidemenu_close"
        }
        data-testid="company_content"
      >
        <Outlet />
      </div>
    </div>
  );
}

export default CompanyView;
