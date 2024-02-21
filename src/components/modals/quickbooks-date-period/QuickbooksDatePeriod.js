import React, { useState } from "react";
import { Button, Flex, Grid, Modal } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";

import "./style/QuickbooksDatePeriod.css";

export const QuickbooksDatePeriod = ({
  showModal,
  handleHideQuickbooksModal,
  handleQuickbooksIntegration,
  datePeriod,
  setPeriod,
}) => {
  const [renderError, setRenderError] = useState(null);

  const validateDates = () => {
    // end date should be greater than the start date
    // the max date period selected in 10 years more than that should render an error
    if (!datePeriod.from || !datePeriod.to) {
      setRenderError("Please select data period ");
    } else if (new Date(datePeriod.from) > new Date(datePeriod.to)) {
      setRenderError("The end date should be greater than the start date ");
    } else if (
      new Date(datePeriod.to).getFullYear() -
        new Date(datePeriod.from).getFullYear() >
      10
    ) {
      setRenderError("The max period is 10 years ");
    } else {
      handleQuickbooksIntegration();
      handleHideQuickbooksModal();
    }
  };

  return (
    <Modal
      withCloseButton={false}
      opened={showModal}
      onClose={handleHideQuickbooksModal}
      className="Q__date__period__modal__item"
      centered
      radius={"20px"}
      size={"lg"}
    >
      <div
        className="Q__date__period__modal"
        data-testid="Q__date__period__modal"
      >
        <div>
          <p className="title1">Date range</p>
          <p className="title2">Please select a Date range for your company</p>
          <Grid>
            <Grid.Col span={6}>
              <MonthPickerInput
                maxDate={new Date()}
                valueFormat="MMMM YYYY"
                label="From"
                data-testid="from_date"
                onChange={(event) => {
                  setRenderError(null);
                  setPeriod((prevState) => ({
                    ...prevState,
                    from: `${event.getFullYear()}-${
                      event.getMonth() + 1
                    }-${event.getDate()}`,
                  }));
                }}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <MonthPickerInput
                maxDate={new Date()}
                valueFormat="MMMM YYYY"
                label="To"
                onChange={(event) => {
                  setRenderError(null);
                  setPeriod((prevState) => ({
                    ...prevState,
                    to: `${event.getFullYear()}-${
                      event.getMonth() + 1
                    }-${event.getDate()}`,
                  }));
                }}
              />
            </Grid.Col>
          </Grid>
        </div>
        {renderError && (
          <p className="error_msg" data-testid="error_msg">
            {renderError}
          </p>
        )}
        <Flex align={"center"} justify={"center"} w="100%" mt="lg">
          <Button
            size="lg"
            radius={"md"}
            fullWidth
            className="confirm_btn"
            data-testid="confirm_btn"
            onClick={() => {
              validateDates();
            }}
          >
            Done
          </Button>
          <Button
            size="lg"
            variant="outline"
            radius={"md"}
            fullWidth
            className="cancel_btn"
            data-testid="close_popup"
            onClick={handleHideQuickbooksModal}
          >
            Cancel
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};
