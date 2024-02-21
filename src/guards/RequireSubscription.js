import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, useParams } from "react-router";
import { CompaniesContext } from "../contexts/CompaniesContext";
import { SubscriptionContext } from "../contexts/SubscriptionContext";
import { planStatus } from "../constant/SubscriptionPlans";

export default function RequireSubscription() {
  const { companies } = useContext(CompaniesContext);
  const { subscriptionInfo, fetchSubscriptionInfo, subscriptionIsLoading } =
    useContext(SubscriptionContext);
  const [page, setPage] = useState(null);

  let location = useLocation();
  let params = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (!subscriptionInfo) fetchSubscriptionInfo();
  }, []);

  useEffect(() => {
    handleSubscriptionStatusGuard();
  }, [subscriptionIsLoading]);

  const companyEnabled = () => {
    if (params && params.companyId) {
      if (companies.length > 0) {
        let currentCompany = companies.find((company) => {
          return company.uuid === params.companyId;
        });
        return currentCompany?.is_enabled;
      }
    }
    // if the current path doesn't contain a company uuid
    return true;
  };

  const handleSubscriptionStatusGuard = () => {
    if (localStorage.getItem("id_token")) {
      if (!subscriptionIsLoading) {
        if (subscriptionInfo === null) {
          setPage({ to: "/subscription", state: null });
        } else if (
          location.pathname !==
            "/organisation-settings/subscription-settings" &&
          (subscriptionInfo?.status.toLowerCase() === planStatus.cancelled ||
            subscriptionInfo?.status.toLowerCase() === planStatus.activating)
        ) {
          setPage({
            to: "/organisation-settings/subscription-settings",
            state: null,
          });
        } else {
          if (!companyEnabled()) {
            setPage({ to: "/not-found", state: null });
          } else {
            setPage({ to: "outlet", state: null });
          }
        }
      }
    } else {
      setPage({ to: "/login", state: { from: location } });
    }
  };

  if (page)
    if (page.to === "outlet") return <Outlet />;
    else navigate(page.to, { state: page.state });
  return <></>;
}
