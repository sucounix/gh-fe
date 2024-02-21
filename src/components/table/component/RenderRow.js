import React, { useContext } from "react";
import { formatPercentage } from "../../../private/helpers/PercentageFormat";
import { formatNumber } from "../../../private/helpers/NumberFormat";

import { Flex, RingProgress } from "@mantine/core";
import { CompaniesContext } from "../../../contexts/CompaniesContext";

const RenderRow = ({
  singleRow,
  groupName,
  testIdSuffix,
  rowType,
  hasIndent,
  hasBorder,
  checkAlerts,
  isLastGroupRow,
  singleRowIndex,
  neglectColourColumns = [],
}) => {
  const { selectedCompany } = useContext(CompaniesContext);

  const handleCellData = (cell, columnIndex) => {
    switch (cell.col_type) {
      case "Monetary":
        return formatNumber(cell.col_data, selectedCompany.currency);
      case "Percentage":
        return formatPercentage(
          cell.col_data,
          neglectColourColumns.includes(columnIndex)
        );
      case "Number":
        return formatNumber(cell.col_data, selectedCompany?.currency);
      case "Multiples":
        return cell.col_data || "-";
      case "Custom":
        return cell.col_data || "-";
      case "chart_percentage":
        return (
          <Flex w="72%" align={"center"} justify={"space-between "}>
            <RingProgress
              size={35}
              thickness={11}
              sections={[
                {
                  value: Math.abs(cell.col_data),
                  color: "#37B24D",
                },
              ]}
              style={{
                width: "30%",
                display: "flex",
                alignItems: "center",
                justifyItems: "flex-start",
              }}
              rootColor="#E5E3E3"
            />
            <span className="percentage__value">
              {formatPercentage(cell.col_data)}
            </span>
          </Flex>
        );
      case "text":
        if (!checkAlerts) return cell.col_data;
        else if (checkAlerts && singleRow.alert) {
          return (
            <Flex align={"center"} justify={"space-between"} w="100%">
              <div className="content">{cell.col_data}</div>
              <div
                className="alert_span"
                data-testid={`alert_span_${testIdSuffix}`}
              ></div>
            </Flex>
          );
        }
      default:
        return cell.col_data;
    }
  };

  return (
    <>
      <tr
        data-testid={`tr_${testIdSuffix}`}
        key={`single_row_${singleRowIndex}`}
      >
        {singleRow.row.map((cell, cellIndex) => {
          return (
            <td
              className={
                cellIndex === 0
                  ? `sticky__row__cell background_${rowType}`
                  : `row__cells background_${rowType}`
              }
              data-testid={
                cellIndex === 0
                  ? `td_${testIdSuffix}_${groupName}_${cell.col_data}`
                  : null
              }
            >
              <div
                className={
                  hasIndent
                    ? `cell_style_background_${rowType} padding__space`
                    : `cell_style_background_${rowType}`
                }
                data-testid={`cell_${cellIndex}_${testIdSuffix}_${cell.col_type}`}
              >
                {handleCellData(cell, cellIndex)}
              </div>
            </td>
          );
        })}
      </tr>
      {hasBorder && isLastGroupRow && (
        <tr className="group_seperator" data-testid={`border_${testIdSuffix}`}>
          {singleRow.row.map((cell, __) => {
            return <td></td>;
          })}
        </tr>
      )}
    </>
  );
};

export default RenderRow;
