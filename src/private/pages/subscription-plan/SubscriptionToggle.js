import React from "react";
import "./SubscriptionPlan.scss";

const SubscriptionToggle = ({ data, is_monthly, setIsMonthly }) => {
  return (
    <div className="subscription_toggle">
      <div className="content">
        <div
          data-testid="monthly_option"
          className={is_monthly ? "active_option" : "option"}
          onClick={() => setIsMonthly(true)}
        >
          Monthly
        </div>
        <div
          data-testid="yearly_option"
          className={!is_monthly ? "active_option" : "option"}
          onClick={() => setIsMonthly(false)}
        >
          Yearly
          <div className="tag">{data.plans[1].discount} off</div>
        </div>
      </div>
    </div>
  );
};
export default SubscriptionToggle;
