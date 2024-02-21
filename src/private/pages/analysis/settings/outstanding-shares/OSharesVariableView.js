import React from "react";
import SliderRow from "../../../../../components/slider-row/SliderRow";
import { Button, Grid } from "@mantine/core";
import "./style/OutstandingShares.scss";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";

const OSharesVariableView = ({
  variableForm,
  timeframe,
  selectedYear,
  setSelectedYear,
  callAPILoading,
  variableValid,
}) => {
  return (
    <div>
      <Grid>
        <Grid.Col span={2} offset={10}>
          <div>
            <SingleDropdown
              onChange={(e) => {
                setSelectedYear(e.value);
              }}
              data={timeframe}
              value={timeframe.find((date) => date.value === selectedYear)}
              optionLabel={"label"}
              optionValue={"value"}
              field="Year"
            />
            {variableForm.isTouched() && variableForm.isDirty() && (
              <Button
                type="submit"
                fullWidth
                loading={callAPILoading}
                disabled={variableValid ? false : true}
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
                data-testid="save_button_variable"
              >
                <span>Save changes</span>
              </Button>
            )}
          </div>
        </Grid.Col>
      </Grid>
      <div
        data-testid="variable__visible"
        className="outstanding__content__wrapper__variable"
      >
        <div className="outstanding__content__title">Outstanding Shares</div>

        <SliderRow
          form={variableForm}
          formValues={variableForm.values.sliderRow_0}
          fieldName={"sliderRow_0"}
          defaultValue={1}
          copyOption={true}
          modalTestId={`adjust__modal__outstanding`}
        />
      </div>
    </div>
  );
};

export default OSharesVariableView;
