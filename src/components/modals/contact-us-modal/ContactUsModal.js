import { Button, Modal } from "@mantine/core";
import React from "react";
import "../../../public/components/auth-footer/style/AuthFooter.scss";

function ContactUsModal({ showContactUs, handlehideContactUsModal }) {
  return (
    <Modal
      size={"lg"}
      opened={showContactUs}
      onClose={handlehideContactUsModal}
      centered
      transitionProps={{ timeout: 500 }}
      radius={15}
      withCloseButton={false}
      data-testid="contact__modal"
    >
      <div
        style={{ padding: "2rem" }}
        className="contact__modal"
        data-testid="contact__modal_content"
      >
        <h1 className="contact__us__title">Contact Us</h1>
        <p className="contact__us__subtitle">
          let’s connect. We’re here to help, and we would love to hear from you!
          whether you have a question, a comment, or just want to chat, you can
          reach out to us through the contact below
        </p>
        <div className="contact__row">
          <i className="fas fa-envelope icon"></i>
          <a
            href="mailto:
                  suuport@femtofpa.com"
            style={{ color: "inherit" }}
          >
            <span className="contact__us__email__content">
              support@femtofpa.com
            </span>
          </a>
        </div>
        <div className="contact__row">
          <i className="fas fa-phone-alt icon"></i>
          <span className="contact__us__email__content">+20 1206988881 </span>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <Button
            size="md"
            variant="outline"
            data-testid="close_btn"
            onClick={handlehideContactUsModal}
          >
            <span>Close</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ContactUsModal;
