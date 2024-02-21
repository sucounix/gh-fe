import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { planStatus } from "../../../../constant/SubscriptionPlans";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
import axios from "axios";
import { useState } from "react";
import { Flex } from "@mantine/core";
import "./SubscriptionSettings.scss";

const HandleRepayment = () => {
  const [invalidInvoiceIframe, setInvoiceIframe] = useState(null);
  const { subscriptionInfo } = useContext(SubscriptionContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvalidInvoicesIframe();
  }, []);

  useEffect(() => {
    if (subscriptionInfo?.status.toLowerCase() !== planStatus.activating)
      navigate("/");
  }, [subscriptionInfo]);

  const fetchInvalidInvoicesIframe = () => {
    axios
      .get("/subscription/subscriptions/event")
      .then((res) => {
        if (res.data.invoiceStatus !== "Paid")
          setInvoiceIframe(res.data.invoiceCheckoutUrl);
      })
      .catch((err) => {
        navigate("/organisation-settings/subscription-settings");
      });
  };
  return (
    <Flex className="repayment_iframe">
      {invalidInvoiceIframe ? (
        <iframe
          src={invalidInvoiceIframe}
          width="80%"
          height="550px"
          data-testid="repayment-iframe"
        ></iframe>
      ) : null}
    </Flex>
  );
};
export default HandleRepayment;
