import { Button, Flex, Modal } from "@mantine/core";
import React from "react";
import "../../../private/pages/analysis/settings/budget/style/BudgetSettings.scss";
import "./style/ConfirmYearChangeModal.scss";

function ConfirmYearChangeModal({
  confirmYearChange,
  targetYear,
  handleChangeYearModalHide,
  setSelectedYear,
}) {
  return (
    <Modal
      id="confirm-year-change-modal"
      data-testid="confirm-year-change-modal"
      opened={confirmYearChange}
      centered
      size={"lg"}
      withCloseButton={false}
      padding={40}
      className="budgets__modal"
      radius="lg"
    >
      <p className="confirm__budgets__title">
        Are you sure you want to change to a different year
      </p>
      <p className="confirm__budgets__subtitle">
        This is a warning message that if you change year value without saving
        all changes will be lost
      </p>
      <Flex
        align={"center"}
        justify={"space-between"}
        className="budgets__modal__buttons"
      >
        <Button
          fullWidth
          size="lg"
          mr={"md"}
          className="budgets__modal__button"
          data-testid="confirm_btn"
          onClick={() => {
            handleChangeYearModalHide();
            setSelectedYear(targetYear);
          }}
        >
          <span>Yes, I am sure</span>
        </Button>
        <Button
          ml="md"
          fullWidth
          size="lg"
          variant="outline"
          className="budgets__modal__button"
          data-testid="close_popup"
          onClick={handleChangeYearModalHide}
        >
          <span>Cancel</span>
        </Button>
      </Flex>
    </Modal>
  );
}

export default ConfirmYearChangeModal;
