import React from "react";
import { Button, Divider, Grid } from "@mantine/core";
import RowInput from "../../../../../components/row-input/RowInput";
import "./style/OutstandingShares.scss";
const OSharesFixedView = ({ fixedForm, callAPILoading }) => {
  return (
    <div>
      <Grid>
        <Grid.Col span={2} offset={10}>
          {fixedForm.isTouched() && (
            <Button
              type="submit"
              fullWidth
              loading={callAPILoading}
              data-testid="save_button_fixed"
            >
              <span className="outstanding__btn__title">Save changes</span>
            </Button>
          )}
        </Grid.Col>
      </Grid>
      <div style={{ marginTop: "20px" }}>
        <Divider />
        <RowInput
          rowInputTestId="fixed_input"
          testId="fixed__view"
          rowName={"Outstanding Shares"}
          form={fixedForm}
          inputValue={fixedForm.values.fixedValue?.value}
          inputName={"fixedValue"}
          minValue={1}
        />
        <Divider />
      </div>
    </div>
  );
};

export default OSharesFixedView;
