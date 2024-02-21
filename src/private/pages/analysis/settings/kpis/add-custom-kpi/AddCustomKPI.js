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
import CancelButton from "../component/buttons/CancelButton";
import SaveButton from "../component/buttons/SaveButton";
import BackButton from "../component/buttons/BackButton";
import NextButton from "../component/buttons/NextButton";

// methods
import { getActualYear } from "../getActualYear";
import "../style/CreateKPI.scss";

function AddCustomKPI() {
  const params = useParams();
  const navigate = useNavigate();

  const { timeFrameRequestData } = useContext(TimeFrameContext);
  const { selectedCompany } = useContext(CompaniesContext);
  const [step, setStep] = useState(1);
  const [kpiCategories, setKPICategories] = useState([]);
  const [listOfYears, setListOfYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [firstRender, setFirstRender] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

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
    // when change the selected company should redirect to the kpi settings list
    if (selectedCompany && !firstRender)
      navigate(`/company/${selectedCompany.uuid}/analysis/settings/kpis`);
    else {
      setFirstRender(false);
    }
  }, [selectedCompany]);
  // fetch Categories
  useEffect(() => {
    if (selectedCompany) {
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
    }
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

      switch (timeFrameRequestData.initial_value.frequency_period) {
        case "annual":
          let valuesArr = [];
          for (let i = 0; i < timeFrameRequestData.timeframe.length; i++) {
            valuesArr.push({
              actualDate: timeFrameRequestData.timeframe[i].year,
              date: timeFrameRequestData.timeframe[i].year,
              value: 0,
            });
          }
          StepTwoForm.setFieldValue(`sliderRow_${0}`, valuesArr);

          break;
        case "semi-annual":
          for (let i = 0; i < years.length; i++) {
            initialSliderRow(
              false,
              timeFrameRequestData.timeframe[i],
              "semi-annual",
              i
            );
          }
          break;
        case "quarter":
          for (let i = 0; i < years.length; i++) {
            initialSliderRow(
              false,
              timeFrameRequestData.timeframe[i],
              "quarter",
              i
            );
          }
          break;
        default: // the default is month
          for (let i = 0; i < years.length; i++) {
            initialSliderRow(
              true,
              timeFrameRequestData.timeframe[i],
              "month",
              i
            );
          }
          break;
      }
    }
  }, [timeFrameRequestData]);

  const initialSliderRow = (
    isMonthly = false,
    timeframeByYear,
    freqType,
    yearIndex
  ) => {
    // valuesArr = [{date:'Jan 2022/2023' , value:0}]
    let valuesArr = [];
    for (let j = 0; j < timeframeByYear[freqType].length; j++) {
      if (timeframeByYear[freqType][j].status === "enabled") {
        // actualDate --> for the UI render
        // date --> for the Backend
        valuesArr.push({
          actualDate: `${timeframeByYear[freqType][j].name.substring(
            0,
            3
          )} ${getActualYear(
            isMonthly,
            timeframeByYear[freqType][j].year,
            timeframeByYear[freqType][j].name.substring(0, 3),
            selectedCompany.first_month_of_financial_year
          )}`,
          date: `${timeframeByYear[freqType][j].name.substring(0, 3)} ${
            timeframeByYear[freqType][j].year
          }`,
          value: 0,
        });
      }
    }
    StepTwoForm.setFieldValue(`sliderRow_${yearIndex}`, valuesArr);
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
      .post("/analysis/kpi/custom/", data)
      .then((res) => {
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
        <h1 className="create__KPI__header__title">Create KPI</h1>
        <h2 className="create__KPI__header__subtitle">
          You can create a non financial KPI or define a new KPI by a formula.
        </h2>
      </div>
      <div className="create__KPI__body">
        <div className="create__KPI__body__wrapper">
          <div className="stepper__div__kpi">
            <Stepper step={step} data={["KPI Info", "KPI data entry"]} />
          </div>
          {step === 1 && (
            <form
              onSubmit={StepOneForm.onSubmit((values) => {
                submitFirstStep(values);
              })}
              className="form__wrapper"
            >
              <StepOne form={StepOneForm} kpiCategories={kpiCategories} />

              <div className="action__buttons">
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
                <CancelButton />
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

export default AddCustomKPI;
