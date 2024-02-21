import { Button, Modal } from "@mantine/core";
import React from "react";

function OutstandingConfirmChange({
  showConfirmModal,
  handleHideChangeModal,
  callAPI,
  callAPILoading,
  typeSelected,
}) {
  return (
    <Modal
      opened={showConfirmModal}
      withCloseButton={false}
      size="40%"
      centered
      padding={38}
      radius="lg"
      data-testid="outStanding_confirm_modal"
    >
      <p className="confirm__modal__title" data-testid="confirm__modal__title">
        Are you sure you want to change to{" "}
        {typeSelected === "fixed" ? "fixed" : "variable"} shares
      </p>
      <p
        className="confirm__modal__subtitle"
        data-testid="confirm__modal__subtitle"
      >
        This is a warning message that if you press save{" "}
        {typeSelected === "fixed"
          ? "all the variable amounts "
          : "the fixed amount "}{" "}
        will be changed to{" "}
        {typeSelected === "fixed" ? "a fixed amount " : "variable amounts "}
      </p>
      <p className="confirm__modal__confirm">
        Would you still like to proceed?
      </p>
      <div className="confirm__modal__btns">
        <Button
          size="lg"
          fullWidth
          data-testid="confirm__modal__btn"
          loading={callAPILoading}
          onClick={() => {
            handleHideChangeModal();
            callAPI();
          }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <span>Yes, I am sure</span>
        </Button>
        <Button
          size="lg"
          fullWidth
          variant="outline"
          onClick={() => {
            handleHideChangeModal();
          }}
          data-testid="cancel__modal__btn"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <span>Cancel</span>
        </Button>
      </div>
    </Modal>
  );
}

export default OutstandingConfirmChange;
