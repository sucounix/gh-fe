import React, { useContext } from "react";
import { Button, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { formatNumber } from "../../../helpers/NumberFormat";

const RechargeTokens = () => {
  const { subscriptionInfo } = useContext(SubscriptionContext);
  const { selectedCompany } = useContext(CompaniesContext);

  const addonsArr = subscriptionInfo?.addons;
  const navigate = useNavigate();

  return subscriptionInfo && addonsArr?.length ? (
    <Flex
      align={"center"}
      justify="space-between"
      data-testid="recharge_tokens"
      className="recharge__view"
    >
      <span className="recharge__text">{`You used ${formatNumber(
        addonsArr[0].astra_tokens.used,
        selectedCompany?.currency
      )} token from ${formatNumber(
        addonsArr[0].astra_tokens.balance,
        selectedCompany?.currency
      )} token`}</span>
      <Button
        className="recharge__btn"
        data-testid="recharge__btn"
        onClick={() => {
          navigate("/organisation-settings/subscription-settings");
        }}
      >
        Add extra
      </Button>
    </Flex>
  ) : null;
};

export default RechargeTokens;
