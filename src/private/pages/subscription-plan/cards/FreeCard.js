import React from "react";
import arrow from "../../../../assets/images/arrow.png";
import freeCard from "../../../../assets/images/freeCard.svg";
import { Button, Flex } from "@mantine/core";
import { motion } from "framer-motion";
import "../SubscriptionPlan.scss";

const FreeCard = ({ cardData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="free_card">
        <img src={freeCard} alt="freeCard" className="card_icon" />

        <div className="plan_name_div">
          <span>
            <img src={arrow} alt="arrow" />
          </span>
          <span className="plan_name">{cardData.plan_name}</span>
        </div>
        <p className="label">{cardData.label}</p>
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
        <Flex align={"center"} justify={"center"} mt="19px" className="btn_div">
          <Button
            size="md"
            fullWidth
            radius={6}
            id="starter-plan-btn"
            data-testid="starter-plan-btn"
          >
            Get started for free
          </Button>
        </Flex>
      </div>
    </motion.div>
  );
};

export default FreeCard;
