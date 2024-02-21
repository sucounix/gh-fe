import React, { useContext, useEffect, useRef, useState } from "react";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";
import { motion } from "framer-motion";
import { handleCurrencySymbol } from "../../../../../helpers/handleCurrency";
import { humanReadableNumber } from "../../../../../helpers/humanReadableNumber";
import "./style/BreakevenChart.scss";
import { formatCurrency } from "../../../../../helpers/CurrencyFormat";
import { Divider } from "@mantine/core";
import totalcostEllipse from "../../../../../../assets/images/totalcostellipse.png";
import fixedcostEllipse from "../../../../../../assets/images/fixedcostellipse.png";
import breakevenEllipse from "../../../../../../assets/images/breakdownellipse.png";
import revenueEllipse from "../../../../../../assets/images/revenueellipse.png";
import noBreakeven from "../../../../../../assets/images/no__breakeven.png";
import { checkIfBreakevenExists } from "../../../../../helpers/BreakevenHelper";

function BreakevenChart({ item }) {
  const [chartItemData, setChartItemData] = useState(null);
  const [graphData, setGraphData] = useState(null);

  const frequencyPeriodNames = {
    month: "Monthly",
    quarter: "Quarterly",
    "semi-annual": "Semi Annual",
    annual: "Annual",
  };

  const LABELS_WIDTH = 100;
  const Y_BUFFER = 50;
  const CHART_WIDTH = 900;
  const CHART_HEIGHT = 500;
  const Y_UNDER_CHART = 20;

  const SVG_WIDTH = document.querySelector(
    ".left__side__breakeven"
  )?.clientWidth;
  const SVG_HEIGHT = Y_BUFFER + CHART_HEIGHT + Y_UNDER_CHART;

  const svg = useRef();
  const { selectedCompany } = useContext(CompaniesContext);
  const [breakevenExists, setBreakevenExists] = useState(false);
  const [intersection, setIntersection] = useState({});
  const [costPoint, setCostPoint] = useState({});
  const [revenuePoint, setRevenuePoint] = useState({});
  const [topRevenue, setTopRevenue] = useState(0);
  const [topTotalCost, setTopTotalCost] = useState(0);
  const [breakeven, setBreakeven] = useState(0);

  useEffect(() => {
    setChartItemData(item?.chart_item);
    setGraphData(item?.chart_item?.value?.data);
  }, [item]);

  useEffect(() => {
    if (graphData) {
      const { isExist, breakeven } = checkIfBreakevenExists(graphData);
      setBreakevenExists(isExist);
      if (isExist) {
        setBreakeven(breakeven);
      }
    }
  }, [chartItemData]);

  useEffect(() => {
    if (graphData && breakevenExists) initGraph();
  }, [graphData, breakevenExists]);

  /* 
    Convert the revenue and cost values to pixels
  */
  const YValueToPixels = (value) => {
    const maxValue = topRevenue;
    const minValue = 0;
    const pixelsPerUnit = CHART_HEIGHT / (maxValue - minValue);
    const y = Y_BUFFER + CHART_HEIGHT - (value - minValue) * pixelsPerUnit;
    return y;
  };

  const determineIntersection = () => {
    const revenuePath = document.getElementById("revenue-line"),
      costPath = document.getElementById("cost-line"),
      revenuePathLength = revenuePath?.getTotalLength(),
      costPathLength = costPath?.getTotalLength();

    /* 
      The current revenue and cost points
      will always be at the middle of the path
    */
    const cPoint = costPath?.getPointAtLength(costPathLength * 0.5);
    setCostPoint(cPoint);

    const rPoint = revenuePath?.getPointAtLength(revenuePathLength * 0.5);
    setRevenuePoint(rPoint);

    for (let i = 0; i < revenuePathLength; i++) {
      const point = revenuePath?.getPointAtLength(i);

      /* 
        Check if the current revenue point intersects with any of the cost points
      */
      for (let j = 0; j < costPathLength; j++) {
        if (pointIntersect(point, costPath?.getPointAtLength(j))) {
          setIntersection({ x: point.x, y: point.y });
          return;
        }
      }
    }
  };

  const pointIsValid = (point) => {
    return !isNaN(point) || isFinite(point) ? true : false;
  };

  const pointIntersect = (p1, p2) => {
    p1.x = Math.round(p1.x);
    p1.y = Math.round(p1.y);
    p2.x = Math.round(p2.x);
    p2.y = Math.round(p2.y);
    return p1.x === p2.x && p1.y === p2.y;
  };

  const initGraph = () => {
    let { revenue, total_cost, fixed_cost } = graphData;

    setTopRevenue(revenue * 2);

    const costSlope = (total_cost - fixed_cost) / 10;
    setTopTotalCost(21 * costSlope + fixed_cost);

    setTimeout(() => {
      determineIntersection();
    }, 100);
  };

  return (
    <div className="breakeven__wrapper" data-testid="breakeven_wrapper">
      {breakevenExists ? (
        <>
          <div className="breakeven__report">
            <div className="left__side__breakeven">
              <div className="breakeven__chart__header">
                <div>
                  <span className="breakeven__chart__title">
                    {chartItemData?.title}{" "}
                  </span>
                  {chartItemData?.params?.account && (
                    <span className="account__name">
                      {chartItemData?.params?.account}
                    </span>
                  )}
                </div>
                <span className="breakeven__chart__period">
                  {frequencyPeriodNames[chartItemData?.frequency_period]}{" "}
                  {chartItemData?.period}
                </span>
              </div>
              <div className="legend">
                <div className="legend__entry">
                  <div className="fixed__cost__legend"></div>
                  <p data-testid="fixed_cost_legend">FIXED COSTS</p>
                </div>
                <div className="legend__entry">
                  <div className="total__cost__legend"></div>
                  <p data-testid="total_cost_legend">TOTAL COSTS</p>
                </div>
                <div className="legend__entry">
                  <div className="revenue__legend"></div>
                  <p data-testid="revenue_legend">REVENUE</p>
                </div>
              </div>
              <svg
                ref={svg}
                width={SVG_WIDTH}
                height={SVG_HEIGHT}
                preserveAspectRatio="xMidYMin"
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="svg__graph breakeven__chart"
              >
                <>
                  {/* Start of Grid */}
                  <g>
                    <motion.line
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      x1="100"
                      y1="0"
                      x2="100"
                      y2="100%"
                      stroke="#000"
                    />

                    {new Array(11).fill(0).map((_, index) => {
                      return (
                        <line
                          key={index}
                          x1="100"
                          y1="0"
                          x2={LABELS_WIDTH + CHART_WIDTH}
                          y2="0"
                          stroke="#000"
                          transform={`translate(0, ${
                            Y_BUFFER + index * (CHART_HEIGHT / 10)
                          })`}
                          strokeDasharray={12}
                          strokeOpacity={0.2}
                        />
                      );
                    })}

                    {new Array(21).fill(0).map((_, index) => {
                      return (
                        <line
                          key={index}
                          x1={
                            pointIsValid(
                              LABELS_WIDTH + (CHART_WIDTH / 20) * index
                            )
                              ? LABELS_WIDTH + (CHART_WIDTH / 20) * index
                              : undefined
                          }
                          y1={Y_BUFFER}
                          x2={
                            pointIsValid(
                              LABELS_WIDTH + (CHART_WIDTH / 20) * index
                            )
                              ? LABELS_WIDTH + (CHART_WIDTH / 20) * index
                              : undefined
                          }
                          y2={Y_BUFFER + CHART_HEIGHT}
                          stroke="#000"
                          strokeOpacity={0.1}
                        />
                      );
                    })}
                  </g>
                  {/* End of Grid */}

                  {/* Start of ticks values */}
                  <g>
                    {new Array(11).fill(0).map((_, index) => {
                      return (
                        <motion.text
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          x={
                            pointIsValid(LABELS_WIDTH)
                              ? LABELS_WIDTH
                              : undefined
                          }
                          y={Y_BUFFER + CHART_HEIGHT}
                          textAnchor="end"
                          alignmentBaseline="middle"
                          fill="#000"
                          fontSize="14"
                          transform={`translate(-10, ${-(
                            index *
                            (CHART_HEIGHT / 10)
                          )})`}
                        >
                          {handleCurrencySymbol(selectedCompany.currency)}
                          {humanReadableNumber((topRevenue / 10) * index)}
                        </motion.text>
                      );
                    })}
                  </g>
                  {/* End of ticks values */}

                  {/* The Three Lines */}
                  <g className="lines">
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1 }}
                      id="fixed-cost-line"
                      data-testid="fixed-cost-line"
                      x1={LABELS_WIDTH}
                      y1={
                        pointIsValid(YValueToPixels(graphData.fixed_cost))
                          ? YValueToPixels(graphData.fixed_cost)
                          : undefined
                      }
                      x2={LABELS_WIDTH + CHART_WIDTH}
                      y2={
                        pointIsValid(YValueToPixels(graphData.fixed_cost))
                          ? YValueToPixels(graphData.fixed_cost)
                          : undefined
                      }
                      stroke="#086972"
                      strokeWidth={4}
                    />
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1 }}
                      id="cost-line"
                      data-testid="cost-line"
                      x1={pointIsValid(LABELS_WIDTH) ? LABELS_WIDTH : undefined}
                      y1={
                        pointIsValid(YValueToPixels(graphData.fixed_cost))
                          ? YValueToPixels(graphData.fixed_cost)
                          : undefined
                      }
                      x2={LABELS_WIDTH + CHART_WIDTH}
                      y2={
                        pointIsValid(YValueToPixels(topTotalCost))
                          ? YValueToPixels(topTotalCost)
                          : undefined
                      }
                      stroke="#E03131"
                      strokeWidth={4}
                    />
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1 }}
                      id="revenue-line"
                      data-testid="revenue-line"
                      x1={pointIsValid(LABELS_WIDTH) ? LABELS_WIDTH : undefined}
                      y1={
                        pointIsValid(CHART_HEIGHT + Y_BUFFER)
                          ? CHART_HEIGHT + Y_BUFFER
                          : undefined
                      }
                      x2={CHART_WIDTH + LABELS_WIDTH}
                      y2={Y_BUFFER}
                      stroke="#2F9E44"
                      strokeWidth={4}
                    />
                  </g>
                  {/* End of the three lines */}

                  {/* points on revenue line */}
                  <g>
                    {new Array(22).fill(0).map((_, i) => {
                      return (
                        <motion.circle
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: i * 0.02 }}
                          cx={
                            pointIsValid(LABELS_WIDTH + (i * CHART_WIDTH) / 21)
                              ? LABELS_WIDTH + (i * CHART_WIDTH) / 21
                              : undefined
                          }
                          cy={
                            pointIsValid(YValueToPixels((topRevenue / 21) * i))
                              ? Y_BUFFER +
                                CHART_HEIGHT -
                                (i * CHART_HEIGHT) / 21
                              : undefined
                          }
                          r="4"
                          fill="#2F9E44"
                        />
                      );
                    })}
                  </g>
                  {/* points on revenue line */}

                  {/* points on fixed cost line */}
                  <g>
                    {new Array(21).fill(0).map((_, i) => {
                      return (
                        <motion.circle
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: i * 0.02 }}
                          cx={
                            pointIsValid(LABELS_WIDTH + (CHART_WIDTH / 20) * i)
                              ? LABELS_WIDTH + (CHART_WIDTH / 20) * i
                              : undefined
                          }
                          cy={
                            pointIsValid(YValueToPixels(graphData.fixed_cost))
                              ? YValueToPixels(graphData.fixed_cost)
                              : undefined
                          }
                          r="4"
                          fill="#086972"
                        />
                      );
                    })}
                  </g>
                  {/* points on fixed cost line */}

                  {/* points on variable cost line */}
                  <g>
                    {new Array(21).fill(0).map((_, i) => {
                      return (
                        <motion.circle
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={i}
                          transition={{ duration: 1, delay: i * 0.02 }}
                          cx={
                            pointIsValid(LABELS_WIDTH + (CHART_WIDTH / 20) * i)
                              ? LABELS_WIDTH + (CHART_WIDTH / 20) * i
                              : undefined
                          }
                          cy={
                            pointIsValid(
                              YValueToPixels(
                                graphData.fixed_cost +
                                  ((topTotalCost - graphData.fixed_cost) / 20) *
                                    i
                              )
                            )
                              ? YValueToPixels(
                                  graphData.fixed_cost +
                                    ((topTotalCost - graphData.fixed_cost) /
                                      20) *
                                      i
                                )
                              : undefined
                          }
                          r="4"
                          fill="#E03131"
                        />
                      );
                    })}
                  </g>
                  {/* points on variable cost line */}

                  {/* start of the three numbers */}
                  <g>
                    <motion.circle
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      cx={pointIsValid(costPoint?.x) ? costPoint?.x : undefined}
                      cy={pointIsValid(costPoint?.y) ? costPoint?.y : undefined}
                      transform="translate(0, 0)"
                      r="6"
                      fill="#fff"
                      stroke="#ff0000"
                      strokeWidth="6"
                    />
                    <motion.circle
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      cx={
                        pointIsValid(revenuePoint?.x)
                          ? revenuePoint?.x
                          : undefined
                      }
                      cy={
                        pointIsValid(revenuePoint?.y)
                          ? revenuePoint?.y
                          : undefined
                      }
                      transform="translate(0, 0)"
                      r="6"
                      fill="#fff"
                      stroke="#2F9E44"
                      strokeWidth="6"
                    />
                    {intersection.x && intersection.y && (
                      <motion.circle
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        cx={
                          pointIsValid(intersection.x - LABELS_WIDTH)
                            ? intersection.x - LABELS_WIDTH
                            : undefined
                        }
                        cy={
                          pointIsValid(intersection.y)
                            ? intersection.y
                            : undefined
                        }
                        transform="translate(100, 0)"
                        r="8"
                        fill="#1C7ED6"
                      />
                    )}
                  </g>
                  {/* end of the three numbers */}
                </>
              </svg>
            </div>
            <div className="right__side__breakeven">
              <div className="summary__wrapper">
                <div className="summary__entry summary__revenue">
                  <div className="summary__entry__label">
                    <img
                      src={revenueEllipse}
                      style={{ marginInlineEnd: "0.5em" }}
                      alt="Revenue"
                    />
                    Revenue
                  </div>
                  <div className="summary__entry__value">
                    {formatCurrency(
                      Math.round(graphData.revenue),
                      selectedCompany.currency
                    )}
                  </div>
                </div>

                <Divider m={20} />

                <div className="summary__entry summary__total__cost">
                  <div className="summary__entry__label">
                    <img
                      src={totalcostEllipse}
                      style={{ marginInlineEnd: "0.5em" }}
                      alt="Total Cost"
                    />
                    Total Cost
                  </div>
                  <div className="summary__entry__value">
                    {formatCurrency(
                      Math.round(graphData.total_cost),
                      selectedCompany.currency
                    )}
                  </div>
                </div>

                <Divider m={20} />

                <div className="summary__entry summary__breakeven">
                  <div className="summary__entry__label">
                    <img
                      src={breakevenEllipse}
                      style={{ marginInlineEnd: "0.5em" }}
                      alt="Breakeven"
                    />
                    Breakeven
                  </div>
                  <div className="summary__entry__value">
                    {formatCurrency(
                      Math.round(breakeven),
                      selectedCompany.currency
                    )}
                  </div>
                </div>

                <Divider m={20} />

                <div className="summary__entry summary__fixed__cost">
                  <div className="summary__entry__label">
                    <img
                      src={fixedcostEllipse}
                      style={{ marginInlineEnd: "0.5em" }}
                      width={20}
                      alt="Fixed Cost"
                    />
                    Fixed cost
                  </div>
                  <div className="summary__entry__value">
                    {formatCurrency(
                      Math.round(graphData.fixed_cost),
                      selectedCompany.currency
                    )}
                  </div>
                </div>

                <Divider m={20} />

                <div className="summary__entry">
                  <div className="summary__entry__label">
                    Contribution margin
                  </div>
                  <div className="summary__entry__value">
                    {graphData.contribution_margin.toFixed(2)}%
                  </div>
                </div>

                <Divider m={20} />

                <div className="summary__entry">
                  <div className="summary__entry__label">Margin of safety</div>
                  <div className="summary__entry__value">
                    {formatCurrency(
                      Math.round(graphData.margin_of_safety),
                      selectedCompany.currency
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no__breakeven">
          <img src={noBreakeven} alt="no breakeven" />
          <span className="no__breakeven__message">
            Breakeven point will not meet in that time frame
          </span>
        </div>
      )}
    </div>
  );
}

export default BreakevenChart;
