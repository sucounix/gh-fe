import CreateReport from "./create-report/CreateReport";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import "./style/reports.scss";
import { motion } from "framer-motion";
import { Loader } from "@mantine/core";
import { handleResponseError } from "../../../utils/errorHandling";
import ListRecentReports from "./ListRecentReports";
import ListReports from "./list-reports/ListReports";
import axios from "axios";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DeleteSingleReportModal from "../../../components/modals/delete-single-report/DeleteSingleReportModal";
import DeleteMultipleReportModal from "../../../components/modals/delete-multiple-report/DeleteMultipleReportModal";
import EditReportPeriodModal from "../../../components/modals/edit-report-period-modal/EditReportPeriodModal";
import UpgradeSubscriptionForReportKit from "../../../components/modals/upgrade-subscription-for-report-kit/UpgradeSubscriptionForReportKit";
import { useNavigate, Link } from "react-router-dom";
import plansStaticData from "../subscription-plan/PlansData.json";
import FemtoAlert from "../../../components/femto-alert/FemtoAlert";
import CompanyLoading from "../../components/company-loading/CompanyLoading";

const Reports = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [responseData, setResponseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isRecentListLoading, setIsRecentListLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [emblaInstance, setEmblaInstance] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentSortOption, setCurrentSortOption] = useState("modified_desc");
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpgradeSubscriptionPopup, setShowUpgradeSubscriptionPopup] =
    useState(false);
  const [currentSnap, setCurrentSnap] = useState(0);
  const [selectedReports, setSelectedReports] = useState([]);
  // this state will contain the report uuid till the user confirm/cancel the delete process
  const [deleteReportUUID, setDeleteReportUUID] = useState(null);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [showEditReportPeriod, setShowEditReportPeriod] = useState(false);
  const [inEditReport, setInEditReport] = useState(null);
  const [createBtnLoading, setCreateBtnLoading] = useState(false);

  const { selectedCompany, isSelectedCompanyReady, fetchSelectedCompany } =
    useContext(CompaniesContext);
  const { canCreateReport } = useContext(SubscriptionContext);
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);

  const navigate = useNavigate();

  const [openedSingleDelete, singleDeleteHandlers] = useDisclosure(false);
  const [openedMultipleDelete, multipleDeleteHandlers] = useDisclosure(false);

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    setBreadCrumbs([
      {
        title: "Reports",
      },
      {
        title: "List",
      },
    ]);
  }, []);

  useEffect(() => {
    fetchRecentReports();
  }, [selectedCompany]);

  useEffect(() => {
    fetchReportList();
  }, [pageNumber, searchValue, currentSortOption, selectedCompany]);

  const fetchRecentReports = () => {
    setIsRecentListLoading(true);

    axios
      .get("/report/reports/recent", {
        params: {
          company_uuid: selectedCompany.uuid,
        },
      })
      .then((res) => {
        setRecentReports(res.data);
        setIsRecentListLoading(false);
      })
      .catch((e) => {
        handleResponseError(e);
        setIsRecentListLoading(false);
      });
  };

  const fetchReportList = () => {
    setLoading(true);
    setSelectedReports([]);

    axios
      .get("/report/reports", {
        params: {
          company_uuid: selectedCompany.uuid,
          page: pageNumber,
          size: 10,
          sort_key: currentSortOption.split("_")[0],
          sort_order: currentSortOption.split("_")[1],
          search_key: "title",
          search_value: searchValue,
        },
      })
      .then((res) => {
        setResponseData(res.data);
      })
      .catch((e) => {
        handleResponseError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (emblaInstance) {
      emblaInstance.on("select", () => {
        setCurrentSnap(emblaInstance.selectedScrollSnap());
      });
    }
  }, [emblaInstance]);

  const confirmDeleteSingleReportModal = (reportUUID) => {
    setDeleteReportUUID(reportUUID);
    singleDeleteHandlers.open();
  };

  const deleteSingleReport = (reportUUID) => {
    setDeleteLoader(true);
    axios
      .delete(`report/reports/${reportUUID}/`)
      .then((res) => {
        fetchReportList();
        fetchRecentReports();
      })
      .catch((err) => {
        handleResponseError(err);
      })
      .finally(() => {
        setDeleteLoader(false);
        singleDeleteHandlers.close();
      });
  };

  const deleteMultipleReport = () => {
    setDeleteLoader(true);
    let requestBody = ``;
    for (let i = 0; i < selectedReports.length; i++) {
      requestBody += `${selectedReports[i]}`;
      if (i < selectedReports.length - 1) {
        requestBody += `,`;
      }
    }
    axios
      .delete(`report/reports/bulk_delete/`, { params: { uuids: requestBody } })
      .then(() => {
        fetchReportList();
        fetchRecentReports();
      })
      .catch((err) => {
        handleResponseError(err);
      })
      .finally(() => {
        setDeleteLoader(false);
        multipleDeleteHandlers.close();
      });
  };

  const handleReportClick = (report) => {
    if (report.is_valid) {
      navigate(`${report.uuid}`);
    } else {
      setShowEditReportPeriod(true);
      setInEditReport(report);
    }
  };

  const handleCreateReport = (values) => {
    if (canCreateReport()) {
      setCreateBtnLoading(true);
      let data = {
        template_ref: values.template_ref,
        frequency_period: values.frequency_period,
        period: values.period,
        title: values.reportName,
      };
      axios
        .post("report/reports/", data, {
          params: {
            company_uuid: selectedCompany?.uuid,
          },
        })
        .then((res) => {
          setShowCreatePopup(false);
          navigate(`${res.data.uuid}`);
        })
        .catch((err) => {
          handleResponseError(err);
          setShowCreatePopup(false);
        })
        .finally(() => {
          setCreateBtnLoading(false);
        });
    } else {
      setShowCreatePopup(false);
      setShowUpgradeSubscriptionPopup(true);
    }
  };

  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="company data" />;
  }

  return (
    <>
      {openedSingleDelete && deleteReportUUID && (
        <DeleteSingleReportModal
          deleteReportUUID={deleteReportUUID}
          singleDeleteHandlers={singleDeleteHandlers}
          deleteSingleReport={deleteSingleReport}
          deleteLoader={deleteLoader}
        />
      )}
      {openedMultipleDelete && selectedReports.length > 0 && (
        <DeleteMultipleReportModal
          multipleDeleteHandlers={multipleDeleteHandlers}
          deleteMultipleReport={deleteMultipleReport}
          deleteLoader={deleteLoader}
        />
      )}
      {showEditReportPeriod && (
        <EditReportPeriodModal
          showEditReportPeriod={showEditReportPeriod}
          setShowEditReportPeriod={setShowEditReportPeriod}
          inEditReport={inEditReport}
          setInEditReport={setInEditReport}
          setResponseData={setResponseData}
          setRecentReports={setRecentReports}
        />
      )}

      {showUpgradeSubscriptionPopup && (
        <UpgradeSubscriptionForReportKit
          pricePlan={plansStaticData.plans[1].monthlyPrice}
          showUpgradeSubscriptionPopup={showUpgradeSubscriptionPopup}
          setShowUpgradeSubscriptionPopup={setShowUpgradeSubscriptionPopup}
        />
      )}

      <CreateReport
        showCreatePopup={showCreatePopup}
        setShowCreatePopup={setShowCreatePopup}
        handleCreateReport={handleCreateReport}
        createBtnLoading={createBtnLoading}
      />

      <div className="reports__wrapper">
        <div className="reports__header">
          <span className="page__title">Reports</span>
        </div>
        <section className="recents__section">
          <div className="recents__header">
            {!canCreateReport() && (
              <div className="lock_hint_div ">
                <FemtoAlert
                  data-testid="upgrade_link"
                  state="warning"
                  icon={<i className="fa-solid fa-triangle-exclamation"></i>}
                  caption={`To unlock full functionality and access, `}
                  captionLinkLabel={"Upgrade now"}
                  captionLinkUrl={
                    "/organisation-settings/subscription-settings"
                  }
                ></FemtoAlert>
              </div>
            )}
            <div className="recents__title__wrapper">
              <p className="recents__title">Recent Reports</p>
              {!isRecentListLoading && recentReports.length > 4 && (
                <div className="carousel__controls">
                  <i
                    onClick={() => {
                      emblaInstance && emblaInstance.scrollPrev();
                    }}
                    className={
                      currentSnap === 0
                        ? "fa-sharp fa-regular fa-chevron-left carousel__control disabled__control"
                        : "fa-sharp fa-regular fa-chevron-left carousel__control"
                    }
                  ></i>
                  <i
                    onClick={() => {
                      emblaInstance && emblaInstance.scrollNext();
                    }}
                    className={
                      currentSnap === 1
                        ? "fa-sharp fa-regular fa-chevron-right carousel__control disabled__control"
                        : "fa-sharp fa-regular fa-chevron-right carousel__control"
                    }
                  ></i>
                </div>
              )}
            </div>
          </div>
          <div className="recents__grid">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className=" grid__create__item recents__grid__item"
              onClick={() => setShowCreatePopup(true)}
              data-testid="create_report_btn"
            >
              <i class="fa-sharp fa-regular fa-circle-plus"></i>
              <span className="new__report__title">create new report</span>
            </motion.div>
            {!isRecentListLoading && (
              <ListRecentReports
                reports={recentReports}
                setEmblaInstance={setEmblaInstance}
                confirmDeleteSingleReportModal={confirmDeleteSingleReportModal}
                setShowEditReportPeriod={setShowEditReportPeriod}
                setInEditReport={setInEditReport}
                handleReportClick={handleReportClick}
              />
            )}
          </div>
        </section>
        <section className="reports__section" data-testid="table__section">
          <span className="reports__title">My Reports</span>{" "}
          {(responseData?.items?.length > 0 || searchValue.length > 0) && (
            <div className="search__section">
              <TextInput
                placeholder="Search by report name"
                icon={<i className="fa-sharp fa-regular fa-search"></i>}
                value={searchValue}
                data-testid="search_input"
                className="search__input"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {selectedReports.length > 0 && (
                <div className="selection__wrapper">
                  <span
                    className="selected__count"
                    data-testid="selected_count"
                  >
                    {selectedReports.length} Report
                    {selectedReports.length > 1 ? "s" : ""} selected
                  </span>

                  <span
                    data-testid="delete_multiple_reports_icon"
                    onClick={() => {
                      multipleDeleteHandlers.open();
                    }}
                  >
                    <i class="fa-regular fa-trash-can"></i>
                  </span>
                </div>
              )}
            </div>
          )}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2rem",
              }}
            >
              <Loader />
            </div>
          ) : (
            <ListReports
              response={responseData}
              setPageNumber={setPageNumber}
              setCurrentSortOption={setCurrentSortOption}
              currentSortOption={currentSortOption}
              setSelectedReports={setSelectedReports}
              selectedReports={selectedReports}
              confirmDeleteSingleReportModal={confirmDeleteSingleReportModal}
              setShowEditReportPeriod={setShowEditReportPeriod}
              setInEditReport={setInEditReport}
              handleReportClick={handleReportClick}
            />
          )}
        </section>
      </div>
    </>
  );
};
export default Reports;
