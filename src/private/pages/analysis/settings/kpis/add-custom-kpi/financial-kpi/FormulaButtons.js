import { Button } from "@mantine/core";
import React from "react";

function FormulaButtons({ addNumber, addOperator, form, setErrorInFormula }) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const operators = ["+", "-", "X", "/", ".", "(", ")"];

  return (
    <div className="formula__buttons">
      <div className="formula__buttons__row">
        {numbers.map((number) => {
          return (
            <div
              data-testid={`number__${number}`}
              onClick={() => {
                addNumber(number);
              }}
              key={number}
              className="formula__button"
              style={{
                width: "10%",
              }}
            >
              {number}
            </div>
          );
        })}
      </div>
      <div className="formula__buttons__row">
        {operators.map((operator) => {
          return (
            <div
              data-testid={`operator__${operator}`}
              key={operator}
              onClick={() => {
                addOperator(operator);
              }}
              className="formula__button"
            >
              {operator}
            </div>
          );
        })}
      </div>
      <div className="formula__buttons__row__last">
        <Button
          fullWidth
          variant="outline"
          className="formula__action__button"
          onClick={() => {
            form.setFieldValue("formula", []);

            setErrorInFormula(false);
          }}
        >
          Clear
        </Button>
        <Button
          data-testid="backspace__button"
          onClick={() => {
            form.setFieldValue("formula", form.values.formula.slice(0, -1));
          }}
          fullWidth
          className="formula__action__button"
        >
          <i
            className="fas fa-backspace"
            style={{ marginInline: "0.5rem" }}
          ></i>
          Backspace
        </Button>
      </div>
    </div>
  );
}

export default FormulaButtons;
