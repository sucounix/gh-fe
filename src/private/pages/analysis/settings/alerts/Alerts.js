import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { Divider, Grid, Loader } from "@mantine/core";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { notifications } from "@mantine/notifications";
import { handleResponseError } from "../../../../../utils/errorHandling";
import CompanyLoading from "../../../../components/company-loading/CompanyLoading";
import ConfirmChangeYearModal from "../../../../../components/modals/confirm-year-change-modal/ConfirmYearChangeModal";
import ConfirmSwitchBetweenViewsModal from "../../../../../components/modals/confirm-switch-views-modal/ConfirmViewChangeModal";
import FixedView from "./AlertsFixedView";
import SavedButton from "./components/SavedButton";
import "./style/Alerts.scss";
import VariableView from "./AlertsVariableView";
import { useForm } from "@mantine/form";
import ViewTabs from "../../../../../components/view-tabs/ViewTabs";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";

function Alerts() {
  const params = useParams();
  const {
    selectedCompany,
    setSelectedCompany,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);

  const [alertsType, setAlertsType] = useState("fixed");
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [targetYear, setTargetYear] = useState(null);
  const [periods, setPeriods] = useState(null);
  const [confirmChangeShow, setConfirmChangeShow] = useState(false);
  const [confirmYearChange, setConfirmYearChange] = useState(false);
  const [fixedData, setFixedData] = useState(null);
  const [variableData, setVariableData] = useState(null);
  const [variableValueChange, setVariableValueChange] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isAlertsTimeframeReady, setIsAlertsTimeframeReady] = useState(false);

  const fixedForm = useForm({});
  const variableForm = useForm({});

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    if (variableForm.isTouched()) {
      setVariableValueChange(true);
    }
  }, [variableForm]);

  // fetch list of years
  useEffect(() => {
    if (isSelectedCompanyReady) {
      setIsAlertsTimeframeReady(false);

      axios
        .get(`/analysis/alerts/timeframe/${selectedCompany?.uuid}`)
        .then((res) => {
          const yearsArray = [];
          for (let i = 0; i < res.data.timeframe.length; i++) {
            yearsArray.push({
              label: res.data.timeframe[i],
              value: res.data.timeframe[i],
            });
          }
          setPeriods(yearsArray);
          setAlertsType(selectedCompany?.alerts);
          setSelectedYear(yearsArray.at(-1).value);
          setIsAlertsTimeframeReady(true);
        })
        .catch((err) => {
          handleResponseError(err);
        });
    }
  }, [selectedCompany?.uuid, isSelectedCompanyReady]);

  useEffect(() => {
    if (isAlertsTimeframeReady && isSelectedCompanyReady) getData();
  }, [
    alertsType,
    selectedYear,
    selectedCompany,
    isAlertsTimeframeReady,
    isSelectedCompanyReady,
  ]);

  // when change the selected year check if
  // --> the form is changed then will render the popup
  // --> else will change the selected year normally
  useEffect(() => {
    if (targetYear && targetYear !== selectedYear && variableValueChange) {
      setConfirmYearChange(true);
    } else {
      setSelectedYear(targetYear);
    }
  }, [targetYear]);

  const prepareFixedForm = (res) => {
    setFixedData(res.data.data);
    for (let i = 0; i < res.data.data.length; i++) {
      for (let j = 0; j < res.data.data[i].kpis.length; j++) {
        // set toggle value
        fixedForm.setFieldValue(
          `toggle_section_${i}_row_${j}`,
          res.data.data[i].kpis[j].kpi_alert.is_active ? "ON" : "OFF"
        );
        // set input value
        fixedForm.setFieldValue(`group_${i}_row_${j}`, {
          value: res.data.data[i].kpis[j].kpi_alert.values,
        });
      }
    }
  };

  const prepareVariableForm = (res) => {
    setVariableData(res.data.data);
    for (let i = 0; i < res.data.data.length; i++) {
      for (let j = 0; j < res.data.data[i].kpis.length; j++) {
        // set toggle value
        variableForm.setFieldValue(
          `toggle_section_${i}_row_${j}`,
          res.data.data[i].kpis[j].kpi_alert.is_active ? "ON" : "OFF"
        );
        // set inout value
        variableForm.setFieldValue(
          `group_${i}_sliderRow_${j}`,
          res.data.data[i].kpis[j].kpi_alert.values
        );
      }
    }
  };

  const getData = () => {
    if (selectedYear) {
      setPageLoading(true);
      setVariableValueChange(false);
      axios
        .get(
          `/analysis/alerts/${selectedCompany.uuid}?year=${selectedYear}&type=${alertsType}`
        )
        .then((res) => {
          alertsType === "fixed" && prepareFixedForm(res);
          alertsType === "variable" && prepareVariableForm(res);

          variableForm.resetDirty();
          variableForm.resetTouched();

          fixedForm.resetDirty();
          fixedForm.resetTouched();
        })
        .catch((err) => {
          handleResponseError(err);
        })
        .finally(() => {
          setPageLoading(false);
        });
    }
  };

  const handleSubmitVariableData = (values) => {
    let variableDataCopy = [...variableData];

    if (values) {
      for (let i = 0; i < Object.keys(variableDataCopy).length; i++) {
        for (let j = 0; j < variableDataCopy[i].kpis.length; j++) {
          // get toggle value
          variableDataCopy[i].kpis[j].kpi_alert.is_active =
            values[`toggle_section_${i}_row_${j}`] === "ON" ? true : false;

          // get input value
          variableDataCopy[i].kpis[j].kpi_alert.values =
            values[`group_${i}_sliderRow_${j}`];
        }
      }
    }
    return variableDataCopy;
  };

  const handleSubmitFixedData = (values) => {
    let fixedDataCopy = [...fixedData];

    if (values) {
      for (let i = 0; i < Object.keys(fixedDataCopy).length; i++) {
        for (let j = 0; j < fixedDataCopy[i].kpis.length; j++) {
          // get toggle value
          fixedDataCopy[i].kpis[j].kpi_alert.is_active =
            values[`toggle_section_${i}_row_${j}`] === "ON" ? true : false;

          // get input value
          fixedDataCopy[i].kpis[j].kpi_alert.values =
            values[`group_${i}_row_${j}`].value;
        }
      }
    }
    return fixedDataCopy;
  };

  const handleSubmit = (values) => {
    if (selectedCompany.alerts !== alertsType && !confirmChangeShow) {
      setConfirmChangeShow(true);
    } else if (values) {
      setConfirmChangeShow(false);
      setSubmitLoading(true);
      const requestData = {
        type: alertsType,
      };

      alertsType === "fixed" &&
        (requestData.value = handleSubmitFixedData(values));

      alertsType === "variable" &&
        (requestData.values = handleSubmitVariableData(values));

      axios
        .put(`/analysis/alerts/${params.companyId}/`, requestData)
        .then((res) => {
          setSubmitLoading(false);

          notifications.show({
            title: "Success",
            message: "Alerts updated successfully",
          });
        })
        .catch((err) => {
          handleResponseError(err);
        })
        .finally(() => {
          setSelectedCompany((prevState) => ({
            ...prevState,
            alerts: alertsType,
          }));

          setSubmitLoading(false);
          setVariableValueChange(false);
          setConfirmChangeShow(false);
        });
    }
  };

  const handleHideChangeViewModal = () => {
    setConfirmChangeShow(false);
  };

  const handleChangeYearModalHide = () => {
    setConfirmYearChange(false);
  };

  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="Alerts" />;
  }
  return (
    <>
      <form
        onSubmit={
          alertsType === "variable"
            ? variableForm.onSubmit((values) => handleSubmit(values))
            : fixedForm.onSubmit((values) => {
                handleSubmit(values);
              })
        }
      >
        <ConfirmSwitchBetweenViewsModal
          confirmChangeShow={confirmChangeShow}
          type={alertsType}
          item="alerts"
          handleSubmit={handleSubmit}
          form={alertsType === "fixed" ? fixedForm : variableForm}
          submitLoading={submitLoading}
          handleHideChangeViewModal={handleHideChangeViewModal}
        />

        <ConfirmChangeYearModal
          targetYear={targetYear}
          confirmYearChange={confirmYearChange}
          handleChangeYearModalHide={handleChangeYearModalHide}
          setSelectedYear={setSelectedYear}
        />

        <div
          className="alerts__page__wrapper"
          style={
            alertsType === "fixed"
              ? { marginInlineEnd: 20 }
              : { marginInlineEnd: 0 }
          }
        >
          <div className="alerts__page__header">
            <span className="alerts__page__title">Alerts</span>
            <span className="alerts__page__subtitle">
              Turn on the alerts you wish to monitor
            </span>
          </div>
          <Divider />

          <Grid className="alerts__page__tools">
            <Grid.Col span={10}>
              <ViewTabs
                view={alertsType}
                setView={setAlertsType}
                options={[
                  {
                    label: "Fixed Alerts",
                    value: "fixed",
                  },
                  {
                    label: "Variable Alerts",
                    value: "variable",
                  },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <div className="year__select__wrapper">
                {alertsType === "variable" && (
                  <SingleDropdown
                    onChange={(e) => {
                      setTargetYear(e.value);
                    }}
                    data={periods}
                    value={periods.find(
                      (period) => period.value === selectedYear
                    )}
                    optionLabel={"label"}
                    optionValue={"value"}
                    field="Year"
                  />
                )}
                {fixedForm.isTouched() || variableForm.isTouched() ? (
                  <SavedButton
                    submitLoading={submitLoading}
                    alertsType={alertsType}
                    fixedForm={fixedForm}
                    variableForm={variableForm}
                    setConfirmChangeShow={setConfirmChangeShow}
                  />
                ) : null}
              </div>
            </Grid.Col>
          </Grid>
          {pageLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "centet",
                width: "100%",
              }}
            >
              <Loader />
            </div>
          ) : (
            <>
              {alertsType === "fixed" && (
                <FixedView
                  form={fixedForm}
                  fixedFormValues={fixedForm.values}
                  fixedData={fixedData}
                />
              )}

              {alertsType === "variable" && (
                <VariableView
                  form={variableForm}
                  variableFormValues={variableForm.values}
                  variableData={variableData}
                  setVariableValueChange={setVariableValueChange}
                />
              )}
            </>
          )}
        </div>
      </form>
    </>
  );
}

export default Alerts;
