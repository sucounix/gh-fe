import React from "react";
import arrow from "../../../../assets/images/arrow.png";
import reportKit from "../../../../assets/images/reportKit.svg";
import { Button, Flex } from "@mantine/core";
import { motion } from "framer-motion";
import "../SubscriptionPlan.scss";

const ReportKitCard = ({ cardData, is_monthly }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="report_kit_card">
        <div className="most_popular_tag">
          <span>Most Popular</span>
        </div>
        <div className="card_content">
          <img src={reportKit} alt="reportKit" className="card_icon" />

          <div className="plan_name_div">
            <span>
              <img src={arrow} alt="arrow" />
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
                <li>
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
                id={"report-plan-btn-monthly"}
                data-testid={"report-plan-btn-monthly"}
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
                id={"report-plan-btn-yearly"}
                data-testid={"report-plan-btn-yearly"}
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
      </div>
    </motion.div>
  );
};

export default ReportKitCard;
