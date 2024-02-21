import React from "react";
import successful_animation from "../../../../assets/images/successful animation.png";
import { Flex } from "@mantine/core";
import "../SubscriptionPlan.scss";

const PaymentSuccessUI = () => {
  return (
    <div
      className="subscription_redirect_page"
      data-testid={`subscription_reporting_plan`}
    >
      <div className="overlay"></div>
      <Flex align={"center"} justify={"center"}>
        <div className="center_box">
          <div className="box_header">
            <img src={successful_animation} alt="successful animation" />
          </div>
          <div className="box_info">
            <p className="box_title">Payment Successful</p>
            <p className="box_desc">
              Your payment is secure, and your subscription is active. Explore
              valuable insights in the 'Reports' section
            </p>
          </div>
        </div>
      </Flex>
    </div>
  );
};
export default PaymentSuccessUI;
