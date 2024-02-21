import React, { useEffect, useContext, useState } from "react";
import { Button, Loader, Modal, Alert, Flex, HoverCard } from "@mantine/core";
import downloadIcon from "../../../../assets/images/downloadIcon.png";
import ViewCover from "./report-components/cover/view-cover/ViewCover";
import { handleResponseError } from "../../../../utils/errorHandling";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import ViewReportText from "./report-components/text/view-text/ViewReportText";
import SectionTitle from "./report-components/section-title/SectionTitle";
import "./style/ViewReport.scss";
import BreakevenChart from "./report-components/breakeven-chart/BreakevenChart";
import WaterfallReport from "./report-components/waterfall/WaterfallReport";
import ViewReportTable from "./report-components/table/view-table/ViewReportTable";
import TrendReport from "./report-components/trend/TrendReport";
import work_in_progress_2 from "../../../../assets/images/work_in_progress_2.png";
import localEn from "./locales/en.json";
import InvalidItemView from "./report-components/invalid-item-view/InvalidItemView";
import EditReportDrawer from "./EditReportDrawer";
import { useDisclosure } from "@mantine/hooks";
import DeleteReportItemModal from "../../../../components/modals/delete-report-item/DeleteReportItemModal";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";
import astraLogo from "../../../../assets/images/astra-edit-text.png";
import AstraTokensPopover from "./AstraTokensPopover";

