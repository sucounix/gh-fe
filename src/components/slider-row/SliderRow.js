import React, { useContext } from "react";
import { NumberInput } from "@mantine/core";
import MenuOptions from "./Menu/MenuOptions";
import { handleCurrencyPrecision } from "../../private/helpers/handleCurrency";
import { CompaniesContext } from "../../contexts/CompaniesContext";
import "./style/SliderRow.scss";

const SliderRow = ({
  form,
  formValues,
  fieldName,
  rowIndex = 0,
  copyOption = false,
  adjustByAmountOption = false,
  adjustByPercentageOption = false,
  rightSection = null,
  defaultValue = 0,
  modalTestId = "",
  disabled = false,
  labelKey = "date",
}) => {
  const { selectedCompany } = useContext(CompaniesContext);
  return (
    <div className="slider__row" data-testid="single__row__component">
      {formValues &&
        formValues?.map((item, itemIndex) => {
          return (
            <div
              className="item"
              key={`variable__input__${rowIndex}__${itemIndex}_item`}
            >
              <div className="item__content">
                <NumberInput
                  type="number"
                  disabled={disabled}
                  id={`input-${itemIndex}`}
                  defaultValue={item && item.value}
                  value={item && item.value}
                  label={item[labelKey]}
                  hideControls
                  className="number__input"
                  key={`variable__input__${rowIndex}__${itemIndex}`}
                  data-testid={`variable__input__${rowIndex}__${itemIndex}`}
                  thousandsSeparator=","
                  decimalSeparator="."
                  rightSection={rightSection}
                  precision={handleCurrencyPrecision(selectedCompany.currency)}
                  onChange={(value) => {
                    form.setFieldValue(
                      `${fieldName}.${itemIndex}.value`,
                      value === "" ? defaultValue : value
                    );
                  }}
                />
                {itemIndex < formValues.length - 1 && (
                  <MenuOptions
                    form={form}
                    rowIndex={rowIndex}
                    itemIndex={itemIndex}
                    fieldName={fieldName}
                    adjustByAmountOption={adjustByAmountOption}
                    copyOption={copyOption}
                    adjustByPercentageOption={adjustByPercentageOption}
                    modalTestId={modalTestId}
                    disabled={disabled}
                  />
                )}
              </div>
              <p className="input__error">
                {form.errors &&
                  form.errors[`${fieldName}.${itemIndex}.value`] &&
                  form.errors[`${fieldName}.${itemIndex}.value`]}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default SliderRow;
