import React, { useEffect, useState } from "react";
import TimeFrame from "./time-frame/TimeFrame";
import { Flex, Grid, Select } from "@mantine/core";
import { useParams } from "react-router-dom";
import SingleDropdown from "../../../components/single-level-dropdown/SingleDropdown";
import "./SelectTimeFrame.css";

const SelectTimeFrame = ({
  companyFrequency, // it is the original frequency of the company and it is  not changeable
  timeframe,
  initialValue, // it is contain the last filtered values (initial values in case the user didn't filtered the data yet)
  handleSelectTimeFrame,
}) => {
  const params = useParams();
  // the values will be one of them =>  "month" or "quarter" or "semi-annual" or "annual"
  // will change when user select a frequency from the dropdown
  const [frequency, setFrequency] = useState(companyFrequency);

  const periodFrequencyOptions = [
    {
      label: "Monthly",
      value: "month",
      disabled: companyFrequency !== "month" && true,
    },
    {
      label: "Quarterly",
      value: "quarter",
      disabled:
        companyFrequency !== "month" && companyFrequency !== "quarter" && true,
    },
    {
      label: "Semi-Annual",
      value: "semi-annual",
      disabled:
        companyFrequency !== "month" &&
        companyFrequency !== "quarter" &&
        companyFrequency !== "semi-annual" &&
        true,
    },
    { label: "Annual", value: "annual" },
  ];

  useEffect(() => {
    initalizeFreq();
  }, [companyFrequency, initialValue]);

  // initialize the freq dropdown at the first render by the initial value
  // this initial value may be from the local storage or from the backend
  const initalizeFreq = () => {
    let initial_freq = periodFrequencyOptions.find((item) => {
      if (item.value === initialValue.frequency_period) {
        return item;
      }
    });
    setFrequency(initial_freq.value);
  };

  // when change the freq ,
  // if the current view is monthly and the user change it to (quarter/semi annual)
  // should render the last enabled (quarter/semi annual) for this company
  // for example the current view is (june) , the fiscal year is (Jan) and the compnay data from Jan/2020-> Dec/2022
  // and the user want to show the data quarterly then should initialize the input with Q4/2022
  const handleSelectFrequency = (e) => {
    setFrequency(e);
    let freq_timeframe_filter = JSON.parse(
      localStorage.getItem(`${params.companyId}_freq_timeframe`)
    );
    let new_filter_values = { ...freq_timeframe_filter };

    new_filter_values.frequency_period = e;
    // if the e!== 'annual' , because there is not freq like that in the new_filter_values
    new_filter_values.period =
      e !== "annual" ? getNewPeriod(freq_timeframe_filter.year_range, e) : "";

    handleSelectTimeFrame(new_filter_values);
  };

  // the function take the last values saved for the yearRange and new freq
  // return last period name(enabled) relative to the new freq
  const getNewPeriod = (yearRange, newFreq) => {
    let timeFrameObj = timeframe.filter((item) => {
      return item.year === yearRange;
    });
    let period = "";
    let arr = [];

    if (newFreq === "month") {
      arr = [...timeFrameObj[0].month];
    }
    if (newFreq === "quarter") {
      arr = [...timeFrameObj[0].quarter];
    }
    if (newFreq === "semi-annual") {
      arr = [...timeFrameObj[0]["semi-annual"]];
    }

    period = arr.reverse().find((item) => {
      return item.status === "enabled";
    });
    return period.name;
  };

  return (
    <Grid className="dropdowns__div__timeframe">
      <Grid.Col span={4} offset={8}>
        <Grid style={{ width: "100% ", margin: "0" }}>
          <Grid.Col span={6}>
            <div>
              <SingleDropdown
                onChange={(e) => handleSelectFrequency(e.value)}
                data={periodFrequencyOptions}
                value={periodFrequencyOptions.find(
                  (item) => item.value === frequency
                )}
                optionLabel={"label"}
                optionValue={"value"}
                data-testid="select-freq-timeframe"
              />
            </div>
          </Grid.Col>
          <Grid.Col span={6}>
            <div>
              <TimeFrame
                frequency={frequency}
                timeframe={timeframe}
                initialValue={initialValue}
                label="Time frame"
                handleSelectTimeFrame={handleSelectTimeFrame}
              />
            </div>
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
};

export default SelectTimeFrame;
