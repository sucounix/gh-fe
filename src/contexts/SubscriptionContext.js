import axios from "axios";
import React, { createContext, useState } from "react";
import { ReachedYourPlanMax } from "../components/modals/reached-your-plan-max/ReachedYourPlanMax";
import {
  planStatus,
  FREE_SUBSCRIPTION_PRICING_MODEL,
} from "../constant/SubscriptionPlans";

const SubscriptionContext = createContext({});

function SubscriptionProvider({ children }) {
  const REFETCH_SUBSCRIPTION_COUNT = 6;
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [subscriptionIsLoading, setsubscriptionIsLoading] = useState(true);

  const fetchSubscriptionInfo = (retrySend = false) => {
    setsubscriptionIsLoading(true);
    axios
      .get("/subscription/subscriptions", {
        "axios-retry": {
          retries: retrySend ? 5 : 0,
          retryCondition: () => true,
          retryDelay: () => {
            return 1000;
          },
        },
      })
      .then((res) => {
        setSubscriptionInfo(res.data);
        setsubscriptionIsLoading(false);
      })
      .catch((e) => {
        setsubscriptionIsLoading(false);
      });
  };

  const isAllowedToAddNewCompany = (
    event = null,
    companies,
    openModal = true
  ) => {
    let isAllowed = true;
    if (
      subscriptionInfo?.quantity <= companies.length ||
      subscriptionInfo?.status.toLowerCase() === planStatus.paused ||
      (subscriptionInfo?.pricingModel === FREE_SUBSCRIPTION_PRICING_MODEL &&
        companies.length > 0)
    ) {
      event?.preventDefault();
      if (openModal) ReachedYourPlanMax();
      isAllowed = false;
    }

    return isAllowed;
  };

  const canCreateReport = () => {
    return (
      subscriptionInfo?.pricingModel !== FREE_SUBSCRIPTION_PRICING_MODEL &&
      (subscriptionInfo?.status.toLowerCase() === planStatus.active ||
        subscriptionInfo?.status.toLowerCase() === planStatus.cancelling ||
        subscriptionInfo?.status.toLowerCase() === planStatus.FutureStartDate ||
        subscriptionInfo?.status.toLowerCase() === planStatus.moving)
    );
  };
  const isAllowedToUseAstra = () => {
    let astraTokenAddon = subscriptionInfo?.addons?.filter(
      (addon) => addon.Code === "astra-token"
    )[0];
    return (
      astraTokenAddon?.Status.toLowerCase() ===
        planStatus.active.toLowerCase() ||
      astraTokenAddon?.Status.toLowerCase() === planStatus.cancelling ||
      astraTokenAddon?.Status.toLowerCase() === planStatus.FutureStartDate ||
      astraTokenAddon?.Status.toLowerCase() === planStatus.moving
    );
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionInfo,
        setSubscriptionInfo,
        subscriptionIsLoading,
        fetchSubscriptionInfo,
        isAllowedToAddNewCompany,
        canCreateReport,
        setsubscriptionIsLoading,
        isAllowedToUseAstra,
        REFETCH_SUBSCRIPTION_COUNT,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export { SubscriptionProvider, SubscriptionContext };
