import React from "react";
import { Button, Flex, Modal } from "@mantine/core";

import "./style/DeleteMultipleReport.scss";

const DeleteMultipleReportModal = ({
  multipleDeleteHandlers,
  deleteMultipleReport,
  deleteLoader,
}) => {
  return (
    <Modal
      opened={true}
      onClose={() => multipleDeleteHandlers.close()}
      withCloseButton={false}
      radius={"20px"}
      size={"lg"}
      centered
      padding="0"
    >
      <div
        className="multiple__delete__modal"
        data-testid="multiple__delete__modal"
      >
        <p className="title">
          <span className="icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </span>
          <span>Are you sure you want to delete selected reports</span>
        </p>
        <p className="text">
          By pressing Yes, I am sure the reports and all their data will be
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
              deleteMultipleReport();
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
            onClick={() => multipleDeleteHandlers.close()}
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

export default DeleteMultipleReportModal;
