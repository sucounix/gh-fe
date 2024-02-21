// this function take the last filter change and
// replace the year range with the actual year of the selected value
// this actual year is existing in timeframe object
export const getActualYearOfPeriod = (newValues, timeframe) => {
  let timeFrameEntry = timeframe.find((item) => {
    return item.year === newValues.year_range;
  });

  let freqData;
  let newValuesUpdated = {};
  if (newValues.frequency_period === "annual") {
    newValuesUpdated = { ...newValues };

    let currentTimeFrame = timeframe.filter((entry) => {
      return entry.year === newValues.year_range;
    })[0];

    // in case the data not uploaded annually from the begining
    // so will get the last enabled year from the semi-annual object in the selected year range
    if (currentTimeFrame["semi-annual"].length > 0) {
      let currentTimeFrameCopy = [...currentTimeFrame["semi-annual"]];
      let actual_year = currentTimeFrameCopy.reverse().find((item) => {
        return item.status === "enabled";
      });
      return actual_year;
    }
    // in case the data is uploaded annually
    // in case th fiscal year start from Jan
    // then the range date will not include slash (/)
    if (!newValues.year_range.includes("/"))
      return { year: newValuesUpdated.year_range };
    return { year: newValues.year_range.split("/")[0] };
  } else {
    freqData = timeFrameEntry[newValues.frequency_period];

    newValuesUpdated = freqData.find((item) => {
      return item.name === newValues.period;
    });

    return newValuesUpdated;
  }
};
