import React from "react";
import { Button, Modal } from "@mantine/core";
import startup from "../../../assets/images/startup.png";
import { useNavigate } from "react-router-dom";
import "./UpgradeSubscriptionForAstraKit.scss";

export default function UpgradeSubscriptionForAstraKit({
  pricePlan,
  showUpgradeSubscriptionPopup,
  closeUpgradeSubscriptionPopup,
}) {
  const navigate = useNavigate();
  return (
    <Modal
      opened={showUpgradeSubscriptionPopup}
      onClose={closeUpgradeSubscriptionPopup}
      radius={"lg"}
      size="40%"
      withCloseButton={false}
      padding={0}
    >
      <div
        className="upgrade_subscription_for_astra_kit"
        data-testid="upgrade_subscription_for_astra_kit"
      >
        <div className="title_div">
          <img src={startup} alt="rocket icon" />
          <p>Astra Kit</p>
        </div>
        <div className="content">
          <div className="text_div">
            <i className="fa-solid fa-triangle-exclamation icon"></i>
            <p>
              You need to subscribe on the{" "}
              <span className="bold_word">Astra Kit</span>{" "}
            </p>
          </div>
          <div className="kit_info">
            <ul>
              <li className="info">
                1 Company: <span className="price_plan">{pricePlan}</span> EGP
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
                closeUpgradeSubscriptionPopup();
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
}
