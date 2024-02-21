import { Button, Divider, Grid, Loader } from "@mantine/core";
import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import "./style/BudgetSettings.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { handleResponseError } from "../../../../../utils/errorHandling";
import { notifications } from "@mantine/notifications";
import CompanyLoading from "../../../../components/company-loading/CompanyLoading";
import { useForm } from "@mantine/form";
import BudgetsFixedView from "./BudgetsFixedView";
import BudgetsVariableView from "./BudgetsVariableView";
import ConfirmChangeYearModal from "../../../../../components/modals/confirm-year-change-modal/ConfirmYearChangeModal";
import ConfirmSwitchBetweenViewsModal from "../../../../../components/modals/confirm-switch-views-modal/ConfirmViewChangeModal";
import ViewTabs from "../../../../../components/view-tabs/ViewTabs";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";

function BudgetSettings() {
  const params = useParams();

  const [budgetType, setBudgetType] = useState("fixed");
  const [selectedYear, setSelectedYear] = useState(null);
  const [targetYear, setTargetYear] = useState(null);
  const [originalYear, setOriginalYear] = useState(null);
  const [periods, setPeriods] = useState(null);
  const [confirmChangeShow, setConfirmChangeShow] = useState(false);
  const [confirmYearChange, setConfirmYearChange] = useState(false);
  const [variableValueChange, setVariableValueChange] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [inEditKPIID, setInEditKPIID] = useState(null);
  const [variableDataLoading, setVariableDataLoading] = useState(false);
  const [fixedDataLoading, setFixedDataLoading] = useState(false);
  const [isBudgetTimeframeReady, setIsBudgetTimeframeReady] = useState(false);

  const {
    selectedCompany,
    setSelectedCompany,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);

  const [fixedBudget, setFixedBudget] = useState(null);
  const [variableBudget, setVariableBudget] = useState(null);

  const fixedForm = useForm({
    validate: (values) => {
      const errors = {};
      Object.keys(values).map((key) => {
        if (values[key].value === "") {
          errors[key] = " Value cannot be empty";
        }
      });
      return errors;
    },
  });
  const variableForm = useForm({});

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    if (isSelectedCompanyReady) {
      setIsBudgetTimeframeReady(false);

      axios
        .get(`/analysis/budgets/timeframe/${selectedCompany?.uuid}`)
        .then((res) => {
          const yearsArray = [];
          for (let i = 0; i < res.data.timeframe.length; i++) {
            yearsArray.push({
              label: res.data.timeframe[i],
              value: res.data.timeframe[i],
            });
          }
          setPeriods(yearsArray);
          setBudgetType(selectedCompany?.budgets);
          setSelectedYear(yearsArray.at(-1).value);
          setOriginalYear(yearsArray.at(-1).value);
          setIsBudgetTimeframeReady(true);
        })
        .catch((e) => {});
    }
  }, [selectedCompany?.uuid, isSelectedCompanyReady]);

  useEffect(() => {
    if (variableForm.isTouched()) {
      setVariableValueChange(true);
    }
  }, [variableForm]);

  useEffect(() => {
    if (isSelectedCompanyReady && isBudgetTimeframeReady) {
      getData();
    }
  }, [
    budgetType,
    selectedYear,
    selectedCompany?.uuid,
    isBudgetTimeframeReady,
    isSelectedCompanyReady,
  ]);

  useEffect(() => {
    setVariableValueChange(false);
    setInEditKPIID(null);
  }, [budgetType]);

  useEffect(() => {
    if (targetYear) {
      if (targetYear !== selectedYear && variableValueChange) {
        setConfirmYearChange(true);
      } else {
        setSelectedYear(targetYear);
      }
    }
  }, [targetYear]);

  const prepareFixedForm = (res) => {
    setFixedBudget(res.data.data);
    for (let i = 0; i < res.data.data.length; i++) {
      for (let j = 0; j < res.data.data[i].kpis.length; j++) {
        // set input value
        fixedForm.setFieldValue(`group_${i}_row_${j}`, {
          value: res.data.data[i].kpis[j].kpi_budgets,
        });
      }
    }
  };

  const prepareVariableForm = (res) => {
    setVariableBudget(res.data.data);
    for (let i = 0; i < res.data.data.length; i++) {
      for (let j = 0; j < res.data.data[i].kpis.length; j++) {
        // set inout value
        variableForm.setFieldValue(
          `group_${i}_sliderRow_${j}`,
          res.data.data[i].kpis[j].kpi_budgets
        );
      }
    }
  };

  const getData = () => {
    setVariableDataLoading(true);
    setFixedDataLoading(true);
    setVariableValueChange(false);

    if (selectedYear) {
      axios
        .get(
          `/analysis/budgets/${selectedCompany.uuid}?year=${selectedYear}&type=${budgetType}`
        )
        .then((res) => {
          budgetType === "fixed" && prepareFixedForm(res);
          budgetType === "variable" && prepareVariableForm(res);

          variableForm.resetDirty();
          variableForm.resetTouched();

          fixedForm.resetDirty();
          fixedForm.resetTouched();
        })
        .catch((e) => {
          handleResponseError(e);
        })
        .finally(() => {
          setVariableDataLoading(false);
          setFixedDataLoading(false);
          setVariableValueChange(false);
        });
    }
  };

  const handleSubmitVariableData = (values) => {
    let variableDataCopy = [...variableBudget];

    if (values) {
      for (let i = 0; i < Object.keys(variableDataCopy).length; i++) {
        for (let j = 0; j < variableDataCopy[i].kpis.length; j++) {
          // get input value
          variableDataCopy[i].kpis[j].kpi_budgets =
            values[`group_${i}_sliderRow_${j}`];
        }
      }
    }
    return variableDataCopy;
  };

  const handleSubmitFixedData = (values) => {
    let fixedDataCopy = [...fixedBudget];

    if (values) {
      for (let i = 0; i < Object.keys(fixedDataCopy).length; i++) {
        for (let j = 0; j < fixedDataCopy[i].kpis.length; j++) {
          // get input value
          fixedDataCopy[i].kpis[j].kpi_budgets =
            values[`group_${i}_row_${j}`].value;
        }
      }
    }
    return fixedDataCopy;
  };

  const handleSubmit = (values) => {
    if (selectedCompany.budgets !== budgetType && !confirmChangeShow) {
      setConfirmChangeShow(true);
    } else if (values) {
      setConfirmChangeShow(false);
      setSubmitLoading(true);

      const requestData = {
        type: budgetType,
      };

      budgetType === "fixed" &&
        (requestData.value = handleSubmitFixedData(values));
      budgetType === "variable" &&
        (requestData.values = handleSubmitVariableData(values));

      axios
        .put(`/analysis/budgets/${params.companyId}/`, requestData)
        .then((res) => {
          notifications.show({
            title: "Success",
            message: "Budgets updated successfully",
          });

          setSelectedCompany((prevState) => ({
            ...prevState,
            budgets: budgetType,
          }));

          setSubmitLoading(false);
        })
        .catch((err) => {
          handleResponseError(err);
        })
        .finally(() => {
          setSubmitLoading(false);
          setInEditKPIID(null);
          variableForm.resetDirty();
          variableForm.resetTouched();
          fixedForm.resetDirty();
          fixedForm.resetTouched();
          setVariableValueChange(false);
        });
    }
  };

  const handleHideChangeViewModal = () => {
    setConfirmChangeShow(false);
  };

  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="Budgets" />;
  }

  return (
    <form
      onSubmit={
        budgetType === "variable"
          ? variableForm.onSubmit((values) => handleSubmit(values))
          : fixedForm.onSubmit((values) => {
              handleSubmit(values);
            })
      }
    >
      <ConfirmSwitchBetweenViewsModal
        confirmChangeShow={confirmChangeShow}
        type={budgetType}
        item="budgets"
        handleSubmit={handleSubmit}
        form={budgetType === "fixed" ? fixedForm : variableForm}
        submitLoading={submitLoading}
        handleHideChangeViewModal={handleHideChangeViewModal}
      />

      <ConfirmChangeYearModal
        targetYear={targetYear}
        confirmYearChange={confirmYearChange}
        setConfirmYearChange={setConfirmYearChange}
        setSelectedYear={setSelectedYear}
        originalYear={originalYear}
        setOriginalYear={setOriginalYear}
        setTargetYear={setTargetYear}
      />

      <div className="budget__setting__wrapper">
        <div className="budget__settings__header">
          <span className="budgets__header__title">Budget</span>
          <span className="budgets__header__subtitle">
            Set a monthly performance budget for each KPI
          </span>
          <Divider />
          <Grid className="budgets__header__options">
            <Grid.Col span={10}>
              <ViewTabs
                view={budgetType}
                setView={setBudgetType}
                options={[
                  {
                    label: "Fixed Budgets",
                    value: "fixed",
                  },
                  {
                    label: "Variable Budgets",
                    value: "variable",
                  },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <div>
                <div className="single__dropdown__div">
                  {budgetType === "variable" && (
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
                </div>

                {fixedForm.isTouched() || variableForm.isTouched() ? (
                  <Button
                    className="save__changes__btn"
                    fullWidth
                    data-testid="save-changes-btn"
                    loading={submitLoading}
                    type="submit"
                    disabled={
                      Object.keys(fixedForm.errors).length > 0 ||
                      Object.keys(variableForm.errors).length > 0
                    }
                  >
                    <span>Save Changes</span>
                  </Button>
                ) : null}
              </div>
            </Grid.Col>
          </Grid>

          {budgetType === "fixed" && (
            <>
              {fixedDataLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                  data-testid="variable__page"
                >
                  <Loader />
                </div>
              ) : (
                fixedBudget && (
                  <BudgetsFixedView
                    form={fixedForm}
                    fixedFormValues={fixedForm.values}
                    fixedData={fixedBudget}
                  />
                )
              )}
            </>
          )}

          {budgetType === "variable" && (
            <>
              {variableDataLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                  data-testid="variable__page"
                >
                  <Loader />
                </div>
              ) : (
                variableBudget && (
                  <BudgetsVariableView
                    form={variableForm}
                    variableData={variableBudget}
                    setVariableValueChange={setVariableValueChange}
                    inEditKPIID={inEditKPIID}
                    setInEditKPIID={setInEditKPIID}
                  />
                )
              )}
            </>
          )}
        </div>
      </div>
    </form>
  );
}

export default BudgetSettings;
