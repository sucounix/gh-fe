import React, { useState, useRef, useEffect } from "react";
import { Flex } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import RenderCalender from "./RenderCalender";
import RenderYearRange from "./RenderYearRange";
import { getActualYearOfPeriod } from "../../../helpers/getActualYearOfPeriod";
import "./TimeFrame.css";

const TimeFrame = ({
  label,
  timeframe,
  initialValue, // it is the last saved value (from local storage or API) to initialize the input and calender
  frequency, // "month" or "quarter" or "semi-annual" or "annual"
  handleSelectTimeFrame,
}) => {
  const ref = useRef(null);
  //show/hide calender popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedYearRange, setSelectedYearRange] = useState("");
  //month or quarter or semi-annual or annual
  const [selectedSecondPart, setselectedSecondPart] = useState(null);
  const { width } = useViewportSize();
  const [listOfYearRanges, setlistOfYearRanges] = useState([]);
  //will contain (months , quarters ,semi annuals) according to the selected freq
  const [calenderData, setCalenderData] = useState([]);
  // the value of the input (May 2022) (Q1 2020) (H1 2025) (2020)
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    //get the list of year ranges
    renderYearRanges();
  }, [initialValue]);

  useEffect(() => {
    //this function should update the input value when freq is changing
    handleInputValue();
    // should render the new calender data (months, quarters , semi_annuals_annuals) according to the new value
    getCalenderData(initialValue);
  }, [frequency, initialValue]);

  useEffect(() => {
    // when change the year range should render the new data (months , quarters , semi-annual)
    // to know what is enable and what is disable
    getCalenderData();
  }, [selectedYearRange]);

  useEffect(() => {
    if (showPopup) {
      setSelectedYearRange(initialValue.year_range);
      setselectedSecondPart(initialValue.period);
    }
  }, [showPopup]);

  useEffect(() => {
    // when click outside the component it should hide
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setShowPopup]);

  const renderYearRanges = () => {
    // get the year range from the time frame obj
    let arr = [];
    for (let i = 0; i < timeframe.length; i++) {
      arr.push(timeframe[i].year);
    }
    setlistOfYearRanges(arr);
  };

  // will get the (newPeriod) parameters when user select new month/quarter/semi_annual
  // else will take the period from the saved value (initial value)
  const handleInputValue = (newPeriod = null, actualYear = null) => {
    let input_value = "";
    // in case the freq is annual
    if (initialValue.frequency_period === "annual") {
      input_value = `${
        actualYear ? actualYear.toString() : initialValue.actual_year.toString()
      }`;
    } else {
      let period = newPeriod
        ? newPeriod.substr(0, 3)
        : initialValue.period.substr(0, 3);

      input_value = `${period} ${
        actualYear ? actualYear.toString() : initialValue.actual_year.toString()
      }`;
    }

    setInputValue(input_value);
  };

  //render data in calender (months , quarters , semi-annuals)
  const getCalenderData = (initialValue = null) => {
    let arr = timeframe.filter((item) => {
      if (initialValue) return item.year === initialValue.year_range;
      return item.year === selectedYearRange;
    });
    if (arr.length > 0) {
      if (frequency === "month") setCalenderData(arr[0].month);
      if (frequency === "quarter") setCalenderData(arr[0].quarter);
      if (frequency === "semi-annual") setCalenderData(arr[0]["semi-annual"]);
    }
  };

  const handleSelectedYear = (year_range) => {
    setSelectedYearRange(year_range);
    setselectedSecondPart("");

    if (frequency === "annual") {
      // in the case the fiscal year is Jan
      // then the year range will not include /
      let new_filter_obj = {
        frequency_period: frequency,
        period: "",
        year_range: year_range,
      };

      handleSelectTimeFrame(new_filter_obj);
      let period_actual_year = getActualYearOfPeriod(new_filter_obj, timeframe);
      new_filter_obj.actual_year = period_actual_year.year;

      handleInputValue(null, period_actual_year.year);

      setShowPopup(false);
    }
  };

  const handleSelectedSecondPart = (item) => {
    setselectedSecondPart(item);
    if (selectedYearRange) {
      let new_filter_obj = {
        frequency_period: frequency,
        period: item,
        year_range: selectedYearRange,
      };
      let period_actual_year = getActualYearOfPeriod(new_filter_obj, timeframe);
      new_filter_obj.actual_year = period_actual_year.year;
      handleInputValue(item, period_actual_year.year);
      handleSelectTimeFrame(new_filter_obj);
      setShowPopup(false);
    }
  };

  return (
    <div className="TimeFrame__input__div">
      <div className="TimeFrame__input">
        <Flex
          align={"center"}
          justify="space-between"
          className="w__100"
          onClick={() => {
            setShowPopup(true);
          }}
          data-testid={`select_time_frame_input_div`}
        >
          <div
            style={{
              position: "absolute",
              top: "0",
              bottom: "0",
              left: "0",
              right: "0",
            }}
          ></div>
          <input
            disabled
            className="content"
            placeholder="Select time frame"
            data-testid="select_time_frame_input"
            value={inputValue}
          />
          <i className="fas fa-angle-down arrow"></i>
        </Flex>
        {showPopup && (
          <Flex
            align={"self-start"}
            justify="center"
            ref={ref}
            className="calender"
            style={{
              width:
                width <= 400
                  ? "300px"
                  : frequency !== "annual"
                  ? "400px"
                  : "216px",
            }}
            data-testid={"options_div"}
          >
            <div
              className="year__section"
              style={{ width: frequency === "annual" ? "100%" : "35%" }}
            >
              <RenderYearRange
                listOfYearRanges={listOfYearRanges}
                selectedYearRange={selectedYearRange}
                handleSelectedYear={handleSelectedYear}
              />
            </div>
            {frequency !== "annual" && (
              <div className="data__section">
                <RenderCalender
                  calenderData={calenderData}
                  frequency={frequency}
                  selectedSecondPart={selectedSecondPart}
                  handleSelectedSecondPart={handleSelectedSecondPart}
                />
              </div>
            )}
          </Flex>
        )}
      </div>
    </div>
  );
};

export default TimeFrame;
