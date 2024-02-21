export const getActualYear = (
  ismonthly = false,
  yearRange,
  currentMonth,
  fiscalYear
) => {
  // if yearRange is one year , just return it
  if (!ismonthly || !yearRange.toString().includes("/"))
    return yearRange.toString();

  let currentMonthIndex = months.indexOf(currentMonth);
  let fiscalYearIndex = months.indexOf(fiscalYear.substring(0, 3));

  if (fiscalYearIndex <= currentMonthIndex) {
    // in the same year , so will get the first part = (2022) of the year range = (2022/2023)
    return yearRange.split("/")[0];
  } else {
    return yearRange.split("/")[1];
  }
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
