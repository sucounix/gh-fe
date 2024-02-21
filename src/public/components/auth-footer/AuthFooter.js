import React, { useState } from "react";
import { UnstyledButton } from "@mantine/core";
import "./style/AuthFooter.scss";
import PrivacyPolicyModal from "../../../components/modals/privacy-policy-modal/PrivacyPolicyModal";
import TOSModal from "../../../components/modals/terms-of-service-modal/TOSModal";
import ContactUsModal from "../../../components/modals/contact-us-modal/ContactUsModal";

const AuthFooter = () => {
  const [showToS, setShowToS] = useState(false);
  const [showPP, setShowPP] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);

  const handleHidePrivacyPolicy = () => {
    setShowPP(false);
  };
  const handleHideTOSModal = () => {
    setShowToS(false);
  };
  const handlehideContactUsModal = () => {
    setShowContactUs(false);
  };
  return (
    <div className="auth__footer" data-testid="auth__footer">
      <TOSModal showToS={showToS} handleHideTOSModal={handleHideTOSModal} />
      <PrivacyPolicyModal
        showPP={showPP}
        handleHidePrivacyPolicy={handleHidePrivacyPolicy}
      />
      <ContactUsModal
        showContactUs={showContactUs}
        handlehideContactUsModal={handlehideContactUsModal}
      />
      <div className="auth__footer__links">
        <UnstyledButton
          variant={"white"}
          className="btn_auth_footer"
          data-testid="contact_us_btn"
          onClick={() => {
            setShowContactUs(true);
          }}
        >
          Contact Us
        </UnstyledButton>
        <UnstyledButton
          onClick={() => {
            setShowToS(true);
          }}
          variant={"white"}
          className="btn_auth_footer"
          data-testid="terms_btn"
        >
          Terms
        </UnstyledButton>
        <UnstyledButton
          onClick={() => {
            setShowPP(true);
          }}
          variant={"white"}
          className="btn_auth_footer"
          data-testid="privacy_btn"
        >
          Privacy
        </UnstyledButton>
      </div>
    </div>
  );
};

export default AuthFooter;
