import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import BreakdownUpload from "./breakdown-upload/BreakdownUpload";
import SegmentationAnalysis from "./segmentation-analysis/SegmentationAnalysis";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { handleResponseError } from "../../../../utils/errorHandling";
import { Flex, Loader } from "@mantine/core";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import {
  REPORT_TYPE,
  REVENUE_SEG_METRIC,
  CLIENTS_GROWTH_ANALYSIS_METRIC,
  PRICE_VOLUME_MIX_METRIC,
} from "../../../../constant/SegmentationsMetrics";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";

const Segmentations = () => {
  const location = useLocation();
  const { timeFrameResult } = useContext(TimeFrameContext);

  const [firstTimeRender, setFirstTimeRender] = useState(true);
  const [fromAnalysisSettings, setFromAnalysisSettings] = useState(false);
  const [uploadBreakdownFlag, setUploadBreakdownFlag] = useState(false);

  const [segmentationTables, setSegmentationTables] = useState({});
  const [segmentationMetrics, setSegmentationMetrics] = useState([]);
  const [segmentationLoading, setSegmentationLoading] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);
  const {
    selectedCompany,
    isTimeframeReady,
    isAPIPreferencesReady,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);
  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);
  const { companyPreferencesFilter } = useContext(
    CompanyPreferencesFilterContext
  );

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    setBreadCrumbs([{ title: "Analysis" }, { title: "Segmentation" }]);
    fetchMetrics();
    // this means the user came from settings and want to (update/upload for thre first time)
    // so will render the upload UI
    // after the upload is done will return to the settings
    if (location && location.state && location.state.backToSettings) {
      setFromAnalysisSettings(true);
    }
  }, []);

  useEffect(() => {
    if (!firstTimeRender) {
      setFromAnalysisSettings(false);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (
      timeFrameResult &&
      companyPreferencesApi &&
      companyPreferencesFilter &&
      isTimeframeReady &&
      isAPIPreferencesReady &&
      isSelectedCompanyReady
    ) {
      fetchSegmentationOfSelectedMetrices();
    }
    setFirstTimeRender(false);
  }, [
    timeFrameResult,
    companyPreferencesApi,
    isTimeframeReady,
    isAPIPreferencesReady,
    isSelectedCompanyReady,
  ]);

  useEffect(() => {
    setUploadBreakdownFlag(
      Object.keys(segmentationTables).length === 0 ||
        (Object.keys(segmentationTables).length === 1 &&
          Object.keys(segmentationTables)[0] === REVENUE_SEG_METRIC &&
          Object.values(segmentationTables)[0].rows.length === 0)
    );
  }, [segmentationTables]);

  const fetchMetrics = () => {
    setMetricsLoading(true);
    axios
      .get(`analysis/segmentation/${selectedCompany?.uuid}/`)
      .then((res) => {
        setSegmentationMetrics(res.data);
        setMetricsLoading(false);
      })
      .catch((err) => {
        handleResponseError(err);
        setMetricsLoading(false);
      });
  };

  const fetchSegmentationOfSelectedMetrices = () => {
    if (companyPreferencesFilter.selectedMetricsSeg.length > 0) {
      companyPreferencesFilter.selectedMetricsSeg.map((metric) => {
        fetchSegmentation(metric);
      });
    }
  };

  const fetchSegmentation = (metric) => {
    setSegmentationLoading(true);
    axios
      .get(`/analysis/analysis_statement/${selectedCompany?.uuid}/`, {
        params: {
          financial_year: timeFrameResult.actual_year,
          period: timeFrameResult.period
            ? timeFrameResult.period
            : timeFrameResult.actual_year,
          analysis_statement: REPORT_TYPE,
          is_hide:
            metric === CLIENTS_GROWTH_ANALYSIS_METRIC ||
            metric === PRICE_VOLUME_MIX_METRIC
              ? false
              : companyPreferencesApi.hideYoYSeg,
          view_name: metric,
        },
      })
      .then((res) => {
        setSegmentationTables((prev) => {
          return {
            ...prev,
            [res.data?.headers?.view_name]: res.data,
          };
        });

        setSegmentationLoading(false);
      })
      .catch((err) => {
        setSegmentationLoading(false);
        handleResponseError(err);
      });
  };

  const removeTable = (metric) => {
    delete segmentationTables[metric];
    setSegmentationTables({ ...segmentationTables });
  };

  // if the user want to upload data from the segmentation view
  // then can use this method to render the upload view
  const renderUploadView = () => {
    setUploadBreakdownFlag(true);
  };

  const renderSegmentationView = () => {
    setUploadBreakdownFlag(false);
    fetchSegmentationOfSelectedMetrices();
  };

  return (
    <>
      {metricsLoading || segmentationLoading ? (
        <Flex align={"center"} justify="center" h="100%" w={"100vw"} mt="10%">
          <Loader />
        </Flex>
      ) : uploadBreakdownFlag || fromAnalysisSettings ? (
        <BreakdownUpload renderSegmentationView={renderSegmentationView} />
      ) : (
        <SegmentationAnalysis
          segmentationTables={segmentationTables}
          segmentationMetrics={segmentationMetrics}
          segmentationLoading={segmentationLoading}
          renderUploadView={renderUploadView}
          fetchSegmentation={fetchSegmentation}
          removeTable={removeTable}
        />
      )}
    </>
  );
};
export default Segmentations;
