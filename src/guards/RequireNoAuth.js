import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Outlet } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { CompaniesContext } from "../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../contexts/CompanyPreferencesFilter";
import { SubscriptionContext } from "../contexts/SubscriptionContext";
import { TutorialVideosContext } from "../contexts/TutorialVideos";
import { Auth } from "aws-amplify";

export default function RequireNoAuth() {
  const [page, setPage] = useState(null);

  const { setUser } = useContext(UserContext);
  const { setCompanies, setSelectedCompany } = useContext(CompaniesContext);
  const { setCompanyAPIPreferences } = useContext(CompanyPreferencesApiContext);
  const { setCompanyFilterPreferences } = useContext(
    CompanyPreferencesFilterContext
  );
  const { setSubscriptionInfo } = useContext(SubscriptionContext);
  const { clearCurrentVideo } = useContext(TutorialVideosContext);

  let navigate = useNavigate();

  useEffect(() => {
    handleGetUser();
  }, []);

  const clearAllContextData = () => {
    setUser(null);
    setCompanies(null);
    setSelectedCompany(null);
    setCompanyAPIPreferences(null);
    setCompanyFilterPreferences(null);
    setSubscriptionInfo(null);
    clearCurrentVideo();
    localStorage.clear();
    sessionStorage.clear();
  };

  const handleGetUser = async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      if (cognitoUser?.signInUserSession?.idToken?.jwtToken) {
        setPage("/");
      } else {
        clearAllContextData();
        setPage("outlet");
      }
    } catch (error) {
      clearAllContextData();
      setPage("outlet");
    }
  };

  if (page)
    if (page === "outlet") return <Outlet />;
    else navigate(page);
  return <></>;
}
