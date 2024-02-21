import React from "react";
import { Flex, Button, Modal } from "@mantine/core";
import "./style/DeleteCompanyModal.scss";

const DeleteCompanyModal = ({
  showDeletePopup,
  onConfirm,
  onCancel,
  deleteLoading,
}) => {
  return (
    <Modal
      opened={showDeletePopup}
      onClose={onCancel}
      centered
      size="lg"
      radius={20}
      padding={0}
      data-testid="delete_modal"
      className="delete__modal"
    >
      <div className="delete__div">
        <h1 className="delete__title__modal" data-testid="delete_modal_title">
          Are you sure you want to delete this company
        </h1>
        <p className="delete__desc__modal">
          By pressing <b>Yes, I am sure</b> you will delete all the data for
          this company
        </p>
        <Flex align="center" justify="space-evenly" mt="lg">
          <Button
            color={"primary"}
            size="lg"
            w="45%"
            className="confirm__btn"
            loading={deleteLoading}
            onClick={onConfirm}
            data-testid="delete_confirm_btn"
          >
            Yes, I am sure
          </Button>
          <Button
            variant="outline"
            color={"primary"}
            size="lg"
            w="45%"
            className="cancel__btn"
            onClick={onCancel}
            data-testid="delete_cancel_btn"
          >
            Cancel
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};

export default DeleteCompanyModal;
