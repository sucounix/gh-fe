import React, { useContext } from "react";
import { NumberInput, SegmentedControl } from "@mantine/core";
import { handleCurrencyPrecision } from "../../private/helpers/handleCurrency";
import { CompaniesContext } from "../../contexts/CompaniesContext";
import "./style/RowToggleInput.scss";

const RowToggleInput = ({
  componentTestId,
  rowTitleTestid,
  form,
  formVariables,
  segmentedName,
  segmentedData,
  rowTitle,
  rowCaption,
  inputName,
  inputTestId,
  inputDisable = false,
  inputMin = 0,
  inputRightSectionIcon,
}) => {
  const { selectedCompany } = useContext(CompaniesContext);
  return (
    <div className="row__toggle__input__div" data-testid={componentTestId}>
      <div className="toggle_content_div">
        <div>
          <SegmentedControl
            data={segmentedData}
            {...form.getInputProps(segmentedName)}
            data-testid={`${segmentedName}`}
          />
        </div>
        <div>
          <span
            className="content"
            style={
              formVariables[segmentedName] === "ON"
                ? { opacity: 1 }
                : { opacity: 0.5 }
            }
            data-testid={rowTitleTestid}
          >
            {rowTitle} is {rowCaption}
          </span>
        </div>
      </div>
      <div className="input__div">
        <NumberInput
          precision={handleCurrencyPrecision(selectedCompany.currency)}
          data-testid={inputTestId}
          disabled={inputDisable}
          min={inputMin}
          error={
            form.errors &&
            form.errors[inputName] && <p>Value cannot be empty</p>
          }
          value={
            formVariables[inputName].value
              ? formVariables[inputName].value
              : undefined
          }
          hideControls
          onChange={(value) => {
            // set value
            form.setFieldValue(inputName, { value });
            // add/remove an input error
            form.setErrors({
              [inputName]: value === "" ? " Value cannot be empty" : null,
            });
          }}
          rightSectionWidth={40}
          rightSection={inputRightSectionIcon}
        />
      </div>
    </div>
  );
};

export default RowToggleInput;