const ViewReport = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { setBreadCrumbs } = useContext(BreadcrumbsContext);
  const { selectedCompany } = useContext(CompaniesContext);
  const { canCreateReport } = useContext(SubscriptionContext);

  const [reportDetails, setReportDetails] = useState(null);
  const [reportDetailsLoader, setReportDetailsLoader] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [invalidReport, setInvalidReport] = useState(false);
  const [editedItemInfo, setEditedItemInfo] = useState(null);
  const [deletedItemInfo, setDeletedItemInfo] = useState(null);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);

  const [openedDelete, deleteHandlers] = useDisclosure(false);
  const [opened, { close: closePopover, open: openPopover }] =
    useDisclosure(false);

  useEffect(() => {
    if (canCreateReport()) {
      fetchReportDetails();

      setBreadCrumbs([]);
    } else {
      navigate(`/company/${selectedCompany.uuid}/reports/`);
    }
  }, []);

  useEffect(() => {
    checkReportValidation();
  }, [reportDetails]);

  useEffect(() => {
    if (params.companyId && selectedCompany?.uuid !== params.companyId) {
      navigate(`/company/${selectedCompany.uuid}/reports/`);
    }
  }, [selectedCompany]);

  const fetchReportDetails = () => {
    setReportDetailsLoader(true);

    axios
      .get(`report/reports/${params.reportId}`, {
        params: {
          company_uuid: selectedCompany?.uuid,
        },
      })
      .then((res) => {
        const isValid = res.data.is_valid;
        if (isValid) {
          setReportDetails(res.data);
          setReportDetailsLoader(false);
        } else {
          navigate(`/company/${selectedCompany.uuid}/reports`);
        }
      })
      .catch((err) => {
        handleResponseError(err);
      })
      .finally(() => {
        setReportDetailsLoader(false);
      });
  };

  const downloadPDF = () => {
    setDownloadLoading(true);

    axios
      .get(`/report/download/${params.reportId}`)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${reportDetails?.title}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((e) => {
        handleResponseError(e);
      })
      .finally(() => setDownloadLoading(false));
  };

  const handleTypes = (item, sectionIndex) => {
    if (item?.type === "text") {
      return (
        <ViewReportText
          textContent={item.text_item.value}
          sectionIndex={sectionIndex}
          setReportDetails={setReportDetails}
          isCoverSection={false}
          item={item}
          reportDetails={reportDetails}
        />
      );
    } else if (item?.type === "table") {
      if (!item.table_item.is_valid) {
        return (
          <InvalidItemView
            itemType="table"
            testId={`invalid_component_${item.table_item.uuid}`}
          />
        );
      } else {
        return <ViewReportTable data={{ ...item }} />;
      }
    } else if (item?.type === "chart") {
      if (!item.chart_item.is_valid) {
        return (
          <InvalidItemView
            itemType="chart"
            itemSubType={item?.chart_item?.type}
            testId={`invalid_component_${item.chart_item.uuid}`}
          />
        );
      } else {
        switch (item?.chart_item?.type) {
          case "breakeven":
            return <BreakevenChart item={{ ...item }} />;
          case "waterfall":
            return <WaterfallReport item={{ ...item }} />;
          case "trend_analysis":
            return <TrendReport item={{ ...item }} />;
          default:
            return <></>;
        }
      }
    }
  };

  const checkReportValidation = () => {
    let isInvalidReport = false;
    reportDetails?.sections.map((section) => {
      section.items.map((item) => {
        if (item.type === "table") {
          if (!item.table_item.is_valid) {
            isInvalidReport = true;
            return;
          }
        }
        if (item.type === "chart") {
          if (!item.chart_item.is_valid) {
            isInvalidReport = true;
            return;
          }
        }
      });
    });
    setInvalidReport(isInvalidReport);
  };

  return reportDetailsLoader ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Loader />
    </div>
  ) : (
    <div className={"view__report"}>
      {reportDetails ? (
        <>
          <div className="download__div">
            {downloadLoading ? (
              <div
                className="download_in_progress_div"
                data-testid="download_in_progress_div"
              >
                <div className="icon_container">
                  <img
                    src={work_in_progress_2}
                    alt="work_in_progress_2"
                    className="rotate"
                  />
                </div>
                <span className="download_in_progress">
                  {localEn.Download_in_progress}
                </span>
              </div>
            ) : (
              <Flex align={"center"}>
                {invalidReport && (
                  <Alert variant="light" color="red" className="alert_msg">
                    <span className="icon">
                      <i className="fa-solid fa-circle-xmark"></i>
                    </span>
                    <span className="content">
                      You can't download this report , you need to change time
                      period in some component
                    </span>
                  </Alert>
                )}
                <Button
                  variant="light"
                  radius={10}
                  size="md"
                  disabled={invalidReport}
                  loading={downloadLoading}
                  leftIcon={<img src={downloadIcon} alt="downloadIcon" />}
                  className={
                    invalidReport ? "disabled_download__btn" : "download__btn"
                  }
                  onClick={() => {
                    downloadPDF();
                  }}
                  data-testid="download__btn"
                >
                  {localEn.Download}
                </Button>
              </Flex>
            )}
          </div>
          <ViewCover
            data={reportDetails.cover}
            setReportDetails={setReportDetails}
          />
          {reportDetails && reportDetails.sections?.length
            ? reportDetails.sections.map((section, sectionIndex) => {
                return (
                  <div className="section__container">
                    <SectionTitle
                      section={section}
                      sectionIndex={sectionIndex}
                      reportDetails={reportDetails}
                      setReportDetails={setReportDetails}
                    />
                    {section.items.map((item, itemIndex) => {
                      return (
                        <div
                          className="item__container"
                          data-testid={`${item?.type}_component_${sectionIndex}_${itemIndex}`}
                        >
                          {handleTypes(item, sectionIndex)}
                          {item?.type !== "text" ? (
                            <div className="options_div">
                              <div className="options__content">
                                <div className="options_container">
                                  <span
                                    data-testId={`edit_item_icon_${sectionIndex}_${itemIndex}`}
                                    onClick={() => {
                                      setEditedItemInfo({
                                        item: item,
                                        itemIndex: itemIndex,
                                        sectionIndex: sectionIndex,
                                      });
                                      setOpenEditDrawer(true);
                                    }}
                                  >
                                    <i className="fa-solid fa-pen-to-square icon"></i>
                                  </span>
                                  <span
                                    onClick={() => {
                                      setDeletedItemInfo({
                                        item: item,
                                        sectionIndex: sectionIndex,
                                        isCoverSection: false,
                                        type: item.type,
                                      });
                                      deleteHandlers.open();
                                    }}
                                  >
                                    <i className="fa-solid fa-trash-can icon"></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            : null}
        </>
      ) : null}

      <EditReportDrawer
        editedItemInfo={editedItemInfo}
        setEditedItemInfo={setEditedItemInfo}
        reportDetails={reportDetails}
        setReportDetails={setReportDetails}
        openEditDrawer={openEditDrawer}
        setOpenEditDrawer={setOpenEditDrawer}
      />

      {/* delete table popup  */}
      <Modal
        radius={20}
        withCloseButton={false}
        opened={openedDelete}
        padding={0}
        onClose={() => deleteHandlers.close()}
      >
        <DeleteReportItemModal
          deleteHandlers={deleteHandlers}
          deletedItemInfo={deletedItemInfo}
          setReportDetails={setReportDetails}
        />
      </Modal>
    </div>
  );
};
export default ViewReport;
