import { useContext, useEffect, useState } from "react";
import { Progress } from "@mantine/core";
import React from "react";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
import {
  ASTRA_PLAN_ANNUALLY,
  ASTRA_PLAN_MONTHLY,
} from "../../../../constant/SubscriptionPlans";
import { useNavigate } from "react-router-dom";

function AstraTokensPopover() {
  const { subscriptionInfo } = useContext(SubscriptionContext);
  const [astraTokenAddon, setAstraTokenAddon] = useState(null);

  useEffect(() => {
    setAstraTokenAddon(
      subscriptionInfo?.addons?.filter(
        (addon) => addon.Code === "astra-token"
      )[0]
    );
  }, [subscriptionInfo]);

  const navigate = useNavigate();

  const handleNavigateToSubscriptionSettings = () => {
    navigate(`/organisation-settings/subscription-settings`);
  };

  return (
    <div
      className="astra__popover"
      data-testid="astra__popover"
      role="astra__popover"
    >
      <div className="astra__message">
        <i
          style={{ color: "#771dfc !important" }}
          className="fa-solid fa-wand-magic"
        ></i>
        {subscriptionInfo?.planCode !== ASTRA_PLAN_MONTHLY &&
        subscriptionInfo?.planCode !== ASTRA_PLAN_ANNUALLY ? (
          <span>You should subscribe to Astra</span>
        ) : astraTokenAddon?.astra_tokens ? (
          <>
            <span>
              You have{" "}
              {astraTokenAddon?.astra_tokens?.balance -
                astraTokenAddon?.astra_tokens?.used}{" "}
              tokens for text generation. Let the magic begin!
            </span>
          </>
        ) : (
          <div className="astra__action">
            <span>Out of Tokens! Upgrade for endless access </span>
          </div>
        )}
      </div>
      <div className="astra__action">
        {subscriptionInfo?.planCode !== ASTRA_PLAN_MONTHLY &&
        subscriptionInfo?.planCode !== ASTRA_PLAN_ANNUALLY ? (
          <button
            className="upgrade__button"
            data-testid="upgrade__button"
            onClick={handleNavigateToSubscriptionSettings}
          >
            Subscribe Now
          </button>
        ) : (subscriptionInfo?.planCode === ASTRA_PLAN_ANNUALLY ||
            subscriptionInfo?.planCode === ASTRA_PLAN_MONTHLY) &&
          (!astraTokenAddon?.astra_tokens ||
            astraTokenAddon?.astra_tokens?.used ===
              astraTokenAddon?.astra_tokens?.balance) ? (
          <>
            <Progress value={0} color="#771dfc" />
            <button
              className="upgrade__button"
              data-testid="upgrade__button"
              onClick={handleNavigateToSubscriptionSettings}
            >
              Upgrade Now
            </button>
          </>
        ) : (subscriptionInfo?.planCode === ASTRA_PLAN_ANNUALLY ||
            subscriptionInfo?.planCode === ASTRA_PLAN_MONTHLY) &&
          astraTokenAddon?.astra_tokens ? (
          <Progress
            value={
              (astraTokenAddon?.astra_tokens?.used /
                astraTokenAddon?.astra_tokens?.balance) *
              100
            }
            color="#771dfc"
          />
        ) : null}
      </div>
    </div>
  );
}

export default AstraTokensPopover;
