import { Button, Flex, Modal } from "@mantine/core";
import React from "react";
import TermsOfServiceContent from "../../../public/components/terms-of-service/TermsOfServiceContent";
import "../../../public/components/auth-footer/style/AuthFooter.scss";

function TOSModal({ showToS, handleHideTOSModal }) {
  return (
    <Modal
      size={"xl"}
      opened={showToS}
      onClose={handleHideTOSModal}
      centered
      transitionProps={{ timeout: 500 }}
      radius={15}
      withCloseButton={false}
    >
      <div className="tos__modal" data-testid="tos_modal">
        <div className="tos__modal__title"> Terms and Conditions</div>
        <div className="tos__modal__content">
          <TermsOfServiceContent />
        </div>
        <Flex
          align={"center"}
          justify={"center"}
          className="tos__modal__footer"
        >
          <Button
            size="lg"
            data-testid="close_popup"
            onClick={handleHideTOSModal}
          >
            <span>Close</span>
          </Button>
        </Flex>
      </div>
    </Modal>
  );
}

export default TOSModal;
