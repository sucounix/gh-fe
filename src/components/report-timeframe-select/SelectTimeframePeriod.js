import React, { useEffect, useState, useRef } from "react";
import { Flex, Grid, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "./style/ReportTimeframeSelect.scss";
const SelectTimeframePeriod = ({
  form,
  frequency,
  periodFormField,
  timeframe,
}) => {
  const [selectedYearRangeValue, setSelectedYearRangeValue] = useState("");
  const [selectedPeriodValue, setSelectedPeriodValue] = useState(null);
  const [periodValues, setPeriodValues] = useState([]);
  const [showFirstPart, setShowFirstPart] = useState(true);
  const [opened, { close, open }] = useDisclosure(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    // handle if the input has an initial values in the form
    if (
      form.getInputProps(periodFormField) &&
      form.getInputProps(periodFormField).value
    ) {
      let periodFieldParts = form
        .getInputProps(periodFormField)
        .value.split(" ");

      setSelectedPeriodValue(periodFieldParts[0]);
      // when change the freq period , then should change the selected year index to zero again
      if (frequency === "annual") {
        setSelectedYearRangeValue(periodFieldParts[0]);
      } else if (periodFieldParts[1]) {
        setSelectedYearRangeValue(periodFieldParts[1]);
      }
    }
  }, [form]);

  useEffect(() => {
    if (form.isTouched("frequency_period")) {
      if (frequency && frequency.length > 0) {
        setShowFirstPart(frequency !== "annual");
        // when change the freq, should re-initialize the period again with the first avilable period
        // as an initial value
        if (frequency !== "annual") {
          let firstAvailablePeriod = timeframe[0][frequency].find((item) => {
            return item.status === "enabled";
          });
          // when change the freq period , then should change the selected year index to zero again
          setSelectedYearRangeValue(timeframe[0].year);
          handleSelectPeriod(firstAvailablePeriod.name, timeframe[0].year);
        } else {
          handleSelectPeriod("", timeframe[0].year);
        }
      }
    }
  }, [frequency]);

  useEffect(() => {
    if (frequency && frequency.length > 0 && selectedYearRangeValue) {
      if (frequency === "annual") {
        // if the freq period is annual , then should hide the first part
        var years = [];
        for (let item of timeframe) {
          years.push({ name: item.year, year: item.year, status: "enabled" });
        }
        setPeriodValues(years);
      } else {
        let selectedTimeframeByYearRange = timeframe.find((singleTimeframe) => {
          return singleTimeframe.year === selectedYearRangeValue;
        });
        setPeriodValues(selectedTimeframeByYearRange[frequency]);
      }
    }
  }, [form, selectedYearRangeValue]);

  const handleSelectPeriod = (periodName = "", periodYear) => {
    if (frequency !== "annual") {
      setSelectedPeriodValue(periodName);
      form.setValues({
        [periodFormField]: `${periodName.substring(0, 3)} ${periodYear}`,
      });
    } else {
      setSelectedPeriodValue(`${periodYear}`);
      form.setValues({
        [periodFormField]: `${periodYear}`,
      });
    }
    close();
  };
  const isPeriodSelected = (period) => {
    if (frequency === "annual") {
      return selectedPeriodValue === period.name;
    } else {
      return selectedPeriodValue === period.name.substr(0, 3);
    }
  };

  return (
    <div className="TimeFrame__input__div_report">
      <p className="label">Time frame</p>
      <Popover
        opened={opened}
        position="bottom"
        width="target"
        disabled={!periodValues.length > 0}
        transitionProps={{ transition: "pop" }}
        styles={{
          wrapper: {
            padding: 0,
          },
        }}
      >
        <Popover.Target>
          <div>
            <div
              className={
                !periodValues.length > 0
                  ? "disabled_input TimeFrame__input"
                  : "TimeFrame__input"
              }
            >
              <Flex
                align={"center"}
                justify="space-between"
                w={"98%"}
                data-testid={`select_time_frame_input_div`}
              >
                <div
                  className="div_overlay"
                  onClick={() => {
                    open();
                  }}
                ></div>
                <input
                  disabled
                  className="content"
                  placeholder="Choose time frame"
                  data-testid="select_time_frame_input"
                  {...form.getInputProps(periodFormField)}
                />
                <i className="fas fa-angle-down arrow"></i>
              </Flex>
            </div>
            {form?.errors && form.errors[periodFormField] && (
              <p className="timefrmae_error">{form.errors[periodFormField]}</p>
            )}
          </div>
        </Popover.Target>
        <Popover.Dropdown className="popover__dropdown">
          <Flex className="select_period_div" ref={wrapperRef}>
            {showFirstPart && (
              <div className="year_part">
                {timeframe.length > 0 &&
                  timeframe.map((singleTimeFrame) => {
                    return (
                      <div
                        className={
                          singleTimeFrame.year === selectedYearRangeValue
                            ? "year_item selected_year_item"
                            : "year_item"
                        }
                        onClick={() => {
                          setSelectedYearRangeValue(singleTimeFrame.year);
                          setSelectedPeriodValue(null);
                        }}
                        data-testid={`report_year_${singleTimeFrame.year}`}
                      >
                        {singleTimeFrame.year}
                      </div>
                    );
                  })}
              </div>
            )}
            <div
              className={
                frequency === "annual"
                  ? "w_100 period_part"
                  : "w_75 period_part"
              }
            >
              <Grid px="md">
                {periodValues.length > 0 &&
                  periodValues.map((period, periodIndex) => {
                    return (
                      <Grid.Col
                        sm={frequency === "month" ? 4 : 12}
                        key={period.name}
                        onClick={() => {
                          if (period.status === "enabled") {
                            handleSelectPeriod(period.name, period.year);
                          }
                        }}
                        data-testid={
                          frequency !== "annual"
                            ? `report_period_${period.name.substr(0, 3)}`
                            : `report_period_${period.name}`
                        }
                      >
                        <Flex
                          align={"center"}
                          justify={
                            frequency === "month" ? "center" : "flex-start"
                          }
                          w={"100%"}
                          h={"100%"}
                          padding={0}
                          className={
                            period.status === "enabled"
                              ? isPeriodSelected(period)
                                ? "selected_option"
                                : "enabled_option"
                              : "disabled_option"
                          }
                        >
                          <div>
                            {frequency !== "annual"
                              ? period.name.substr(0, 3)
                              : period.name}
                          </div>
                        </Flex>
                      </Grid.Col>
                    );
                  })}
              </Grid>
            </div>
          </Flex>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};

export default SelectTimeframePeriod;
