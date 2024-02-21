import React, { useEffect, useState, useContext } from "react";
import { Button, Flex } from "@mantine/core";
import axios from "axios";
import loadingSpinner from "../../../../assets/images/loadingkpis.gif";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
import { planStatus } from "../../../../constant/SubscriptionPlans";
import "./SubscriptionSettings.scss";

const SubscriptionSettings = () => {
  const WAITING_TIME = 5000;
  const [loading, setLoading] = useState(true);
  // custom portal
  const [subscriptionToken, setSubscriptionToken] = useState(null);
  // handle activating status
  const [invalidInvoiceIframe, setInvalidInvoiceIframe] = useState(null);
  const [currentSubscriptionInfo, setCurrentSubscriptionInfo] = useState(null);

  const { subscriptionInfo, fetchSubscriptionInfo } =
    useContext(SubscriptionContext);

  useEffect(() => {
    setCurrentSubscriptionInfo(subscriptionInfo);
  }, [subscriptionInfo]);

  useEffect(() => {
    if (currentSubscriptionInfo) {
      if (
        currentSubscriptionInfo?.status.toLowerCase() === planStatus.activating
      ) {
        if (!invalidInvoiceIframe) {
          handleActivatingSubscription();
        }
      } else {
        fetchSubscriptionToken();
      }
    }
  }, [currentSubscriptionInfo]);

  useEffect(() => {
    return () => {
      fetchSubscriptionInfo();
    };
  }, []);

  // for custom portal
  const fetchSubscriptionToken = () => {
    axios.get(`/subscription/subscriptions/token`).then((res) => {
      setSubscriptionToken(res.data.customerToken);
      setLoading(false);
    });
  };

  const handleActivatingSubscription = () => {
    let endpoints = [
      "/subscription/subscriptions",
      "/subscription/subscriptions/event",
    ];

    setTimeout(async () => {
      axios
        .all(endpoints.map((endpoint) => axios.get(endpoint)))
        .then((response) => {
          const [subscriptionRes, invoiceIframeRes] = response;
          setCurrentSubscriptionInfo(subscriptionRes.data);
          if (
            subscriptionRes.data.status.toLowerCase() === planStatus.activating
          ) {
            setInvalidInvoiceIframe(invoiceIframeRes.data?.invoiceCheckoutUrl);
            setLoading(false);
          } else {
            setInvalidInvoiceIframe(null);
          }
        })
        .catch(() => {});
    }, WAITING_TIME);
  };

  return loading ? (
    <Flex align={"center"} justify={"center"} h="100vh" className="loading_div">
      <div>
        <img
          src={loadingSpinner}
          alt="loadingSpinner"
          style={{ width: "200px" }}
        />
        <p className="loading_text">Hold on a second... </p>
      </div>
    </Flex>
  ) : (
    <div className="subscription__settings">
      {subscriptionToken ? (
        <div data-testid="subscription__settings_iframe">
          <iframe
            src={`${process.env.REACT_APP_SUBSBASE_CUSTOM_PORTAL_URL}?token=${subscriptionToken}&show=dashboard,paymenthistory,paymentmethods,subscriptions`}
            width="100%"
            height="850px"
            key={"custom_portal"}
          ></iframe>
        </div>
      ) : null}

      {invalidInvoiceIframe ? (
        <div className="repayment_iframe" data-testid="repayment_iframe">
          <iframe
            src={invalidInvoiceIframe}
            width="80%"
            height="550px"
            key={"repayment_iframe_portal"}
          ></iframe>
        </div>
      ) : null}
    </div>
  );
};

export default SubscriptionSettings;
