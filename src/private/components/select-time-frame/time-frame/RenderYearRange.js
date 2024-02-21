import React, { useEffect, useState } from "react";
import { Flex } from "@mantine/core";

import "./TimeFrame.css";

const RenderYearRange = ({
  listOfYearRanges,
  selectedYearRange,
  handleSelectedYear,
}) => {
  const isSelected = (year_range, selectedYearRange) => {
    // if the fisycal year start from Jan
    // then it will not contain a slah (/)
    if (!selectedYearRange.includes("/") && year_range.includes("/")) {
      return year_range.split("/")[1] === selectedYearRange;
    }
    return year_range === selectedYearRange;
  };

  return (
    <>
      <div className="year__title">Select a year</div>
      {listOfYearRanges.map((year_range, index_year_range) => {
        return (
          <Flex
            key={year_range}
            align="center"
            justify={"center"}
            data-testid={`year_range_${index_year_range}`}
            className={
              isSelected(year_range, selectedYearRange)
                ? " year__range selected__year__range"
                : "year__range "
            }
            onClick={() => {
              handleSelectedYear(year_range);
            }}
          >
            {year_range}
          </Flex>
        );
      })}
    </>
  );
};
export default RenderYearRange;
