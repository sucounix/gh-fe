import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { Divider, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useParams } from "react-router-dom";
import { handleResponseError } from "../../../../../utils/errorHandling";
import { notifications } from "@mantine/notifications";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import OutstandingConfirmChange from "../../../../../components/modals/outstanding-confirm-change/OutstandingConfirmChange";
import ViewTabs from "../../../../../components/view-tabs/ViewTabs";
import OSharesVariableView from "./OSharesVariableView";
import OSharesFixedView from "./OSharesFixedView";
import "./style/OutstandingShares.scss";

function OutstandingShares() {
  const params = useParams();

  const [typeSelected, setTypeSelected] = useState(null);
  const [timeframe, setTimeframe] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [variableValid, setVariableValid] = useState(true);
  const [callAPILoading, setCallAPILoading] = useState(false);
  const [isOSharesTimeframeReady, setIsOSharesTimeframeReady] = useState(false);

  const {
    companies,
    setCompanies,
    selectedCompany,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    if (isSelectedCompanyReady) {
      setIsOSharesTimeframeReady(false);

      axios
        .get(`analysis/shares/timeframe/${selectedCompany?.uuid}`)
        .then((res) => {
          const yearsArray = [];
          for (let i = 0; i < res.data.timeframe.length; i++) {
            yearsArray.push({
              label: res.data.timeframe[i],
              value: res.data.timeframe[i],
            });
          }
          setTimeframe(yearsArray);
          setSelectedYear(res.data.timeframe.at(-1));

          setTypeSelected(selectedCompany?.outstanding_shares);
          setIsOSharesTimeframeReady(true);
        })
        .catch((e) => {
          handleResponseError(e);
        });
    }
  }, [selectedCompany?.uuid, isSelectedCompanyReady]);

  useEffect(() => {
    if (typeSelected && isOSharesTimeframeReady && isSelectedCompanyReady) {
      setLoading(true);
      axios
        .get(`/analysis/shares/${selectedCompany?.uuid}`, {
          params: {
            type: typeSelected,
            year:
              typeSelected === "fixed"
                ? null
                : selectedYear
                ? selectedYear
                : timeframe.at(-1),
          },
        })
        .then((res) => {
          if (typeSelected === "fixed") {
            fixedForm.setFieldValue("fixedValue", {
              value: res.data.value ? res.data.value : 1,
            });
            fixedForm.isDirty();
            fixedForm.resetTouched();
          }

          if (typeSelected === "variable") {
            const mappedValues = res.data.values.map((item) => {
              return {
                ...item,
                value: item.value ? item.value : 1,
              };
            });

            variableForm.setFieldValue(
              "sliderRow_0",
              mappedValues && mappedValues
            );
            variableForm.resetDirty();
            variableForm.resetTouched();
          }

          setLoading(false);
        })
        .catch((e) => {
          handleResponseError(e);
          setLoading(false);
        });
    }
  }, [
    selectedCompany?.uuid,
    typeSelected,
    selectedYear,
    isOSharesTimeframeReady,
    isSelectedCompanyReady,
  ]);

  const variableForm = useForm({
    validate: {
      sliderRow_0: {
        value: (value) => {
          if (value === null || value === undefined || value === "") {
            setVariableValid(false);
            return "Please enter a value";
          }
          if (value <= 0) {
            setVariableValid(false);
            return "Value must be greater than 0";
          }
          setVariableValid(true);
          return null;
        },
      },
    },
  });

  const fixedForm = useForm({
    validate: (values) => {
      const errors = {};
      if (values.fixedValue.value === "") {
        errors.fixedValue = "Please enter a value";
      }
      return errors;
    },
  });

  const handleSubmit = () => {
    const currentCompany = companies.find(
      (item) => item.uuid === params.companyId
    );
    const currentOutstandingShares = currentCompany?.outstanding_shares;

    if (currentOutstandingShares !== typeSelected) {
      setShowConfirmModal(true);
    } else {
      callAPI();
    }
  };

  const callAPI = () => {
    let reqBody = {};
    if (typeSelected === "fixed") {
      reqBody = {
        type: typeSelected,
        value: fixedForm.values.fixedValue.value,
      };
    } else {
      reqBody = {
        type: typeSelected,
        values: variableForm.values.sliderRow_0.map((item) => {
          return {
            uuid: item.uuid,
            value: item.value,
          };
        }),
      };
    }
    setCallAPILoading(true);
    axios
      .put(`/analysis/shares/${params.companyId}/`, reqBody)
      .then(() => {
        notifications.show({
          title: "Success",
          message: "Shares updated successfully",
        });
        updateCompany();
        setCallAPILoading(false);
      })
      .catch((e) => {
        handleResponseError(e);
        setCallAPILoading(false);
      });
  };

  const updateCompany = () => {
    let updatedCompanies = companies.map((item) => {
      if (item.uuid === params.companyId) {
        return {
          ...item,
          outstanding_shares: typeSelected,
        };
      }
      return item;
    });

    setCompanies(updatedCompanies);
  };

  const handleHideChangeModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <OutstandingConfirmChange
        showConfirmModal={showConfirmModal}
        handleHideChangeModal={handleHideChangeModal}
        callAPI={callAPI}
        callAPILoading={callAPILoading}
        typeSelected={typeSelected}
      />

      {loading && (
        <div
          data-testid="loading"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 50,
          }}
        >
          <Loader />
        </div>
      )}

      {!loading && (
        <div className="outstanding__wrapper" data-testid="form__content">
          <div className="outstanding__header" data-testid="page__content">
            <span className="outstanding__title">Outstanding Shares</span>
            <span className="outstanding__subheader">
              Set the number of shares for the company
            </span>
            <Divider />
            <div className="header__content__wrapper">
              <ViewTabs
                view={typeSelected}
                setView={setTypeSelected}
                options={[
                  { label: "Fixed Shares", value: "fixed" },
                  { label: "Variable Shares", value: "variable" },
                ]}
              />
            </div>
            <div>
              {typeSelected === "fixed" && (
                <form
                  onSubmit={fixedForm.onSubmit((values) =>
                    handleSubmit(values)
                  )}
                >
                  <OSharesFixedView
                    fixedForm={fixedForm}
                    callAPILoading={callAPILoading}
                  />
                </form>
              )}
              {typeSelected === "variable" && timeframe && (
                <form
                  onSubmit={variableForm.onSubmit((values) =>
                    handleSubmit(values)
                  )}
                >
                  <OSharesVariableView
                    variableForm={variableForm}
                    timeframe={timeframe}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    callAPILoading={callAPILoading}
                    variableValid={variableValid}
                  />
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OutstandingShares;
