import React, { useEffect, useContext, useState } from "react";
import moment from "moment";
import { Button, Grid, Select } from "@mantine/core";
import { QuickbooksDatePeriod } from "../../../../../components/modals/quickbooks-date-period/QuickbooksDatePeriod";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import "./style/DataUpdate.scss";
import { handleResponseError } from "../../../../../utils/errorHandling";
import { QuickbooksErrors } from "../../../../../components/modals/quickbooks-errors/QuickbooksErrors";
import { handleChangeCompanyPathIsDone } from "../../../../helpers/HandleChangeCompanyPath";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { useLocation, useNavigate } from "react-router-dom";
import StillProcessingModal from "../../../../../components/modals/still-processing/StillProcessingModal";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";

const FinancialData = ({
  data,
  setConfirmReplaceFinancialDataModalopened,
  setEditMode,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [days, setDays] = useState([]);
  const [currentPeriodicallyDayUpdate, setcurrentPeriodicallyDayUpdate] =
    useState(28);
  // this state for Quickbooks date period modal
  // will take the date period interval (from -> to)
  const [openQ_datePeriodModal, setOpenQ_datePeriodModal] = useState(false);
  const [q_datePeriod, setQ_datePeiod] = useState({ from: null, to: null });
  const [updateQuickbooksLoader, setUpdateQuickbooksLoader] = useState(false);
  const [showQErrorModal, setShowQErrorModal] = useState(false);
  const [q_errors, setQ_errors] = useState(null);
  const [showProcessingError, setShowProcessingError] = useState(false);

  const { fetchTimeFrame } = useContext(TimeFrameContext);
  const {
    setCompanies,
    deleteCompanyPrefernces,
    selectedCompany,
    setSelectedCompany,
    fetchCompanyList,
  } = useContext(CompaniesContext);

  useEffect(() => {
    if (data.data_source === "Quickbooks") {
      let AllDays = [];
      for (let i = 0; i < 28; i++) {
        AllDays.push({ label: `Day ${i + 1}`, value: i + 1 });
      }
      setDays(AllDays);
      if (data?.periodically_update)
        setcurrentPeriodicallyDayUpdate(data.periodically_update);
    }
  }, []);

  const updateQuickbooksData = () => {
    setUpdateQuickbooksLoader(true);
    axios
      .put(`/company/quickbooks/update/${data.uuid}/`, {
        state: `from=${q_datePeriod.from},to=${q_datePeriod.to}`,
      })
      .then((res) => {
        setSelectedCompany(res.data);
        deleteCompanyPrefernces(selectedCompany.uuid);

        let newPath = handleChangeCompanyPathIsDone({
          newCompany: res.data,
          location,
        });

        // when update the company , it is added in the DB as a new company object
        // so I need to added it in the company list
        // so when change the UUID in the path
        // the the {RequireSubscription} guard will find the new company UUID
        setCompanies((prev) => [...prev, res.data]);

        if (newPath) {
          navigate(newPath);
          setTimeout(() => {
            fetchCompanyList();
            fetchTimeFrame(res.data.uuid);
          });
        }

        setUpdateQuickbooksLoader(false);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 403) handleResponseError(err);
          else if (err.response.status === 406) {
            setShowProcessingError(true);
          } else {
            setShowQErrorModal(true);
            setQ_errors(err.response.data);
          }
          setUpdateQuickbooksLoader(false);
        }
      });
  };

  const updatePeriodicalyDay = (value) => {
    axios
      .put(`/company/quickbooks/periodically/update/${data.uuid}/`, {
        periodically_update: value,
      })
      .then(() => {
        notifications.show({
          title: "Success",
          message: "Periodically day updated successfully",
        });
      })
      .catch((error) => {
        handleResponseError(error);
      });
  };

  const handleHideQuickbooksModal = () => {
    setOpenQ_datePeriodModal(false);
  };
  const handleHideQuickbooksErrorModal = () => {
    setShowQErrorModal(false);
  };
  const handleHideStillProcessing = () => {
    setShowProcessingError(false);
  };

  return (
    <div className="CardData__financial">
      {openQ_datePeriodModal && (
        <QuickbooksDatePeriod
          showModal={openQ_datePeriodModal}
          handleHideQuickbooksModal={handleHideQuickbooksModal}
          handleQuickbooksIntegration={updateQuickbooksData}
          datePeriod={q_datePeriod}
          setPeriod={setQ_datePeiod}
        />
      )}
      {showQErrorModal && (
        <QuickbooksErrors
          showModal={showQErrorModal}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
          error={q_errors}
        />
      )}
      {showProcessingError && (
        <StillProcessingModal
          opened={showProcessingError}
          handleHideStillProcessing={handleHideStillProcessing}
          url={`/company/${selectedCompany?.uuid}/analysis/settings/data-update`}
        />
      )}
      <div style={{ height: "100%" }}>
        <p className="title1">Financials data</p>
        <div>
          <div className="mb__10">
            <span className="span1">Source: </span>
            {data.data_source === "Excel" ? (
              <span className="span2">
                <i class="fa-solid fa-file-excel fileIcon"></i>
                <span>Excel sheet</span>
              </span>
            ) : (
              <span className="span2">
                <span>Quickbooks</span>
              </span>
            )}
          </div>
          <div className="mb__10">
            <span className="span1">Last updated:</span>
            <span className="span3"> {moment(data.modified).fromNow()}</span>
            <span className="span4">
              ({moment(data.modified).format("Do MMMM YYYY HH:mm a")})
            </span>
            {data.data_source === "Quickbooks" && (
              <Grid className="select__day__div">
                <Grid.Col span={5}>
                  <span>Auto update date:</span>
                </Grid.Col>
                <Grid.Col span={7}>
                  <SingleDropdown
                    data={days}
                    value={days.find(
                      (item) => item.value === currentPeriodicallyDayUpdate
                    )}
                    onChange={(e) => {
                      updatePeriodicalyDay(e.value);
                      setcurrentPeriodicallyDayUpdate(e.value);
                    }}
                    withAsterisk
                    data-testid="periodically__update__select"
                  />
                </Grid.Col>
              </Grid>
            )}
          </div>
        </div>
      </div>
      <div className="button__div__upload">
        {data.data_source === "Quickbooks" ? (
          <Button
            size="md"
            radius={"md"}
            loading={updateQuickbooksLoader}
            data-testid="update__quickbooks__data__btn"
            onClick={() => setOpenQ_datePeriodModal(true)}
          >
            Update financial data
          </Button>
        ) : (
          <Button
            size="md"
            radius={"md"}
            data-testid="update_excel_data"
            onClick={() => {
              setEditMode("reupload");
              setConfirmReplaceFinancialDataModalopened(true);
            }}
          >
            Reupload excel sheet
            <i class="fa-solid fa-file-excel fileIcon"></i>
          </Button>
        )}
      </div>
    </div>
  );
};
export default FinancialData;
