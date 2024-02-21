import { Button, Flex, Modal } from "@mantine/core";
import React from "react";
import PrivacyPolicyContent from "../../../public/components/privacy-policy/PrivacyPolicyContent";
import "../../../public/components/auth-footer/style/AuthFooter.scss";

function PrivacyPolicyModal({ showPP, handleHidePrivacyPolicy }) {
  return (
    <Modal
      size={"xl"}
      opened={showPP}
      onClose={handleHidePrivacyPolicy}
      centered
      transitionProps={{ timeout: 500 }}
      radius={15}
      padding={30}
      withCloseButton={false}
      data-testid="privacy_policy_modal"
    >
      <div
        style={{ padding: "2rem 0 0 0" }}
        className="PP__modal"
        data-testid="pp_modal"
      >
        <div className="pp__modal__title"> Privacy Policy</div>
        <div className="pp__modal__content">
          <PrivacyPolicyContent />
        </div>
        <Flex align={"center"} justify={"center"} className="pp__modal__footer">
          <Button
            size="lg"
            data-testid="close_popup"
            onClick={handleHidePrivacyPolicy}
          >
            <span>Close</span>
          </Button>
        </Flex>
      </div>
    </Modal>
  );
}

export default PrivacyPolicyModal;
