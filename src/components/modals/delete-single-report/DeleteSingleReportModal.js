import React from "react";
import { Button, Flex, Modal } from "@mantine/core";

import "./style/DeleteSingleReport.scss";

const DeleteSingleReportModal = ({
  deleteReportUUID,
  singleDeleteHandlers,
  deleteSingleReport,
  deleteLoader,
}) => {
  return (
    <Modal
      opened={true}
      onClose={() => singleDeleteHandlers.close()}
      withCloseButton={false}
      radius={"20px"}
      size={"lg"}
      centered
      padding="0"
    >
      <div
        className="single__delete__modal"
        data-testid="single__delete__modal"
      >
        <p className="title">
          <span className="icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </span>
          <span>Are you sure you want to delete this report</span>
        </p>
        <p className="text">
          By pressing Yes, I am sure the report and all its data will be
          permanently deleted
        </p>
        <p className="text">Would you still like to proceed?</p>
        <Flex className="center" justify={"space-between"}>
          <Button
            size="lg"
            w="48%"
            color="red"
            className="action_btn"
            onClick={() => {
              deleteSingleReport(deleteReportUUID);
            }}
            loading={deleteLoader}
            data-testid="confirm_bulk_delete"
          >
            Yes, I am sure
          </Button>
          <Button
            size="lg"
            w="48%"
            variant="outline"
            className="action_btn"
            onClick={() => singleDeleteHandlers.close()}
            disabled={deleteLoader}
            data-testid="cancel_bulk_delete"
          >
            Cancel
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};

export default DeleteSingleReportModal;
