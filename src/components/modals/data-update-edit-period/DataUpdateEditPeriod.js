import { Button, Grid, Group, Radio } from "@mantine/core";
import React, { useEffect } from "react";
import "./DataUpdateEditPeriod.scss";
import SingleDropdown from "../../single-level-dropdown/SingleDropdown";

function DataUpdateEditPeriod({
  listOfDatePeriod,
  newEditPeriods,
  setNewEditPeriods,
  editPeriodLoading,
  editPeriodAPI,
  setOpenEditPeriodModal,
}) {
  useEffect(() => {
    setNewEditPeriods((prevState) => ({
      ...prevState,
      start_date: listOfDatePeriod[0]?.value,
      before_date: listOfDatePeriod[0]?.value,
    }));
  }, [listOfDatePeriod]);

  return (
    <div className="data__update__page__modal">
      <p className="title__modal__1">Change data period</p>

      <div>
        <Radio.Group
          name="edit__periods"
          value={newEditPeriods.selectedOption}
          onChange={(e) => {
            if (listOfDatePeriod.length > 0)
              setNewEditPeriods((prevState) => ({
                ...prevState,
                selectedOption: e,
              }));
          }}
        >
          <Group mt="xs">
            <Grid className="radio__option__div">
              <Grid.Col span={7}>
                <Radio
                  size="xs"
                  value="start_from"
                  data-testid="start_from"
                  label="Removing dates starting from"
                />
              </Grid.Col>
              <Grid.Col span={5} p="0">
                <SingleDropdown
                  onChange={(e) => {
                    setNewEditPeriods((prevState) => ({
                      ...prevState,
                      selectedOption: "start_from",
                      start_date: e.value,
                    }));
                  }}
                  data={listOfDatePeriod}
                  value={listOfDatePeriod.find(
                    (period) => period.value === newEditPeriods.start_date
                  )}
                  optionLabel={"label"}
                  optionValue={"value"}
                />
              </Grid.Col>
            </Grid>
            <Grid className="radio__option__div">
              <Grid.Col span={7}>
                <Radio
                  size="xs"
                  value="before"
                  data-testid="before"
                  label="Removing all dates before "
                />
              </Grid.Col>
              <Grid.Col span={5} p="0">
                <SingleDropdown
                  onChange={(e) => {
                    setNewEditPeriods((prevState) => ({
                      ...prevState,
                      selectedOption: "before",
                      before_date: e.value,
                    }));
                  }}
                  data={listOfDatePeriod}
                  value={listOfDatePeriod.find(
                    (date) => date.value === newEditPeriods.before_date
                  )}
                  optionLabel={"label"}
                  optionValue={"value"}
                />
              </Grid.Col>
            </Grid>
          </Group>
        </Radio.Group>
      </div>
      <div>
        <p className="title__modal">
          Would you like to delete the data from the system ?
        </p>
        <div className="modal__buttons">
          <Button
            fullWidth
            size="lg"
            variant="outline"
            className="butn1"
            color="red"
            onClick={editPeriodAPI}
            loading={editPeriodLoading}
            data-testid="confirm_change_period_btn"
          >
            Yes, I am sure
          </Button>
          <Button
            fullWidth
            size="lg"
            className="butn2"
            onClick={() => {
              setOpenEditPeriodModal(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataUpdateEditPeriod;
