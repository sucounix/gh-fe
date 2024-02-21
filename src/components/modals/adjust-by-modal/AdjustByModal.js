import React, { useState } from "react";
import { Button, Flex, Modal, NumberInput } from "@mantine/core";
import { renderUnit } from "../../../private/helpers/RenderUnit";
import "./style/AdjustByModal.scss";

export const AdjustByModal = ({
  openAdjustValueModal,
  setOpenAdjustValueModal,
  adjustType,
  handleAdjustedAmount,
  modalTestId,
}) => {
  const [amount, setAmount] = useState(0);
  return (
    <Modal
      centered
      trapFocus={false}
      size={532}
      radius={20}
      padding={"0"}
      opened={openAdjustValueModal}
      withCloseButton={false}
      data-testid={modalTestId}
      onClose={() => {
        setOpenAdjustValueModal(false);
      }}
    >
      <div className="adjust__value__modal" data-testid="adjust__value__modal">
        <div className="flex__content">
          {adjustType === "amount" ? (
            <span className="adjust_title">
              Adjust by amount to future periods
            </span>
          ) : (
            <span className="adjust_title">
              Adjust by percentage to future periods
            </span>
          )}
          <NumberInput
            type="number"
            defaultValue={0}
            hideControls
            style={{ width: 175 }}
            data-testid="variable__input__adjust"
            thousandsSeparator="."
            decimalSeparator=","
            rightSection={
              <div>
                {renderUnit(adjustType === "percentage" && "Percentage")}
              </div>
            }
            onChange={(value) => {
              setAmount(value ? value : 0);
            }}
          />
        </div>
        <Flex align={"center"} justify={"space-between"} className="btn__div">
          <Button
            className="confirm__Btn_change"
            data-testid="save_btn"
            size="lg"
            w={"48%"}
            radius={6}
            onClick={() => {
              handleAdjustedAmount(amount);
              setOpenAdjustValueModal(false);
            }}
          >
            Save
          </Button>
          <Button
            className="cancel__Btn_change"
            size="lg"
            w={"48%"}
            radius={6}
            variant="outline"
            onClick={() => {
              setOpenAdjustValueModal(false);
            }}
          >
            Cancel
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};
