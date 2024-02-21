import React, { useEffect, useLayoutEffect, useContext, useState } from "react";
import FinancialData from "./FinancialData";
import BreakdownData from "./BreakdownData";
import { Button, Flex, Loader, Modal } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import axios from "axios";
import { handleResponseError } from "../../../../../utils/errorHandling";
import { useParams, useNavigate } from "react-router-dom";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import NonFinancialKPIs from "./NonFinancialKPIs";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import StillProcessingModal from "../../../../../components/modals/still-processing/StillProcessingModal";
import DataUpdateEditPeriod from "../../../../../components/modals/data-update-edit-period/DataUpdateEditPeriod";
import ReplaceFinancialDataModal from "../../../../../components/modals/replace-financial-data/ReplaceFinancialDataModal";
import CompanyLoading from "../../../../components/company-loading/CompanyLoading";
import "./style/DataUpdate.scss";

const DataUpdate = () => {
  const params = useParams();
  const [datePeriodsDropDown, setDatePeriodsDropDown] = useState([]);
  const [startPeriod, setStartPeriod] = useState("");
  const [endPeriod, setEndPeriod] = useState("");
  const [financialData, setfinancialData] = useState({});
  const [breakdown, setbreakdownData] = useState({});
  const [editPeriodModalopened, setOpenEditPeriodModal] = useState(false);
  const [
    confirmReplaceFinancialDataModalopened,
    setConfirmReplaceFinancialDataModalopened,
  ] = useState(false);
  const [showEditPeriodErrorModal, setShowEditPeriodErrorModal] =
    useState(false);
  const [editMode, setEditMode] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [newEditPeriods, setNewEditPeriods] = useState({
    selectedOption: "start_from",
    start_date: "",
    before_date: "",
  });
  const [kpiData, setKpiData] = useState(null);
  const [editPeriodLoading, setEditPeriodLoading] = useState(false);
  const [listOfYears, setListOfYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const { width } = useViewportSize();
  const { fetchTimeFrame } = useContext(TimeFrameContext);
  const { selectedCompany, fetchSelectedCompany, isSelectedCompanyReady } =
    useContext(CompaniesContext);

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    if (selectedCompany && isSelectedCompanyReady) {
      fetchData();
      fetchListOfYears();
    }
  }, [selectedCompany, isSelectedCompanyReady]);

  useEffect(() => {
    if (selectedYear && isSelectedCompanyReady) {
      fetchKpiData();
    }
  }, [selectedYear, isSelectedCompanyReady]);

  useEffect(() => {
    if (datePeriodsDropDown.length === 0) setOpenEditPeriodModal(false);
  }, [datePeriodsDropDown]);

  const fetchListOfYears = () => {
    axios
      .get(`/analysis/data_update/timeframe/${selectedCompany.uuid}/`)
      .then((res) => {
        setListOfYears(res.data.timeframe);
        if (res.data.timeframe.length > 0) {
          setSelectedYear(res.data.timeframe.at(-1));
        }
      })
      .catch((err) => {
        handleResponseError(err);
      });
  };
  const fetchData = () => {
    setDataLoading(true);

    axios
      .get(`/analysis/data_update/${selectedCompany.uuid}/`)
      .then((res) => {
        setfinancialData(res.data.financial_data);
        setbreakdownData(res.data.breakdown);

        handleListDatePeriodDropDown(res.data.dates_periods);
      })
      .catch((err) => {
        handleResponseError(err);
      })
      .finally(() => {
        setDataLoading(false);
      });
  };

  const fetchKpiData = () => {
    axios
      .get(
        `/analysis/data_update/kpi/${params.companyId}/?financial_year=${selectedYear}`
      )
      .then((res) => {
        setKpiData(res.data);
      })
      .catch((err) => {
        handleResponseError(err);
      });
  };
  const editPeriodModal = () => {
    return (
      <Modal
        radius={"lg"}
        size={
          width < 810
            ? "calc(100vw - 3rem)"
            : width < 1199
            ? "calc(70vw - 3rem)"
            : "calc(35vw - 3rem)"
        }
        opened={editPeriodModalopened}
        centered
        onClose={() => setOpenEditPeriodModal(false)}
        data-testid="edit_Period_modal"
      >
        <DataUpdateEditPeriod
          listOfDatePeriod={datePeriodsDropDown}
          newEditPeriods={newEditPeriods}
          setNewEditPeriods={setNewEditPeriods}
          editPeriodAPI={editPeriodAPI}
          editPeriodLoading={editPeriodLoading}
          setOpenEditPeriodModal={setOpenEditPeriodModal}
        />
      </Modal>
    );
  };

  const editPeriodAPI = () => {
    setEditPeriodLoading(true);
    axios
      .post(`/analysis/data_update/proiodes/${params.companyId}/`, {
        removing_type: newEditPeriods.selectedOption,
        date:
          newEditPeriods.selectedOption === "start_from"
            ? newEditPeriods.start_date
            : newEditPeriods.before_date,
      })
      .then((res) => {
        localStorage.removeItem(`${params.companyId}_freq_timeframe`);
        fetchTimeFrame(params.companyId);
        setEditPeriodLoading(false);
        setOpenEditPeriodModal(false);
        handleListDatePeriodDropDown(res.data);
      })
      .catch((error) => {
        setEditPeriodLoading(false);
        setOpenEditPeriodModal(false);
        /* 
          Case when the user tries to update the 
          period of a company that is still processing
        */
        if (error.response.status === 406) {
          setShowEditPeriodErrorModal(true);
        } else {
          handleResponseError(error);
        }
      });
  };

  const handleListDatePeriodDropDown = (data) => {
    if (data.length > 0) {
      setStartPeriod(data.at(0));
      if (data.length === 1) {
        setEndPeriod(data.at(0));
      } else {
        setEndPeriod(data.at(-1));
      }
    }
    let allData = data.filter((item, index) => {
      if (index > 0) return item;
    });
    setDatePeriodsDropDown([
      ...allData.map((item) => {
        return {
          label: `${item}`,
          value: `${item}`,
        };
      }),
    ]);
  };

  const handleHideStillProcessing = () => {
    setShowEditPeriodErrorModal(false);
  };

  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="Financial data" />;
  }

  return dataLoading && selectedCompany ? (
    <Flex align={"center"} justify="center" h="100%" mt="10%">
      <Loader />
    </Flex>
  ) : (
    <div className="data__update__page">
      {editPeriodModal()}
      <ReplaceFinancialDataModal
        confirmReplaceFinancialDataModalopened={
          confirmReplaceFinancialDataModalopened
        }
        setConfirmReplaceFinancialDataModalopened={
          setConfirmReplaceFinancialDataModalopened
        }
        setOpenEditPeriodModal={setOpenEditPeriodModal}
        editMode={editMode}
        setEditMode={setEditMode}
      />
      <div className="first__div">
        <p className="title__page_update">Data Update</p>
        <p className="sub__title__update">
          Import or update your financial and non-financial data.
        </p>
      </div>
      <div>
        <p className="content__title__update">Data Periods</p>
        <div className="data__period__div">
          <p>
            <span className="data__period__span1"> Data Period:</span>
            <span className="period__year">{startPeriod}</span>
            <span className="data__period__sperator">-</span>
            <span className="period__year">{endPeriod}</span>
          </p>
          {datePeriodsDropDown.length > 0 && (
            <button
              className={"data__period__edit"}
              data-testid="edit_period_btn"
              onClick={() => {
                setEditMode("dataUpdate");
                setConfirmReplaceFinancialDataModalopened(true);
              }}
            >
              <i className="fa-solid fa-pen-to-square editIcon"></i>Edit Date
              Period
            </button>
          )}
        </div>
        <FinancialData
          data={financialData}
          setConfirmReplaceFinancialDataModalopened={
            setConfirmReplaceFinancialDataModalopened
          }
          setEditMode={setEditMode}
        />
        <BreakdownData data={breakdown} />
        {kpiData && listOfYears && (
          <NonFinancialKPIs
            data={kpiData}
            setSelectedYear={setSelectedYear}
            selectedYear={selectedYear}
            listOfYears={listOfYears}
          />
        )}
        <StillProcessingModal
          opened={showEditPeriodErrorModal}
          handleHideStillProcessing={handleHideStillProcessing}
        />
      </div>
    </div>
  );
};

export default DataUpdate;
