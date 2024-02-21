import { Divider, Loader, Grid, ScrollArea } from "@mantine/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import "./style/Breakeven.scss";
import "../financials/Financials.css";

import { handleResponseError } from "../../../../utils/errorHandling";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import SelectTimeFrame from "../../../components/select-time-frame/SelectTimeFrame";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { handleCurrencySymbol } from "../../../helpers/handleCurrency";
import { humanReadableNumber } from "../../../helpers/humanReadableNumber";
import SingleDropdown from "../../../../components/single-level-dropdown/SingleDropdown";
import ReportCTA from "../../../../components/report-cta/ReportCTA";

import revenueEllipse from "../../../../assets/images/revenueellipse.png";
import totalcostEllipse from "../../../../assets/images/totalcostellipse.png";
import fixedcostEllipse from "../../../../assets/images/fixedcostellipse.png";
import breakevenEllipse from "../../../../assets/images/breakdownellipse.png";
import { formatCurrency } from "../../../helpers/CurrencyFormat";
import noBreakeven from "../../../../assets/images/no__breakeven.png";
import { checkIfBreakevenExists } from "../../../helpers/BreakevenHelper";

function Breakeven() {
  const svg = useRef();
  const params = useParams();

  const { timeFrameResult, timeFrameRequestData, handleSelectTimeFrame } =
    useContext(TimeFrameContext);
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);
  const { selectedCompany, isTimeframeReady, isAPIPreferencesReady } =
    useContext(CompaniesContext);

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [breakevenExists, setBreakevenExists] = useState(false);
  const [intersection, setIntersection] = useState({});
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [costPoint, setCostPoint] = useState({});
  const [revenuePoint, setRevenuePoint] = useState({});
  const [tempPointData, setTempPointData] = useState(null);
  const [topRevenue, setTopRevenue] = useState(0);
  const [costSlope, setCostSlope] = useState(0);
  const [topTotalCost, setTopTotalCost] = useState(0);
  const [breakeven, setBreakeven] = useState(0);

  const LABELS_WIDTH = 100;
  const X_BUFFER = 50;
  const Y_BUFFER = 50;
  const CHART_WIDTH = 650;
  const CHART_HEIGHT = 300;
  const Y_UNDER_CHART = 20;

  const SVG_WIDTH = LABELS_WIDTH + X_BUFFER + CHART_WIDTH;
  const SVG_HEIGHT = Y_BUFFER + CHART_HEIGHT + Y_UNDER_CHART;

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

  /* 
    handle hover over the graph
  */
  const handleMouseOver = (e) => {
    let coord = getMousePosition(e);
    if (coord.x < 100) handleMouseOverLine(0);
    if (coord.x > 800) return;
  };

  const getMousePosition = (e) => {
    let clientX = e.clientX ? e.clientX : e.changedTouches[0].clientX,
      clientY = e.clientY ? e.clientY : e.changedTouches[0].clientY;

    var CTM = e.target.farthestViewportElement
      ? e.target.farthestViewportElement.getScreenCTM()
      : e.target.getScreenCTM();

    return {
      x: (clientX - CTM.e) / CTM.a,
      y: (clientY - CTM.f) / CTM.d,
    };
  };

  const determineIntersection = () => {
    const revenuePath = document.getElementById("revenue-line");
    const costPath = document.getElementById("cost-line");
    const revenuePathLength = revenuePath?.getTotalLength();
    const costPathLength = costPath?.getTotalLength();

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

  const handleMouseOverLine = (index) => {
    /* 
      Show the current line and hide the rest
    */
    document.getElementById(`line-${index}`).style.opacity = 1;

    for (let i = 0; i < 22; i++) {
      if (i !== index) {
        document.getElementById(`line-${i}`).style.opacity = 0;
      }
    }

    /* 
      get the cost value according to its slope
    */
    const costValue = costSlope * index + graphData.fixed_cost;

    /* 
      Set the revenue and cost values for the current line
      to be shown at the top
    */
    setTempPointData({
      revenue: Math.round((topRevenue / 21) * index),
      cost: Math.round(costValue),
    });

    const revenueLine = document.getElementById("revenue-line"),
      costLine = document.getElementById("cost-line"),
      revenuePathLength = revenueLine?.getTotalLength(),
      costPathLength = costLine?.getTotalLength(),
      revenuePoint = revenueLine?.getPointAtLength(
        (revenuePathLength / 21) * index
      ),
      costPoint = costLine?.getPointAtLength((costPathLength / 21) * index);

    setPolygonPoints([
      { x: revenuePoint?.x, y: revenuePoint?.y },
      { x: costPoint?.x, y: costPoint?.y },
      { x: intersection.x, y: intersection.y },
    ]);
  };

  const getAccounts = () => {
    axios
      .get(`/analysis/breakeven/${params.companyId}/`)
      .then((res) => {
        setAccounts(
          res.data.map((item) => {
            return {
              label: item,
              value: item,
            };
          })
        );
        setAccount(res.data[0]);
      })
      .catch((e) => {
        handleResponseError(e);
        setLoading(false);
      });
  };

  const getGraphData = () => {
    axios
      .post(`/analysis/breakeven/${params.companyId}/`, {
        account: account,
        financial_year: timeFrameResult.actual_year,
        period:
          timeFrameResult.period &&
          timeFrameResult.frequency_period !== "annual"
            ? timeFrameResult.period
            : timeFrameResult.actual_year,
      })
      .then((res) => {
        setGraphData(res.data);
      })
      .catch((e) => {
        handleResponseError(e);
        setBreakevenExists(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!tempPointData) {
      setTempPointData({
        revenue: graphData.revenue,
        cost: graphData.total_cost,
      });
    }
  }, [breakeven]);

  const initGraph = () => {
    let { revenue, total_cost, fixed_cost } = graphData;

    setTopRevenue(revenue * 2);

    const costSlope = (total_cost - fixed_cost) / 10;
    setCostSlope(costSlope);
    setTopTotalCost(21 * costSlope + fixed_cost);

    setTimeout(() => {
      determineIntersection();
    }, 100);
  };

  useEffect(() => {
    setBreadCrumbs([{ title: "Analysis" }, { title: "Breakeven" }]);
  }, []);

  useEffect(() => {
    if (isTimeframeReady && isAPIPreferencesReady) {
      getAccounts();
    }
  }, [selectedCompany, isTimeframeReady, isAPIPreferencesReady]);

  useEffect(() => {
    if (account && timeFrameResult) {
      getGraphData();
      setPolygonPoints([]);
      setTempPointData(null);

      for (let i = 0; i < 21; i++) {
        const line = document.getElementById(`line-${i}`);
        if (line) line.style.opacity = 0;
      }
    }
  }, [account, timeFrameResult, selectedCompany]);

  useEffect(() => {
    if (graphData) {
      const { isExist, breakeven } = checkIfBreakevenExists(graphData);
      setBreakevenExists(isExist);
      if (isExist) {
        setBreakeven(breakeven);
      }
    }
  }, [graphData]);

  useEffect(() => {
    if (graphData && breakevenExists) initGraph();
  }, [graphData, breakevenExists]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: 50,
        }}
      >
        <Loader />
      </div>
    );
  return (
    <div className="breakeven_wrapper" data-testid="breakeven_wrapper">
      <ReportCTA page="breakeven" />
      <div className="finance__header">
        {timeFrameResult && timeFrameRequestData && (
          <SelectTimeFrame
            companyFrequency={localStorage.getItem(
              `${params.companyId}_companyFreq`
            )}
            timeframe={timeFrameRequestData.timeframe}
            initialValue={timeFrameResult}
            handleSelectTimeFrame={handleSelectTimeFrame}
          />
        )}
      </div>
      {!loading && !breakevenExists && (
        <Grid>
          <Grid.Col span={2} offset={9}>
            <div>
              <SingleDropdown
                onChange={(e) => {
                  setAccount(e.value);
                }}
                data={accounts}
                value={accounts.find((a) => a.value === account)}
                optionLabel={"label"}
                optionValue={"value"}
                style={{ margin: "1em 0.5em 0 0.5em" }}
              />
            </div>
          </Grid.Col>
        </Grid>
      )}
      {!loading && breakevenExists && (
        <ScrollArea
          type="never"
          sx={{
            height: "80vh",
            width: "100%",
            paddingBottom: 20,
          }}
        >
          <div
            className="breakeven__wrapper"
            style={{
              display: "flex",
              gap: 20,
              margin: "50px 50px 0 0",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <>
              <div className="left__section__graph">
                {graphData && graphData.display_message && (
                  <div className="calculation__alert">
                    <span className="calculation__alert__icon">
                      <i className="fa-sharp fa-solid fa-info-circle"></i>
                    </span>
                    <span data-testid="calculation__alert">
                      The cost and expenses for this account are calculated by
                      pro-rata analysis
                    </span>
                  </div>
                )}
                {tempPointData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="calculations__numbers"
                  >
                    <div id="item-0">-</div>
                    <div id="item-1">=</div>
                    <div id="item-2">
                      {" "}
                      <div className="calculation__entry__label">Revenue </div>
                    </div>
                    <div id="item-3">
                      <span className="calculation__entry__value">
                        {formatCurrency(
                          Math.round(tempPointData.revenue),
                          selectedCompany.currency
                        )}
                      </span>
                    </div>
                    <div id="item-4">
                      {" "}
                      <div className="calculation__entry__label">
                        Total Cost
                      </div>
                    </div>
                    <div id="item-5">
                      <span className="calculation__entry__value">
                        {formatCurrency(
                          Math.round(tempPointData.cost),
                          selectedCompany.currency
                        )}
                      </span>
                    </div>
                    <div id="item-6">
                      <div className="calculation__entry__label">Profit</div>
                    </div>
                    <div id="item-7">
                      <span className="calculation__entry__value">
                        {formatCurrency(
                          Math.round(
                            tempPointData.revenue - tempPointData.cost
                          ),
                          selectedCompany.currency
                        )}
                      </span>
                    </div>
                  </motion.div>
                )}
                <svg
                  ref={svg}
                  width={SVG_WIDTH}
                  height={SVG_HEIGHT}
                  preserveAspectRatio="xMidYMin"
                  viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                  onMouseOver={handleMouseOver}
                  className="svg__graph"
                >
                  <>
                    <motion.polygon
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      points={polygonPoints
                        .map((element) => {
                          return `${element.x},${element.y}`;
                        })
                        .join(" ")}
                      key="intersection"
                      fill="rgba(47, 158, 68, 0.5)"
                      stroke="rgba(47, 158, 68, 1)"
                    />

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
                            {handleCurrencySymbol(selectedCompany.currency)}{" "}
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
                        x1={
                          pointIsValid(LABELS_WIDTH) ? LABELS_WIDTH : undefined
                        }
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
                        x1={
                          pointIsValid(LABELS_WIDTH) ? LABELS_WIDTH : undefined
                        }
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
                          <>
                            <line
                              key={i}
                              x1={
                                pointIsValid(LABELS_WIDTH)
                                  ? LABELS_WIDTH
                                  : undefined
                              }
                              y1={
                                pointIsValid(
                                  YValueToPixels((topRevenue / 20) * i)
                                )
                                  ? Y_BUFFER +
                                    CHART_HEIGHT -
                                    (i * CHART_HEIGHT) / 21
                                  : undefined
                              }
                              x2={
                                pointIsValid(
                                  LABELS_WIDTH + (i * CHART_WIDTH) / 21
                                )
                                  ? LABELS_WIDTH + (i * CHART_WIDTH) / 21
                                  : undefined
                              }
                              y2={
                                pointIsValid(
                                  YValueToPixels((topRevenue / 20) * i)
                                )
                                  ? Y_BUFFER +
                                    CHART_HEIGHT -
                                    (i * CHART_HEIGHT) / 21
                                  : undefined
                              }
                              stroke="#000"
                              strokeWidth={2}
                              opacity={0}
                              id={`line-${i}`}
                              onMouseOver={() => {
                                handleMouseOverLine(i);
                              }}
                              className="hover-line"
                            />
                            <line
                              key={i}
                              x1={
                                pointIsValid(
                                  LABELS_WIDTH + (i * CHART_WIDTH) / 21
                                )
                                  ? LABELS_WIDTH + (i * CHART_WIDTH) / 21
                                  : undefined
                              }
                              y1={
                                pointIsValid(
                                  YValueToPixels((topRevenue / 20) * i)
                                )
                                  ? Y_BUFFER +
                                    CHART_HEIGHT -
                                    (i * CHART_HEIGHT) / 21
                                  : undefined
                              }
                              x2={
                                pointIsValid(LABELS_WIDTH + CHART_WIDTH)
                                  ? LABELS_WIDTH + CHART_WIDTH
                                  : undefined
                              }
                              y2={
                                pointIsValid(
                                  YValueToPixels((topRevenue / 20) * i)
                                )
                                  ? Y_BUFFER +
                                    CHART_HEIGHT -
                                    (i * CHART_HEIGHT) / 21
                                  : undefined
                              }
                              stroke="#000"
                              strokeWidth={2}
                              opacity={0}
                              id={`line-back-${i}`}
                              onMouseOver={() => {
                                handleMouseOverLine(i);
                              }}
                              className="hover-line"
                            />
                            <motion.circle
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 1, delay: i * 0.02 }}
                              cx={
                                pointIsValid(
                                  LABELS_WIDTH + (i * CHART_WIDTH) / 21
                                )
                                  ? LABELS_WIDTH + (i * CHART_WIDTH) / 21
                                  : undefined
                              }
                              cy={
                                pointIsValid(
                                  YValueToPixels((topRevenue / 21) * i)
                                )
                                  ? Y_BUFFER +
                                    CHART_HEIGHT -
                                    (i * CHART_HEIGHT) / 21
                                  : undefined
                              }
                              r="4"
                              fill="#2F9E44"
                            />
                          </>
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
                              pointIsValid(
                                LABELS_WIDTH + (CHART_WIDTH / 20) * i
                              )
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
                              pointIsValid(
                                LABELS_WIDTH + (CHART_WIDTH / 20) * i
                              )
                                ? LABELS_WIDTH + (CHART_WIDTH / 20) * i
                                : undefined
                            }
                            cy={
                              pointIsValid(
                                YValueToPixels(
                                  graphData.fixed_cost +
                                    ((topTotalCost - graphData.fixed_cost) /
                                      20) *
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
                        cx={
                          pointIsValid(costPoint?.x) ? costPoint?.x : undefined
                        }
                        cy={
                          pointIsValid(costPoint?.y) ? costPoint?.y : undefined
                        }
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
                <div className="legend">
                  <div className="legend__entry">
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
                </div>
              </div>
              <div className="right__section__meta">
                <SingleDropdown
                  onChange={(e) => {
                    setAccount(e.value);
                  }}
                  data={accounts}
                  value={accounts.find((a) => a.value === account)}
                  optionLabel={"label"}
                  optionValue={"value"}
                  style={{ margin: "1em 0" }}
                  data-testid="accounts_dropdown"
                />

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
                    <div
                      className="summary__entry__value"
                      data-testid="revenue_value"
                    >
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
                    <div
                      data-testid="total_cost_value"
                      className="summary__entry__value"
                    >
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
                    <div
                      className="summary__entry__value"
                      data-testid="breakeven_value"
                    >
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
                    <div
                      className="summary__entry__value"
                      data-testid="fixed_cost_value"
                    >
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
                    <div
                      data-testid="contribution_margin_value"
                      className="summary__entry__value"
                    >
                      {graphData.contribution_margin.toFixed(2)}%
                    </div>
                  </div>

                  <Divider m={20} />

                  <div className="summary__entry">
                    <div className="summary__entry__label">
                      Margin of safety
                    </div>
                    <div
                      className="summary__entry__value"
                      data-testid="margin_of_safety_value"
                    >
                      {formatCurrency(
                        Math.round(graphData.margin_of_safety),
                        selectedCompany.currency
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        </ScrollArea>
      )}

      {!loading && !breakevenExists && (
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "-100px",
          }}
        >
          <div className="no__breakeven__wrapper">
            <div>
              <img src={noBreakeven} alt="No Breakeven" />
            </div>
            <span className="no__breakeven__title" data-testid="no__breakeven">
              Ooops, Sorry but the breakeven point will not meet in that time
              frame
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Breakeven;
