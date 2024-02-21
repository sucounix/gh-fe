import React from "react";
import PrivacyPolicyContent from "../../../../public/components/privacy-policy/PrivacyPolicyContent";
import { Divider } from "@mantine/core";
import "./style/PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <div className="privacy__wrapper" data-testid="user_profile">
      <div className="div__start">
        <p className="help__title">Privacy Policy</p>
        <p className="help__subtitle">
          Safeguarding your personal information and digital privacy
        </p>
        <Divider />
      </div>

      <PrivacyPolicyContent />
    </div>
  );
}

export default PrivacyPolicy;
