import React, { useContext, useState, useEffect, useRef } from "react";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
import { Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import loadingSpinner from "../../../assets/images/loadingkpis.gif";
import {
  STARTER_PLAN,
  FREE_SUBSCRIPTION_PRICING_MODEL,
  planStatus,
} from "../../../constant/SubscriptionPlans";
import PaymentSuccessUI from "./redirectUI/PaymentSuccessUI";
import "./SubscriptionPlan.scss";

const REDIRECT_WAIT_TIME = 3000;
const REFETCH_SUBSCRIPTION_INTERVAL = 5000;

const SubscriptionRedirect = () => {
  const refetchSubscriptionTimer = useRef(null);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [loader, setLoader] = useState(false);
  const [refetchSubsctionInfoCount, setRefetchSubsctionInfoCount] = useState(0);
  const {
    fetchSubscriptionInfo,
    subscriptionInfo,
    subscriptionIsLoading,
    REFETCH_SUBSCRIPTION_COUNT,
  } = useContext(SubscriptionContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionInfo(true);
  }, []);

  useEffect(() => {
    if (subscriptionInfo?.planCode === STARTER_PLAN) navigate("/");
    else if (
      subscriptionInfo?.pricingModel !== FREE_SUBSCRIPTION_PRICING_MODEL &&
      subscriptionInfo?.status.toLowerCase() === planStatus.active
    ) {
      setLoader(false);
      setShowSuccessView(true);
      setTimeout(() => {
        navigate("/");
      }, REDIRECT_WAIT_TIME);
    } else if (
      subscriptionInfo?.pricingModel !== FREE_SUBSCRIPTION_PRICING_MODEL &&
      subscriptionInfo?.status.toLowerCase() === planStatus.activating
    ) {
      if (refetchSubsctionInfoCount < REFETCH_SUBSCRIPTION_COUNT) {
        setLoader(true);
        refetchSubscriptionTimer.current = setTimeout(() => {
          setRefetchSubsctionInfoCount(refetchSubsctionInfoCount + 1);
          fetchSubscriptionInfo();
        }, REFETCH_SUBSCRIPTION_INTERVAL);
      } else {
        navigate("/organisation-settings/subscription-settings");
      }
    }
    return () => {
      clearTimeout(refetchSubscriptionTimer.current);
    };
  }, [subscriptionInfo]);

  return (
    <>
      {subscriptionIsLoading || loader ? (
        <Flex
          align={"center"}
          justify={"center"}
          h="100vh"
          className="loading_div"
        >
          <div>
            <img
              src={loadingSpinner}
              alt="loadingSpinner"
              style={{ width: "200px" }}
              data-testid="subscription_loader"
            />
            <p className="loading_text">Hold on a second... </p>
          </div>
        </Flex>
      ) : showSuccessView ? (
        <PaymentSuccessUI />
      ) : null}
      ;
    </>
  );
};

export default SubscriptionRedirect;
