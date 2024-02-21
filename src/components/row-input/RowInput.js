import React from "react";
import "./style/RowInput.scss";
import { NumberInput } from "@mantine/core";
import { CompaniesContext } from "../../contexts/CompaniesContext";
import { useContext } from "react";
import { handleCurrencyPrecision } from "../../private/helpers/handleCurrency";

const RowInput = ({
  rowInputTestId,
  testId,
  form,
  rowName,
  inputName,
  inputValue,
  rightSectionIcon,
  minValue = 0,
}) => {
  const { selectedCompany } = useContext(CompaniesContext);
  return (
    <div className="row__input__component" data-testid={testId}>
      <span className="rowName" data-testid={`budget_fixed_${rowName}`}>
        {rowName}
      </span>
      <div className="div__input">
        <NumberInput
          min={minValue}
          value={inputValue ? inputValue : minValue}
          hideControls
          rightSectionWidth={40}
          rightSection={rightSectionIcon}
          data-testid={rowInputTestId}
          precision={handleCurrencyPrecision(selectedCompany.currency)}
          error={
            form.errors &&
            form.errors[inputName] && <p>Value cannot be empty</p>
          }
          onChange={(value) => {
            form.setFieldValue(`${inputName}.value`, value);
            form.setFieldError(inputName, null);
          }}
        />
      </div>
    </div>
  );
};

export default RowInput;
