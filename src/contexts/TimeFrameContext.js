import React, { createContext, useContext, useState } from "react";
import { handleResponseError } from "../utils/errorHandling";
import { getActualYearOfPeriod } from "../private/helpers/getActualYearOfPeriod";
import { CompaniesContext } from "./CompaniesContext";

import axios from "axios";
const TimeFrameContext = createContext({});

function TimeFrameProvider({ children }) {
  const { selectedCompany, setIsTimeframeReady } = useContext(CompaniesContext);
  // this will contain the timeframe data from the API
  // timeframe and initial_value
  const [timeFrameRequestData, setFrameTimeRequestData] = useState(null);
  // it will contain the filter value from ( localStorage or API) to initialize the input
  // example:
  // {
  //   actual_year: 2020;
  //   frequency_period: "quarter";
  //   period: "Q2";
  //   year_range: "2020/2021";
  // }
  // will use it to filter in P&L and balance sheet ...
  // so will filter by frequency_period  , actual_year and period
  const [timeFrameResult, setTimeFrameResult] = useState(null);

  const fetchTimeFrame = (companyId) => {
    axios
      .get(`analysis/timeframe/${companyId}`)
      .then((res) => {
        setFrameTimeRequestData(res.data);
        renderTimeFrameResult(res.data, companyId);
        setIsTimeframeReady(true);
      })
      .catch((error) => {
        handleResponseError(error);
      });
  };

  // will check if the local storage have a filter value will take it
  // else will take the initial value from the API
  const renderTimeFrameResult = (data, companyId) => {
    if (localStorage.getItem(`${companyId}_freq_timeframe`)) {
      let freq_timeframe_filter_value = JSON.parse(
        localStorage.getItem(`${companyId}_freq_timeframe`)
      );
      handleSelectTimeFrame(freq_timeframe_filter_value, true, data, companyId);
    } else {
      let freq_timeframe_filter_value = {
        frequency_period: data.initial_value.frequency_period,
        period: data.initial_value.period,
        year_range: data.timeframe[data.timeframe.length - 1].year,
      };
      handleSelectTimeFrame(
        freq_timeframe_filter_value,
        false,
        data,
        companyId
      );
    }
  };

  const handleSelectTimeFrame = (
    new_filter_values,
    already_saved = false,
    request_data = null,
    companyId = null
  ) => {
    let finalObject = getActualYearOfPeriod(
      new_filter_values,
      request_data ? request_data.timeframe : timeFrameRequestData.timeframe
    );
    new_filter_values.actual_year = finalObject.year;
    setTimeFrameResult(new_filter_values);
    if (!already_saved) {
      // save the changed filter into the local storage
      localStorage.setItem(
        `${companyId ? companyId : selectedCompany?.uuid}_freq_timeframe`,
        JSON.stringify(new_filter_values)
      );
    }
  };
  const clearTimeFrameResult = () => {
    setTimeFrameResult(null);
  };

  return (
    <TimeFrameContext.Provider
      value={{
        fetchTimeFrame,
        timeFrameResult,
        timeFrameRequestData,
        handleSelectTimeFrame,
        clearTimeFrameResult,
      }}
    >
      {children}
    </TimeFrameContext.Provider>
  );
}

export { TimeFrameProvider, TimeFrameContext };
