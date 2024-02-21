import React, { useContext, useEffect, useState } from "react";
import Carousel from "../../../../components/carousel/Carousel";
import SelectTimeFrame from "../../../../components/select-time-frame/SelectTimeFrame";
import { useParams } from "react-router-dom";
import { Flex, Loader } from "@mantine/core";
import RenderEmptySection from "./RenderEmptySection";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";
import { SegmentedControl } from "@mantine/core";
import "./style/SegmentationAnalysis.scss";
import ReportCTA from "../../../../../components/report-cta/ReportCTA";
import TableComponent from "../../../../../components/table/Table";
import {
  REVENUE_SEG_METRIC,
  PRICE_VOLUME_MIX_METRIC,
  CLIENTS_GROWTH_ANALYSIS_METRIC,
  PRICE_PER_UNIT,
  GROSS_MARKET_VALUE,
} from "../../../../../constant/SegmentationsMetrics";

// should save the selected filter in localstorage
// if there are saved values in localstorage should send them in the request
const SegmentationAnalysis = ({
  segmentationTables,
  segmentationMetrics,
  segmentationLoading,
  renderUploadView,
  fetchSegmentation,
  removeTable,
}) => {
  const params = useParams();
  const { timeFrameResult, timeFrameRequestData, handleSelectTimeFrame } =
    useContext(TimeFrameContext);

  const { companyPreferencesApi, setCompanyAPIPreferences } = useContext(
    CompanyPreferencesApiContext
  );
  const { companyPreferencesFilter, setCompanyFilterPreferences } = useContext(
    CompanyPreferencesFilterContext
  );

  const [showStartShadow, setShowStartShadow] = useState(false);

  const segmentedYoYOptions = ["Show", "Hide"];

  const handleMetricSelect = (metric) => {
    if (companyPreferencesFilter) {
      let arr = companyPreferencesFilter.selectedMetricsSeg;
      //add new selected metric
      if (!arr.includes(metric)) {
        arr.push(metric);
        fetchSegmentation(metric);
      }
      // remove selected metric
      else {
        let selectedMetricsCopy = [...arr];
        let index = arr.indexOf(metric);
        selectedMetricsCopy.splice(index, 1);
        arr = selectedMetricsCopy;
        removeTable(metric);
        if (arr.length === 0) fetchSegmentation(REVENUE_SEG_METRIC);
      }

      setCompanyFilterPreferences({
        ...companyPreferencesFilter,
        selectedMetricsSeg: arr.length === 0 ? [REVENUE_SEG_METRIC] : arr,
      });
    }
  };

  const showCloseIcon = (metric, metricIndex) => {
    // should hide the close icon if the selected one is the first filter (default filter)
    // and the total selected values = 1
    if (
      metricIndex === 0 &&
      companyPreferencesFilter &&
      companyPreferencesFilter.selectedMetricsSeg.length <= 1 &&
      companyPreferencesFilter.selectedMetricsSeg.includes(metric)
    ) {
      return false;
    }
    // should appear the close icon on selected values
    // and the total selected values > 1

    if (
      companyPreferencesFilter &&
      companyPreferencesFilter.selectedMetricsSeg.includes(metric)
    ) {
      return true;
    }
    return false;
  };

  const showToggleLastYear = () => {
    if (timeFrameResult?.frequency_period === "annual") return false;
    let showToggleComponent = false;

    Object.keys(segmentationTables).forEach((viewName) => {
      if (
        viewName !== CLIENTS_GROWTH_ANALYSIS_METRIC &&
        viewName !== PRICE_VOLUME_MIX_METRIC
      )
        showToggleComponent = true;
    });

    return showToggleComponent;
  };

  const isMonetaryTable = (segmentationView) => {
    if (
      [
        PRICE_PER_UNIT,
        GROSS_MARKET_VALUE,
        PRICE_VOLUME_MIX_METRIC,
        REVENUE_SEG_METRIC,
      ].includes(segmentationView)
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="SegmentationAnalysis" data-testid="segmentation-analysis">
      <ReportCTA page="segementations" />
      <div className="segmentation__header">
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

      <div>
        <div className="carousel__div">
          {showStartShadow && <div className="start__shadow"></div>}
          <Carousel setShowStartShadow={setShowStartShadow}>
            {segmentationMetrics.length > 0 &&
              segmentationMetrics.map((metric, metricIndex) => {
                return (
                  <div className="metric__div" key={`metric_${metricIndex}`}>
                    <div
                      id={
                        metricIndex === segmentationMetrics.length - 1 &&
                        "last__item"
                      }
                      className={
                        companyPreferencesFilter &&
                        companyPreferencesFilter.selectedMetricsSeg.includes(
                          metric
                        )
                          ? metricIndex === segmentationMetrics.length - 1
                            ? "single__metric__selected last__item"
                            : "single__metric__selected"
                          : metricIndex === segmentationMetrics.length - 1
                          ? "single__metric last__item"
                          : "single__metric"
                      }
                      onClick={() => {
                        handleMetricSelect(metric);
                      }}
                      data-testid={`carousel_${metric}`}
                    >
                      {metric}
                      {showCloseIcon(metric, metricIndex) && (
                        <span className="mx__8">
                          <i className="fa-regular fa-xmark"></i>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </Carousel>
          <div className="end__shadow"></div>
        </div>

        {segmentationLoading ? (
          <Flex align={"center"} justify="center" h="100%" mt="10%">
            <Loader />
          </Flex>
        ) : (
          <>
            {/* will render this toggle is the freq isn't an annual */}
            {showToggleLastYear() && (
              <div className="show__Last__Year__Value">
                <div className="  ">
                  <label className="label">Same period last years</label>
                  <SegmentedControl
                    name="show last period"
                    onChange={(e) => {
                      setCompanyAPIPreferences({
                        ...companyPreferencesApi,
                        hideYoYSeg: e === "Hide",
                      });
                    }}
                    data={segmentedYoYOptions}
                    defaultValue={
                      companyPreferencesApi?.hideYoYSeg ? "Hide" : "Show"
                    }
                    value={companyPreferencesApi?.hideYoYSeg ? "Hide" : "Show"}
                  />
                </div>
              </div>
            )}

            {Object.keys(segmentationTables).length > 0 &&
              Object.keys(segmentationTables).map(
                (singleTableView, singleTableIndex) => {
                  return segmentationTables[singleTableView].rows.length > 0 ? (
                    <div
                      className="segmentation__content"
                      key={singleTableIndex}
                      data-testid={`seg_table_div_${singleTableIndex}`}
                    >
                      <div>
                        <TableComponent
                          data={segmentationTables[singleTableView]}
                          testIdSuffix="Seg"
                          headerTestId={`header_Seg_${singleTableView}`}
                          showCurrencyFlag={isMonetaryTable(singleTableView)}
                        />
                      </div>

                      <div
                        className={
                          singleTableIndex !==
                          Object.keys(segmentationTables).length - 1
                            ? "table__seperator"
                            : "mb__100"
                        }
                      ></div>
                    </div>
                  ) : (
                    <div
                      className="segmentation__content"
                      key={singleTableIndex}
                    >
                      <RenderEmptySection
                        viewName={
                          segmentationTables[singleTableView].headers.view_name
                        }
                        requirements={
                          segmentationTables[singleTableView].extra.requirements
                        }
                        renderUploadView={renderUploadView}
                      />
                    </div>
                  );
                }
              )}
          </>
        )}
      </div>
    </div>
  );
};
export default SegmentationAnalysis;
