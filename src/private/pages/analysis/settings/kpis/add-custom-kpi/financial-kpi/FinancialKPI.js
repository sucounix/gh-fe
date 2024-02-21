import axios from "axios";
import React, { useEffect, useState } from "react";
import { handleResponseError } from "../../../../../../../utils/errorHandling";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import FormulaVariables from "./FormulaVariables";
import FormulaButtons from "./FormulaButtons";

function FinancialKPI({ form }) {
  const params = useParams();

  const [errorInFormula, setErrorInFormula] = useState(false);
  const [originalDynamicValues, setOriginalDynamicValues] = useState([]);
  const [dynamicValues, setDynamicValues] = useState([]);
  const [selectedAddType, setSelectedAddType] = useState("current");
  const [searchFilter, setSearchFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios
      .get(`/analysis/kpi/categories/${params.companyId}`)
      .then((res) => {
        setOriginalDynamicValues(res.data);
      })
      .catch((e) => {
        handleResponseError(e);
      });
  }, []);

  useEffect(() => {
    let filteredValues = [];

    if (searchFilter === "all") {
      let spreadValues = [];
      originalDynamicValues.forEach((item) => {
        spreadValues = [...spreadValues, ...item.values];
      });
      filteredValues = spreadValues;
    } else {
      filteredValues = originalDynamicValues.filter(
        (item) => item.label === searchFilter
      )[0]?.values;
    }

    setDynamicValues(filteredValues);
  }, [originalDynamicValues, searchFilter]);

  useEffect(() => {
    setErrorInFormula(false);

    if (form?.values?.formula.length > 0) {
      let lastItem = form.values.formula[form?.values?.formula.length - 1];

      if (lastItem.type === "operator" && lastItem.value !== ")") {
        setErrorInFormula(true);
      } else {
        setErrorInFormula(false);
      }
    } else {
      setErrorInFormula(false);
    }

    let leftBrackets = 0;
    let rightBrackets = 0;

    form?.values?.formula.forEach((item, index) => {
      if (item.value === "(") {
        leftBrackets++;
      } else if (item.value === ")") {
        rightBrackets++;
      }

      if (item.type === "operator" && item.value === ")") {
        if (index === 0) {
          setErrorInFormula(true);
        } else if (form?.values?.formula[index - 1].value === "(") {
          setErrorInFormula(true);
        } else if (
          form.values.formula[index - 1].type === "operator" &&
          form.values.formula[index - 1].value !== ")"
        ) {
          setErrorInFormula(true);
        }
      }

      if (item.type === "operator" && item.value === "X") {
        if (index === 0) {
          setErrorInFormula(true);
        } else if (index === form?.values?.formula.length - 1) {
          setErrorInFormula(true);
        } else if (form?.values?.formula[index - 1].value === "(") {
          setErrorInFormula(true);
        } else if (form?.values?.formula[index + 1].value === ")") {
          setErrorInFormula(true);
        } else if (
          form.values.formula[index - 1].type === "operator" &&
          form.values.formula[index - 1].value !== ")"
        ) {
          setErrorInFormula(true);
        } else if (
          form.values.formula[index + 1].type === "operator" &&
          form.values.formula[index + 1].value !== "("
        ) {
          setErrorInFormula(true);
        }
      }

      if (item.type === "operator" && item.value === "-") {
        if (index !== 0) {
          if (
            form.values.formula[index - 1].value === "-" ||
            form.values.formula[index - 1].value === "+" ||
            form.values.formula[index - 1].value === "X" ||
            form.values.formula[index - 1].value === "/"
          ) {
            setErrorInFormula(true);
          }
        }
      }

      if (item.type === "operator" && item.value === "+") {
        if (index === 0) {
          setErrorInFormula(true);
        } else if (
          form.values.formula[index - 1].value === "-" ||
          form.values.formula[index - 1].value === "+" ||
          form.values.formula[index - 1].value === "X" ||
          form.values.formula[index - 1].value === "/"
        ) {
          setErrorInFormula(true);
        }
      }

      if (item.type === "operator" && item.value === "/") {
        if (index === 0) {
          setErrorInFormula(true);
        } else if (
          form.values.formula[index - 1].value === "-" ||
          form.values.formula[index - 1].value === "+" ||
          form.values.formula[index - 1].value === "X" ||
          form.values.formula[index - 1].value === "/"
        ) {
          setErrorInFormula(true);
        }
      }

      if (item.type === "operator" && item.value === "(") {
        if (index !== 0) {
          if (
            form.values.formula[index - 1].type === "dynamic_value" ||
            form.values.formula[index - 1].value === ")"
          ) {
            setErrorInFormula(true);
          }
        }
      }
    });

    if (leftBrackets !== rightBrackets) {
      setErrorInFormula(true);
    }
  }, [form]);

  const addOperator = (value) => {
    let newFormula = form?.values?.formula;

    if (newFormula.length === 0) {
      newFormula.push({ type: "operator", value: value });
      form.setFieldValue("formula", newFormula);
    } else {
      if (
        newFormula[newFormula.length - 1].type === "dynamic_value" &&
        value === "."
      ) {
        newFormula.push({ type: "operator", value: "X" });
        newFormula.push({ type: "number", value: "0" });
        newFormula.push({ type: "operator", value: "." });
      } else if (
        newFormula[newFormula.length - 1].value !== "(" ||
        newFormula[newFormula.length - 1].value !== ")"
      ) {
        newFormula.push({ type: "operator", value: value });
      } else if (newFormula[newFormula.length - 1].type === "operator") {
        newFormula[newFormula.length - 1].value = value;
      } else {
        newFormula.push({ type: "operator", value: value });
      }
      form.setFieldValue("formula", newFormula);
    }
  };

  const addNumber = (value) => {
    let newFormula = form?.values?.formula;
    if (newFormula.length === 0) {
      newFormula.push({ type: "number", value: value });
    } else {
      if (newFormula[newFormula.length - 1].type === "number") {
        newFormula[newFormula.length - 1].value = 0
          ? (newFormula[newFormula.length - 1].value = value)
          : (newFormula[newFormula.length - 1].value = `${
              newFormula[newFormula.length - 1].value
            }${value}`);
      } else if (newFormula[newFormula.length - 1].type === "dynamic_value") {
        newFormula.push({ type: "operator", value: "X" });
        newFormula.push({ type: "number", value: value });
      } else {
        newFormula.push({ type: "number", value: value });
      }
    }
    form.setFieldValue("formula", newFormula);
  };

  const addVariable = (value) => {
    const currentStatus = selectedAddType === "current" ? true : false;
    let newFormula = form?.values?.formula;

    if (newFormula.length === 0) {
      newFormula.push({
        type: "dynamic_value",
        ...value,
        current: currentStatus,
      });
    } else {
      if (
        ["dynamic_value", "number"].includes(
          newFormula[newFormula.length - 1].type
        )
      ) {
        newFormula.push({
          type: "operator",
          value: "X",
        });
        newFormula.push({
          type: "dynamic_value",
          ...value,
          current: currentStatus,
        });
      } else {
        newFormula.push({
          type: "dynamic_value",
          ...value,
          current: currentStatus,
        });
      }
    }
    form.setFieldValue("formula", newFormula);
  };

  return (
    <div className="page__wrapper">
      <div className="financial__kpi__wrapper">
        <div className="formula__display">
          <div className="formula__content" data-testid="formula__wrapper">
            {form?.values?.formula.map((item, index) => {
              if (item.type === "operator") {
                return (
                  <div key={index} className="formula__operator">
                    <div className="formula__operator__content">
                      {item.value}
                    </div>
                  </div>
                );
              } else if (item.type === "dynamic_value") {
                return (
                  <div key={index} className="formula__dynamic__value">
                    <div className="formula__dynamic__value__content">
                      <div className="formula__dynamic__value__label">
                        {item.label}
                      </div>
                      <div className="formula__dynamic__value__current">
                        {item.current ? "Current" : "Previous"}
                      </div>
                    </div>
                  </div>
                );
              } else if (item.type === "number") {
                return (
                  <div key={index} className="formula__number">
                    <div className="formula__number__content">{item.value}</div>
                  </div>
                );
              }
            })}
          </div>
          <FormulaButtons
            form={form}
            addNumber={addNumber}
            addOperator={addOperator}
          />
        </div>

        {errorInFormula && (
          <motion.span
            style={{
              margin: 10,
              display: "flex",
              gap: 10,
              color: "#ff6700",
            }}
          >
            <i className="fas fa-info-circle"></i>
            There is an error with the formula
          </motion.span>
        )}

        <FormulaVariables
          setSearchText={setSearchText}
          dynamicValues={dynamicValues}
          setSearchFilter={setSearchFilter}
          setSelectedAddType={setSelectedAddType}
          searchText={searchText}
          addVariable={addVariable}
        />
      </div>
    </div>
  );
}

export default FinancialKPI;
