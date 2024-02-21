import React from "react";
import { Button, Modal } from "@mantine/core";
import startup from "../../../assets/images/startup.png";
import { useNavigate } from "react-router-dom";

import "./UpgradeSubscriptionForReportKit.scss";

const UpgradeSubscriptionForReportKit = ({
  pricePlan,
  showUpgradeSubscriptionPopup,
  setShowUpgradeSubscriptionPopup,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      opened={showUpgradeSubscriptionPopup}
      onClose={() => setShowUpgradeSubscriptionPopup(false)}
      radius={"lg"}
      size="40%"
      withCloseButton={false}
      padding={0}
    >
      <div
        className="upgrade_subscription_for_report_kit"
        data-testid="upgrade_subscription_for_report_kit"
      >
        <div className="title_div">
          <img src={startup} alt="rocket icon" />
          <p>Reporting Kit</p>
        </div>
        <div className="content">
          <div className="text_div">
            <i className="fa-solid fa-triangle-exclamation icon"></i>
            <p>
              You need to subscribe on the{" "}
              <span className="bold_word">Reporting Kit</span>{" "}
            </p>
          </div>
          <div className="kit_info">
            <ul>
              <li className="info">
                1 company: <span className="price_plan">{pricePlan}</span> EGP
              </li>
              <li className="info">
                get additional
                <span className="discount_percentage"> 2.5% </span>off with each
                added company
              </li>
            </ul>
          </div>

          <div className="btns_div">
            <Button
              variant="outline"
              size="lg"
              w={"48%"}
              data-testid="cancel_btn"
              onClick={() => {
                setShowUpgradeSubscriptionPopup(false);
              }}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              w={"48%"}
              data-testid="go_to_subscription_settings"
              onClick={() => {
                navigate(`/organisation-settings/subscription-settings`);
              }}
            >
              Go to subscribtion
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default UpgradeSubscriptionForReportKit;
