import React, { useContext, useEffect, useState } from "react";
import "../style/Waterfall.scss";
import { formatCurrency } from "../../../../../../helpers/CurrencyFormat";
import { handleCurrencySymbol } from "../../../../../../helpers/handleCurrency";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";
import { humanReadableNumber } from "../../../../../../helpers/humanReadableNumber";
import EmptyWaterfallView from "./EmptyWaterfallView";

function UsesSourcesCashflowWaterfall({ data }) {
  const [graphIntervals, setGraphIntervals] = useState([]);
  const [startX, setStartX] = useState(0);
  const [shownTables, setShownTables] = useState([]);
  const [graphInterval, setGraphInterval] = useState(0);
  const [summaryData, setSummaryData] = useState({});
  const [height, setHeight] = useState(0);

  const { selectedCompany } = useContext(CompaniesContext);

  const svgWidth = document.querySelector(".waterfall__content")?.clientWidth;
  const labelsBlockWidth = 300;
  const YSegmentHeight = 50;
  const XSegmentWidth = (svgWidth - labelsBlockWidth) / 6;
  const labelBlockHeight = 55;
  const fontSize = 15;
  const fontFamily = "DM sans";

  const calculateTextWidth = (number) => {
    let text = number?.toString();
    return (text?.length * fontSize * 2) / 3;
  };

  const calculateAxisInterval = () => {
    const allData = data.rows
      .slice(0, 2)
      .flatMap((row) =>
        row.row.rows.map((innerRow) =>
          innerRow.row[1].col_data === "-" ? 0 : innerRow.row[1].col_data
        )
      );
    let max = Math.max(...allData);
    let min = Math.min(...allData);

    const netChangeCashBalanceBlock = data.rows.find(
      (block) =>
        block.row.rows[0].row[0]?.col_data === "Net Change in Cash Flow"
    );

    if (netChangeCashBalanceBlock) {
      let current =
        netChangeCashBalanceBlock.row.rows[0].row[1].col_data === "-"
          ? 0
          : netChangeCashBalanceBlock.row.rows[0].row[1].col_data;
      if (current > max) max = current;
      if (current < min) min = current;
    }

    let interval;
    let intervals = [];

    if (Math.abs(max) > 4 * Math.abs(min)) {
      interval = (max * 1.2) / 4;
      const intervalRounded = Math.round(interval);

      if (Math.abs(intervalRounded) === 0) {
        setGraphInterval(1);
        intervals.push(-1);
        intervals.push(0);
        intervals.push(1);
        intervals.push(1 * 2);
        intervals.push(1 * 3);
        intervals.push(1 * 4);
      } else {
        setGraphInterval(intervalRounded);
        intervals.push(-intervalRounded);
        intervals.push(0);
        intervals.push(intervalRounded);
        intervals.push(intervalRounded * 2);
        intervals.push(intervalRounded * 3);
        intervals.push(intervalRounded * 4);
      }
    } else if (Math.abs(min) > 4 * Math.abs(max)) {
      interval = (min * 1.2) / 2;
      const intervalRounded = Math.round(interval);

      if (Math.abs(intervalRounded) === 0) {
        setGraphInterval(1);
        intervals.push(-1 * 3);
        intervals.push(-1 * 2);
        intervals.push(-1);
        intervals.push(0);
        intervals.push(1);
        intervals.push(2);
      } else {
        setGraphInterval(intervalRounded);
        intervals.push(intervalRounded * 3);
        intervals.push(intervalRounded * 2);
        intervals.push(intervalRounded);
        intervals.push(0);
        intervals.push(-intervalRounded);
        intervals.push(-intervalRounded * 2);
      }
    } else {
      const set = Math.max(Math.abs(max), Math.abs(min));
      interval = (set * 1.2) / 2;
      const intervalRounded = Math.round(interval);

      if (Math.abs(intervalRounded) === 0) {
        setGraphInterval(1);
        intervals.push(-1 * 3);
        intervals.push(-1 * 2);
        intervals.push(-1);
        intervals.push(0);
        intervals.push(1);
        intervals.push(2);
      } else {
        setGraphInterval(intervalRounded);
        intervals.push(-intervalRounded * 3);
        intervals.push(-intervalRounded * 2);
        intervals.push(-intervalRounded);
        intervals.push(0);
        intervals.push(intervalRounded);
        intervals.push(intervalRounded * 2);
      }
    }

    const indexOfZero = intervals.indexOf(0);

    setStartX(labelsBlockWidth + indexOfZero * XSegmentWidth);
    setGraphIntervals(intervals);
  };

  const calculateXPoint = (value) => {
    return startX + XSegmentWidth * (value / graphInterval);
  };

  const handleTables = () => {
    let Y = 90;
    let blocks = data.rows;

    let usesOfCashBlock = blocks.find(
      (block) =>
        block.row.columns[0]?.col_data === "Uses Of Cash Flow (Spending)"
    );

    if (usesOfCashBlock)
      usesOfCashBlock = usesOfCashBlock.row?.rows?.map((row) => ({
        type: row.display_type,
        name: row.row[0].col_data,
        value: row.row[1].col_data,
      }));

    let sourcesOfCashBlock = blocks.find(
      (block) =>
        block.row.columns[0]?.col_data === "Sources Of Cash Flow (Generation)"
    );

    if (sourcesOfCashBlock)
      sourcesOfCashBlock = sourcesOfCashBlock.row?.rows?.map((row) => ({
        type: row.display_type,
        name: row.row[0].col_data,
        value: row.row[1].col_data,
      }));

    const netChangeCashBalanceBlock = blocks.find(
      (block) =>
        block.row.rows[0].row[0]?.col_data === "Net Change in Cash Flow"
    );

    let totalsBlocks = [netChangeCashBalanceBlock];

    let totalsBlock = [];

    totalsBlocks.forEach((block) => {
      if (block) {
        totalsBlock.push({
          type: block.row.rows[0].display_type,
          name: block.row.rows[0].row[0].col_data,
          value: block.row.rows[0].row[1].col_data,
        });
      }
    });

    // Determine which blocks do exist
    const availableBlocks = {
      usesOfCashBlock: usesOfCashBlock?.length > 0,
      sourcesOfCashBlock: sourcesOfCashBlock?.length > 0,
      totalsBlock: {
        netChangeCashBalanceBlock:
          netChangeCashBalanceBlock?.row?.rows?.length > 0,
      },
    };

    let preparedData = [];

    if (availableBlocks.usesOfCashBlock)
      preparedData.push({
        blockName: "Uses of Cash Flow (Spending)",
        children: [...usesOfCashBlock],
      });
    if (availableBlocks.sourcesOfCashBlock)
      preparedData.push({
        blockName: "Sources of Cash Flow (Generation)",
        children: [...sourcesOfCashBlock],
      });
    if (availableBlocks.totalsBlock)
      preparedData.push({
        blockName: "Totals",
        children: [...totalsBlock],
      });

    if (preparedData) {
      let tables = [];

      preparedData.forEach((block, index) => {
        tables.push({
          name: block.blockName,
          startY: Y,
          children: block.children,
        });
        Y = Y + YSegmentHeight * block.children.length + 60;
      });

      let actualHeight = 0;

      if (tables.length > 0) {
        for (let i = 0; i < tables.length; i++) {
          actualHeight += YSegmentHeight * tables[i].children.length + 55;
        }
      }

      setHeight(actualHeight);

      const beginCashBalanceBlock = blocks.find(
        (block) =>
          block.row.rows[0].row[0]?.col_data === "Beginning Cash Balance"
      );

      const endCashBalanceBlock = blocks.find(
        (block) => block.row.rows[0].row[0]?.col_data === "Ending Cash Balance"
      );

      setSummaryData({
        uses: usesOfCashBlock?.at(-1)?.value,
        sources: sourcesOfCashBlock?.at(-1)?.value,
        begin_cash: beginCashBalanceBlock?.row?.rows?.[0]?.row?.[1]?.col_data,
        ending_cash: endCashBalanceBlock?.row?.rows?.[0]?.row?.[1]?.col_data,
      });

      for (let i = 0; i < tables.length; i++) {
        let total = 0;
        let YPoint = tables[i].startY;

        tables[i].children.map((entry, index) => {
          let current = entry.value === "-" ? 0 : entry.value;
          total = total + current;
          entry.YPoint = YPoint + YSegmentHeight * index;
          entry.XStart =
            isNaN(calculateXPoint(total - current)) ||
            !isFinite(calculateXPoint(total - current))
              ? 0
              : calculateXPoint(total - current);
          entry.XEnd =
            isNaN(calculateXPoint(total)) || !isFinite(calculateXPoint(total))
              ? 0
              : calculateXPoint(total);
        });
      }

      setShownTables(tables);
    }
  };

  const determineTextPosition = (entry) => {
    if (entry.type === "total")
      return entry.XStart + 0.1 * calculateTextWidth(entry.value);
    if (entry.XStart > entry.XEnd) return entry.XStart + 10;
    if (entry.XEnd > 1300) return 1200;
    return entry.XEnd + 10;
  };

  useEffect(() => {
    if (svgWidth) {
      if (
        data &&
        data.columns &&
        data.columns[0].col_data === "Uses & Sources of Cash Flow"
      )
        calculateAxisInterval();
    }
  }, [svgWidth]);

  useEffect(() => {
    if (
      data &&
      data.columns &&
      data.columns[0].col_data === "Uses & Sources of Cash Flow"
    )
      handleTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphInterval]);

  return (
    <div
      style={{
        fontFamily,
        fontSize,
      }}
      data-testid="UsesSourcesCashflowWaterfall"
      className="waterfall__content"
    >
      {shownTables && shownTables.length ? (
        <>
          <hr />
          <div className="top__cards">
            <div className="top__card">
              <span className="top__card__title">
                Uses of Cash Flow (Spending)
              </span>
              <span
                className="top__card__value"
                style={{
                  color: summaryData.uses > 0 ? "#37B24D" : "#F03E3E",
                }}
              >
                {!isNaN(summaryData.uses) ? (
                  <>
                    {summaryData.cash_from_operations >= 0
                      ? ` ${formatCurrency(
                          summaryData.uses,
                          selectedCompany.currency
                        )}`
                      : `${formatCurrency(
                          summaryData.uses,
                          selectedCompany.currency
                        )}`}
                  </>
                ) : (
                  <>-</>
                )}
              </span>
            </div>
            <div className="top__card">
              <span className="top__card__title">
                {" "}
                Sources of Cash Flow (Generation)
              </span>
              <span
                className="top__card__value"
                style={{
                  color: summaryData.sources > 0 ? "#37B24D" : "#F03E3E",
                }}
              >
                {!isNaN(summaryData.sources) ? (
                  <>
                    {summaryData.sources >= 0
                      ? ` ${formatCurrency(
                          summaryData.sources,
                          selectedCompany.currency
                        )}`
                      : `${formatCurrency(
                          summaryData.sources,
                          selectedCompany.currency
                        )}`}
                  </>
                ) : (
                  <>-</>
                )}
              </span>
            </div>
            <div className="top__card">
              <span className="top__card__title">Beginning cash balance</span>
              <span
                className="top__card__value"
                style={{
                  color: summaryData.begin_cash > 0 ? "#37B24D" : "#F03E3E",
                }}
              >
                {!isNaN(summaryData.begin_cash) ? (
                  <>
                    {summaryData.begin_cash >= 0
                      ? ` ${formatCurrency(
                          summaryData.begin_cash,
                          selectedCompany.currency
                        )}`
                      : ` (${formatCurrency(
                          Math.abs(summaryData.begin_cash),
                          selectedCompany.currency
                        )})`}
                  </>
                ) : (
                  <>-</>
                )}
              </span>
            </div>
            <div className="top__card">
              <span className="top__card__title">Ending cash balance</span>
              <span
                className="top__card__value"
                style={{
                  color: summaryData.ending_cash > 0 ? "#37B24D" : "#F03E3E",
                }}
              >
                {!isNaN(summaryData.ending_cash) ? (
                  <>
                    {summaryData.ending_cash >= 0
                      ? ` ${formatCurrency(
                          summaryData.ending_cash,
                          selectedCompany.currency
                        )}`
                      : ` (${formatCurrency(
                          Math.abs(summaryData.ending_cash),
                          selectedCompany.currency
                        )})`}
                  </>
                ) : (
                  <>-</>
                )}
              </span>
            </div>
          </div>
        </>
      ) : null}

      {shownTables && shownTables.length ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          height={height}
          width="100%"
          className={"svg_waterfall"}
        >
          {/* Grey background for subtotal values */}
          {shownTables &&
            shownTables.map((table, index) => {
              return (
                <React.Fragment key={index}>
                  {table.children.map((entry, index) => {
                    return (
                      <React.Fragment key={index}>
                        {entry.type === "sub_total" && (
                          <line
                            x1={0}
                            y1={
                              table.name === "Totals"
                                ? entry.YPoint - 25
                                : entry.YPoint + 10
                            }
                            x2="100%"
                            y2={
                              table.name === "Totals"
                                ? entry.YPoint - 25
                                : entry.YPoint + 10
                            }
                            stroke="#F8F8F8"
                            strokeWidth={55}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}

          {graphIntervals.map((interval, index) => {
            return (
              <React.Fragment key={index}>
                <line
                  x1={labelsBlockWidth + index * XSegmentWidth}
                  y1="80"
                  x2={labelsBlockWidth + index * XSegmentWidth}
                  y2="100%"
                  stroke="black"
                />
                <text
                  x={labelsBlockWidth + index * (XSegmentWidth + 2.5)}
                  y={20}
                  textAnchor="middle"
                  className="interval__label"
                >
                  {interval >= 0
                    ? interval === 0
                      ? `${handleCurrencySymbol(selectedCompany.currency)} 0`
                      : `${handleCurrencySymbol(
                          selectedCompany.currency
                        )} ${humanReadableNumber(interval)}`
                    : `(${handleCurrencySymbol(
                        selectedCompany.currency
                      )} ${humanReadableNumber(interval)})`}
                </text>
              </React.Fragment>
            );
          })}
          {/* legend */}
          <g>
            <rect x="0" y="0" width="10" height="10" fill="#37B24D" rx={1} />
            <text x="15" y="9" className="cash__title">
              Cash Recieved
            </text>

            <rect x="0" y="15" width="10" height="10" fill="#F03E3E" rx={1} />
            <text className="cash__title" x="15" y="24">
              Cash Spent
            </text>
          </g>
          {/* Legend */}

          {/* Tables Headers */}

          <g>
            {shownTables.map((table, index) => {
              return (
                <>
                  <g id="header" key={index}>
                    {table.name !== "Totals" && (
                      <>
                        <rect
                          x="0"
                          y={table.startY - labelBlockHeight}
                          width="100%"
                          height="50"
                          fill="white"
                        />
                        <line
                          x1="0"
                          y1={table.startY - labelBlockHeight}
                          x2="100%"
                          y2={table.startY - labelBlockHeight}
                          stroke="rgba(0, 0, 0, 0.50)"
                          strokeOpacity={0.5}
                        />
                        <text
                          x="10"
                          y={table.startY - 25}
                          className="table__header"
                          fill="black"
                        >
                          {table.name}
                        </text>
                        <line
                          x1="0"
                          y1={table.startY - 10}
                          x2="100%"
                          y2={table.startY - 10}
                          stroke="rgba(0, 0, 0, 0.50)"
                          strokeOpacity={0.5}
                        />
                      </>
                    )}

                    {table.name !== "Totals" && (
                      <>
                        <line
                          x1="0"
                          y1={
                            table.startY +
                            YSegmentHeight * table.children.length
                          }
                          x2="100%"
                          y2={
                            table.name === "Totals"
                              ? table.startY +
                                table.children.length * YSegmentHeight -
                                40
                              : table.startY +
                                YSegmentHeight * table.children.length
                          }
                          stroke="white"
                          strokeWidth={20}
                        />
                        <line
                          x1="0"
                          y1={
                            table.startY +
                            YSegmentHeight * table.children.length
                          }
                          x2="100%"
                          y2={
                            table.name === "Totals"
                              ? table.startY +
                                table.children.length * YSegmentHeight -
                                40
                              : table.startY +
                                YSegmentHeight * table.children.length
                          }
                          stroke="rgba(8, 105, 114, 0.4)"
                          strokeWidth={20}
                        />
                      </>
                    )}
                    {table.name === "Totals" && (
                      <line
                        x1="0"
                        y1={
                          table.startY +
                          table.children.length * YSegmentHeight -
                          45
                        }
                        x2="100%"
                        y2={
                          table.startY +
                          table.children.length * YSegmentHeight -
                          45
                        }
                        stroke="black"
                        strokeWidth={1}
                      />
                    )}
                  </g>
                  <g>
                    {table.children.map((entry, index) => {
                      return (
                        <React.Fragment key={index}>
                          <g key={index}>
                            {entry.type === "total" && (
                              <line
                                x1={0}
                                y1={
                                  table.name === "Totals"
                                    ? entry.YPoint - 20
                                    : entry.YPoint + 15
                                }
                                x2="100%"
                                y2={
                                  table.name === "Totals"
                                    ? entry.YPoint - 25
                                    : entry.YPoint + 20
                                }
                                stroke="rgba(131, 180, 184, 0.15)"
                                strokeWidth={50}
                              />
                            )}

                            <text
                              width={30}
                              x="10"
                              y={
                                table.name === "Totals"
                                  ? entry.YPoint - 20
                                  : entry.YPoint + 20
                              }
                              fill="black"
                              fontWeight={entry.type === "total" ? 500 : 400}
                              className="table__entry__name"
                            >
                              {entry.name}
                            </text>
                            <line
                              stroke-dasharray="6"
                              x1={labelsBlockWidth}
                              y1={
                                table.name === "Totals"
                                  ? entry.YPoint - 25
                                  : entry.YPoint + 15
                              }
                              x2={entry.XStart}
                              y2={
                                table.name === "Totals"
                                  ? entry.YPoint - 25
                                  : entry.YPoint + 15
                              }
                              stroke="black"
                            />
                            <line
                              x1={
                                entry.type === "total"
                                  ? startX
                                  : Math.min(entry.XStart, entry.XEnd)
                              }
                              y1={
                                table.name === "Totals"
                                  ? entry.YPoint - 25
                                  : entry.YPoint + 15
                              }
                              x2={
                                entry.type === "total"
                                  ? entry.XStart
                                  : Math.max(entry.XStart, entry.XEnd)
                              }
                              y2={
                                table.name === "Totals"
                                  ? entry.YPoint - 25
                                  : entry.YPoint + 15
                              }
                              stroke={
                                entry.type === "total"
                                  ? "#1C7ED6"
                                  : entry.value > 0
                                  ? "#37B24D"
                                  : "#E03131"
                              }
                              strokeWidth={30}
                            />
                            <text
                              x={determineTextPosition(entry)}
                              y={
                                table.name === "Totals"
                                  ? entry.YPoint - 20
                                  : entry.YPoint + 20
                              }
                              fill={"black"}
                              className="table__entry__value"
                            >
                              {[0, "-"].includes(entry.value)
                                ? `${handleCurrencySymbol(
                                    selectedCompany.currency
                                  )} 0.00`
                                : entry.value > 0
                                ? `${formatCurrency(
                                    Math.abs(entry.value),
                                    selectedCompany.currency
                                  )}`
                                : `(${formatCurrency(
                                    Math.abs(entry.value),
                                    selectedCompany.currency
                                  )})`}
                            </text>

                            {[0, "-"].includes(entry.value) && (
                              <>
                                <line
                                  x1={entry.XStart}
                                  y1={entry.YPoint - 50}
                                  x2={entry.XStart}
                                  y2={entry.YPoint + 50}
                                  stroke="white"
                                />
                                <line
                                  x1={entry.XStart}
                                  y1={entry.YPoint - 50}
                                  x2={entry.XStart}
                                  y2={entry.YPoint + 50}
                                  stroke="black"
                                  strokeDasharray={2}
                                />
                              </>
                            )}
                          </g>
                        </React.Fragment>
                      );
                    })}
                  </g>
                </>
              );
            })}
          </g>
        </svg>
      ) : (
        <EmptyWaterfallView />
      )}
    </div>
  );
}

export default UsesSourcesCashflowWaterfall;
