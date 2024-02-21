import React from "react";
import astraCardIcon from "../../../../assets/images/astraCardIcon.svg";
import astraColoredLogo from "../../../../assets/images/astraColoredLogo.svg";
import { Button } from "@mantine/core";
import { motion } from "framer-motion";
import "../SubscriptionPlan.scss";

const AstraCard = ({ cardData, is_monthly }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="astra_Card">
        <img src={astraCardIcon} alt="astraCardIcon" className="card_icon" />

        <div className="plan_name_div">
          <span>
            <img src={astraColoredLogo} alt="astraLogo" />
          </span>
          <span className="plan_name">{cardData.plan_name}</span>
        </div>
        <p className="label">
          {is_monthly ? cardData.monthlyPrice : cardData.yearlyPrice}
          <span className="currency">{cardData.currency}</span>
        </p>
        <p className="subtitle">{cardData.subtitle}</p>
        <div className="seperator"></div>
        <p className="features_title">{cardData.features_title}</p>
        <ul className="features_list">
          {cardData?.features_list.map((feature) => {
            return (
              <li className="itemContainer">
                <span>
                  <i class="fa-solid fa-circle-check check_icon"></i>
                </span>
                <span className="item">{feature}</span>
              </li>
            );
          })}
        </ul>
        <div className="btn_div">
          <div className="report_btns_plan">
            <Button
              size="md"
              fullWidth
              radius={6}
              id={"astra-plan-btn-monthly"}
              data-testid={"astra-plan-btn-monthly"}
              className="report_plan_btn"
              style={{
                zIndex: is_monthly ? "10" : "0",
              }}
            >
              Get started
            </Button>
            <Button
              size="md"
              fullWidth
              radius={6}
              id={"astra-plan-btn-yearly"}
              data-testid={"astra-plan-btn-yearly"}
              className="report_plan_btn"
              style={{
                zIndex: !is_monthly ? "10" : "0",
              }}
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AstraCard;
