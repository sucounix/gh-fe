import React, { useState } from "react";
import EditReportTable from "./report-components/table/edit-table/EditReportTable";
import EditBreakevenChart from "./report-components/breakeven-chart/EditBreakevenChart";
import EditWaterfallReport from "./report-components/waterfall/EditWaterfallReport";
import EditTrendReport from "./report-components/trend/edit-trend-report/EditTrendReport";
import FemtoDrawer from "../../../../components/femto-drawer/FemtoDrawer";

const EditReportDrawer = ({
  editedItemInfo,
  setEditedItemInfo,
  reportDetails,
  setReportDetails,
  openEditDrawer,
  setOpenEditDrawer,
}) => {
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);

  const handleType = () => {
    switch (editedItemInfo?.item?.type) {
      case "table":
        return (
          <EditReportTable
            data={editedItemInfo?.item}
            setOpenEditDrawer={setOpenEditDrawer}
            setShowOverlayLoader={setShowOverlayLoader}
            handleNewItemInReportDetails={handleNewItemInReportDetails}
          />
        );
      case "chart":
        return handleRenderEditChart();
      default:
        return;
    }
  };

  const handleRenderEditChart = () => {
    switch (editedItemInfo?.item?.chart_item?.type) {
      case "waterfall":
        return (
          <EditWaterfallReport
            item={editedItemInfo?.item}
            setOpenEditDrawer={setOpenEditDrawer}
            loading={showOverlayLoader}
            setLoading={setShowOverlayLoader}
            handleNewItemInReportDetails={handleNewItemInReportDetails}
          />
        );

      case "breakeven":
        return (
          <EditBreakevenChart
            chartItem={editedItemInfo?.item.chart_item}
            setOpenEditDrawer={setOpenEditDrawer}
            loading={showOverlayLoader}
            setLoading={setShowOverlayLoader}
            handleNewItemInReportDetails={handleNewItemInReportDetails}
          />
        );

      case "trend_analysis":
        const chartsList = editedItemInfo?.item?.chart_item.params.charts;
        const units = new Set(chartsList.map((chart) => chart.type));
        return (
          <EditTrendReport
            data={editedItemInfo?.item}
            units={units}
            setOpenEditDrawer={setOpenEditDrawer}
            loading={showOverlayLoader}
            setLoading={setShowOverlayLoader}
            handleNewItemInReportDetails={handleNewItemInReportDetails}
          />
        );

      default:
        return;
    }
  };

  const handleNewItemInReportDetails = (newItem) => {
    if (!editedItemInfo) return;

    let reportDetailsCopy = { ...reportDetails };

    reportDetailsCopy.sections[editedItemInfo.sectionIndex].items[
      editedItemInfo.itemIndex
    ][`${editedItemInfo?.item?.type}_item`] = newItem;

    setReportDetails(reportDetailsCopy);
    setEditedItemInfo(null);
  };

  return (
    <FemtoDrawer
      open={openEditDrawer}
      onClose={setOpenEditDrawer}
      showOverlayLoader={showOverlayLoader}
    >
      {handleType()}
    </FemtoDrawer>
  );
};

export default EditReportDrawer;
