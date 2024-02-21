import React from "react";
import "./style/TermsAndConditions.css";
import TermsOfServiceContent from "../../../../public/components/terms-of-service/TermsOfServiceContent";
import { Divider } from "@mantine/core";

const TermsAndConditions = () => {
  return (
    <div className="tos__wrapper" data-testid="user_profile">
      <div className="div__start">
        <p className="help__title">Terms and Conditions</p>
        <p className="help__subtitle">
          Guidelines and agreements for optimal interaction
        </p>
        <Divider />
      </div>

      <TermsOfServiceContent />
    </div>
  );
};

export default TermsAndConditions;
