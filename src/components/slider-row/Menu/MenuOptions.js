import React from "react";
import { Menu } from "@mantine/core";
import {
  handleCopyValue,
  handleAdjustByAmount,
  handleAdjustByPercentage,
} from "./MenuMethods";
import { useState } from "react";
import { AdjustByModal } from "../../modals/adjust-by-modal/AdjustByModal";

const MenuOptions = ({
  form,
  rowIndex,
  itemIndex,
  fieldName,
  copyOption = false,
  adjustByAmountOption = false,
  adjustByPercentageOption = false,
  modalTestId = "",
  disabled,
}) => {
  const [adjustType, setAdjustType] = useState(""); // will be "amount" or "percentage"
  const [openAdjustValueModal, setOpenAdjustValueModal] = useState(false);

  const handleAdjustedAmount = (value) => {
    if (adjustType === "amount")
      handleAdjustByAmount(form, itemIndex, fieldName, value);
    else if (adjustType === "percentage")
      handleAdjustByPercentage(form, itemIndex, fieldName, value);
  };

  return (
    <>
      <AdjustByModal
        openAdjustValueModal={openAdjustValueModal}
        setOpenAdjustValueModal={setOpenAdjustValueModal}
        adjustType={adjustType}
        handleAdjustedAmount={handleAdjustedAmount}
        modalTestId={`${modalTestId}__${rowIndex}__${itemIndex}`}
      />
      <Menu shadow="md" zIndex={100}>
        <Menu.Target>
          <span
            data-testid={`menu__target__${rowIndex}__${itemIndex}`}
            className="o__icon fa fa-ellipsis-vertical"
          ></span>
        </Menu.Target>

        <Menu.Dropdown>
          {copyOption && (
            <Menu.Item
              onClick={() => {
                handleCopyValue(form, itemIndex, fieldName);
              }}
              data-testid={`copy__${rowIndex}__${itemIndex}`}
              disabled={disabled}
            >
              Copy same amount to future periods
            </Menu.Item>
          )}
          {adjustByAmountOption && (
            <Menu.Item
              onClick={() => {
                setAdjustType("amount");
                setOpenAdjustValueModal(true);
              }}
              data-testid={`amount_modify__${rowIndex}__${itemIndex}`}
              disabled={disabled}
            >
              Adjust by amount to future periods
            </Menu.Item>
          )}
          {adjustByPercentageOption && (
            <Menu.Item
              onClick={() => {
                setAdjustType("percentage");
                setOpenAdjustValueModal(true);
              }}
              data-testid={`percentage_modify__${rowIndex}__${itemIndex}`}
              disabled={disabled}
            >
              Adjust by percentage to future periods
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default MenuOptions;
