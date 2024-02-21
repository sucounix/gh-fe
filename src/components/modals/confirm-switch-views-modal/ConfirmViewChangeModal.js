import { Button, Modal } from "@mantine/core";
import React from "react";
import "./style/ConfirmViewChangeModal.scss";

function ConfirmViewChangeModal({
  confirmChangeShow,
  type,
  handleSubmit,
  submitLoading,
  form,
  item,
  handleHideChangeViewModal,
}) {
  return (
    <Modal
      id={"sure-change-modal"}
      data-testid={"sure-change-modal"}
      opened={confirmChangeShow}
      onClose={handleHideChangeViewModal}
      padding={40}
      centered
      radius={"lg"}
      size={"lg"}
      withCloseButton={false}
      className="alerts__modal"
    >
      <div className="confirm__view__modal__content">
        <span
          className="confirm__view__modal__title"
          data-testid="confirm__view__modal__title"
        >
          Are you want to change to
          {type === "variable" ? " variable " : " fixed "} {item}
        </span>
        <span
          className="confirm__view__modal__subtitle"
          data-testid="confirm__view__modal__subtitle"
        >
          This is a warning message that if you press save all the{" "}
          {type === "variable" ? "fixed " : "variable "}
          amount will be changed to a{" "}
          {type === "variable" ? "variable " : "fixed "} amount{" "}
        </span>
        <span className="confirm__view__modal__proceed">
          Would you still like to proceed?
        </span>
        <div className="confirm__view__modal__buttons">
          <Button
            fullWidth
            size="xl"
            className="confirm__view__modal__button"
            onClick={() => {
              handleSubmit(form.values);
            }}
            loading={submitLoading}
            data-testid="switch_view_confirm_btn"
          >
            <span>Yes, I am sure</span>
          </Button>
          <Button
            fullWidth
            size="xl"
            variant="outline"
            className="confirm__view__modal__button"
            data-testid="close_popup"
            onClick={handleHideChangeViewModal}
          >
            <span>Cancel</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmViewChangeModal;
