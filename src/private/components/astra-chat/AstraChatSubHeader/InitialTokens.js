import React, { useContext, useEffect } from "react";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";

const InitialTokens = () => {
  const { subscriptionInfo, fetchSubscriptionInfo, subscriptionIsLoading } =
    useContext(SubscriptionContext);

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  return (
    !subscriptionIsLoading &&
    subscriptionInfo &&
    subscriptionInfo.addons.length > 0 && (
      <div className="initial__tokens__div" data-testid="initial__tokens">
        <p className="initial__tokens">
          You have
          <span className="initial__tokens__span">
            {new Intl.NumberFormat().format(
              subscriptionInfo.addons[0].astra_tokens.balance -
                subscriptionInfo.addons[0].astra_tokens.used
            )}
          </span>
          tokens for your Astra financial journey. Let's begin
        </p>
      </div>
    )
  );
};

export default InitialTokens;
