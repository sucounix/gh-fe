import React, { useEffect, useContext, useState } from "react";
import { useForm } from "@mantine/form";
import NewNonFinancialKPI from "./non-financial-kpi/NewNonFinancialKPI";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { handleResponseError } from "../../../../../../utils/errorHandling";
import FinancialKPI from "./financial-kpi/FinancialKPI";
import Stepper from "../../../../../../components/stepper/Stepper";
import StepOne from "./StepOne";
import { TimeFrameContext } from "../../../../../../contexts/TimeFrameContext";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";
// buttons
import DeleteButton from "../component/buttons/DeleteButton";
import NextButton from "../component/buttons/NextButton";
import SaveButton from "../component/buttons/SaveButton";
import BackButton from "../component/buttons/BackButton";
import CancelButton from "../component/buttons/CancelButton";

// methods
import { getActualYear } from "../getActualYear";
import { Flex, Loader } from "@mantine/core";
import "../style/CreateKPI.scss";

function EditCustomKPI() {
  const params = useParams();
  const navigate = useNavigate();

  const [loadingPage, setLoadingPage] = useState(true);
  const [step, setStep] = useState(1);
  const [kpiCategories, setKPICategories] = useState([]);
  const [kpiId, setKPIId] = useState(null);
  const [listOfYears, setListOfYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [firstRender, setFirstRender] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { timeFrameRequestData } = useContext(TimeFrameContext);
  const { selectedCompany } = useContext(CompaniesContext);

  const StepOneForm = useForm({
    initialValues: {
      name: "",
      description: "",
      type: "",
      group: "",
      definition: "",
      reference: "Non-financial",
      aggregation: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.name || values.name.trim().length === 0) {
        errors.name = "KPI name is required";
      }

      if (!values.type) {
        errors.type = "KPI unit of measurement is required";
      }

      if (!values.group) {
        errors.group = "KPI Category is required";
      }

      if (!values.definition) {
        errors.definition = "KPI definition is required";
      }

      if (!values.aggregation) {
        errors.aggregation = "KPI aggregation is required";
      }

      return errors;
    },
  });

  const StepTwoForm = useForm({
    initialValues: {
      varibaleValues: [],
      fixedValue: 0,
      formula: [],
      KPIType: "fixed", //fixed or varibale
    },
  });

  useEffect(() => {
    if (params.kpiId) {
      getKpi(params.kpiId);
      setKPIId(params.kpiId);
    } else {
      setLoadingPage(false);
    }
  }, []);

  // fetch Categories
  useEffect(() => {
    axios
      .get(`/analysis/kpi/groups/${selectedCompany.uuid}`)
      .then((res) => {
        setKPICategories(
          res.data.map((category) => ({
            label: category.group_name,
            value: category.uuid,
          }))
        );
      })
      .catch((e) => {
        handleResponseError(e);
      });
  }, []);

  useEffect(() => {
    if (timeFrameRequestData) {
      let years = [
        ...new Set(timeFrameRequestData.timeframe.map((val) => val.year)),
      ];
      setListOfYears(
        years.map((year) => {
          return {
            label: year,
            value: year,
          };
        })
      );
      setSelectedYear(years.at(-1));
    }
  }, [timeFrameRequestData]);

  useEffect(() => {
    // when change the selected company should redirect to the kpi settings list
    if (selectedCompany && !firstRender)
      navigate(`/company/${selectedCompany.uuid}/analysis/settings/kpis`);
    else {
      setFirstRender(false);
    }
  }, [selectedCompany]);

  const getKpi = (id) => {
    axios
      .get(`/analysis/kpi/custom/${id}/`)
      .then((res) => {
        initializeFirstStepForm(res.data);

        if (res.data.reference === "Financial") {
          StepTwoForm.setFieldValue(
            "formula",
            res.data.formula ? res.data.formula : []
          );
        }

        if (res.data.reference === "Non-financial") {
          StepTwoForm.setFieldValue("KPIType", res.data.values_type);

          if (res.data.value) {
            StepTwoForm.setFieldValue(`fixedValue`, res.data.value);
          }
          if (res.data.values) {
            if (selectedCompany.period_frequency === "annual") {
              initialSliderRowAnnual(res.data.values);
            } else {
              for (let i = 0; i < res.data.values.length; i++) {
                initialSliderRow(res.data.values[i], i);
              }
            }
          }
        }
        setLoadingPage(false);
      })
      .catch((e) => {
        setLoadingPage(false);
      });
  };
  const initialSliderRowAnnual = (values) => {
    // valuesArr = [{date:'Jan 2022/2023' , value:0}]
    let valuesArr = [];
    for (let i = 0; i < values.length; i++) {
      valuesArr.push({
        actualDate: values[i].periods[0].date,
        date: values[i].periods[0].date,
        value: values[i].periods[0].value,
      });
    }
    StepTwoForm.setFieldValue(`sliderRow_${0}`, valuesArr);
  };

  const initialSliderRow = (singleRow, rowIndex) => {
    // valuesArr = [{date:'Jan 2022/2023' , value:0}]
    let valuesArr = [];
    for (let i = 0; i < singleRow.periods.length; i++) {
      valuesArr.push({
        actualDate:
          selectedCompany.period_frequency === "month"
            ? `${singleRow.periods[i].date.split(" ")[0]} ${getActualYear(
                true,
                singleRow.periods[i].date.split(" ")[1],
                singleRow.periods[i].date.split(" ")[0],
                selectedCompany.first_month_of_financial_year
              )}`
            : singleRow.periods[i].date,
        date: singleRow.periods[i].date,
        value: singleRow.periods[i].value,
      });
    }
    StepTwoForm.setFieldValue(`sliderRow_${rowIndex}`, valuesArr);
  };

  const initializeFirstStepForm = (data) => {
    StepOneForm.setFieldValue("name", data.name);
    StepOneForm.setFieldValue("description", data.description);
    StepOneForm.setFieldValue("group", data.group);
    StepOneForm.setFieldValue("aggregation", data.aggregation);
    StepOneForm.setFieldValue("reference", data.reference);
    StepOneForm.setFieldValue("definition", data.definition);
    StepOneForm.setFieldValue("type", data.type);
  };

  const submitFirstStep = () => {
    if (StepOneForm.validate().hasErrors) return;
    setStep(2);
  };

  const submitSecondStep = (values) => {
    if (StepTwoForm.validate().hasErrors) return;
    setSubmitLoading(true);
    let data = { ...StepOneForm.values };
    if (StepOneForm.values.reference === "Non-financial") {
      data.values_type = values.KPIType;

      if (values.KPIType === "fixed") {
        data.values_value = values.fixedValue;
      } else if (values.KPIType === "variable") {
        let valuesArr = [];
        if (selectedCompany.period_frequency === "annual") {
          valuesArr = valuesArr.concat(values[`sliderRow_${0}`]);
          data.values_values = valuesArr;
        } else {
          for (let i = 0; i < listOfYears.length; i++) {
            valuesArr = valuesArr.concat(values[`sliderRow_${i}`]);
            data.values_values = valuesArr;
          }
        }
      }
    } else {
      data.formula = values.formula;
    }
    axios
      .patch(`/analysis/kpi/custom/${kpiId}/`, data)
      .then(() => {
        setSubmitLoading(false);
        navigate(`/company/${params.companyId}/analysis/settings/kpis/`);
      })
      .catch((e) => {
        const containsAll = Object.keys(e.response.data).map((element) => {
          return Object.keys(StepOneForm.values).includes(element);
        });
        if (containsAll.includes(true)) {
          setStep(1);
          handleResponseError(e, StepOneForm);
        }
        setSubmitLoading(false);
      });
  };

  return (
    <div className="create__kpi__wrapper">
      <div className="create__KPI__header">
        <h1 className="create__KPI__header__title">Edit KPI</h1>
        <h2 className="create__KPI__header__subtitle">
          You can Edit a non financial KPI or define a new KPI by a formula.
        </h2>
      </div>
      <div className="create__KPI__body">
        <div className="create__KPI__body__wrapper">
          <div className="stepper__div__kpi">
            <Stepper step={step} data={["KPI Info", "KPI data entry"]} />
          </div>
          {loadingPage && (
            <Flex align={"center"} justify={"center"}>
              <Loader />
            </Flex>
          )}
          {!loadingPage && step === 1 && (
            <form
              onSubmit={StepOneForm.onSubmit((values) =>
                submitFirstStep(values)
              )}
              className="form__wrapper"
              data-testid="step-one-form"
            >
              <StepOne
                StepOneForm={StepOneForm}
                kpiCategories={kpiCategories}
              />
              <div className="action__buttons">
                <DeleteButton kpiId={kpiId} />
                <CancelButton />
                <NextButton />
              </div>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={StepTwoForm.onSubmit((values) =>
                submitSecondStep(values)
              )}
              className="form__wrapper"
            >
              {StepOneForm.values.reference === "Non-financial" && (
                <NewNonFinancialKPI
                  form={StepTwoForm}
                  listOfYears={listOfYears}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  kpiName={StepOneForm.values.name}
                  kpiUnit={StepOneForm.values.type}
                />
              )}

              {StepOneForm.values.reference === "Financial" && (
                <FinancialKPI form={StepTwoForm} />
              )}

              <div className="action__buttons">
                <DeleteButton kpiId={kpiId} />
                <BackButton setStep={setStep} />
                <SaveButton submitLoading={submitLoading} />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditCustomKPI;
