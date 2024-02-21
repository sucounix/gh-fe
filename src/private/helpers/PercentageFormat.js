import React from "react";
export const formatPercentage = (number, neglectColour = false) => {
  if (number === null || number === "-") return `0 %`;

  if (number < 0.01 && number > -0.01)
    return <span style={{ color: "inherit" }}>0&nbsp;%</span>;

  if (number.toFixed(2) < 0)
    return (
      <span style={{ color: neglectColour ? "inherit" : "red" }}>
        {number.toFixed(2)}&nbsp;%
      </span>
    );

  return (
    <span style={{ color: neglectColour ? "inherit" : "#37B24D" }}>
      {number.toFixed(2)}&nbsp;%
    </span>
  );
};
