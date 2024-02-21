import React from "react";
import { Grid } from "@mantine/core";
import "./style/Stepper.scss";

const Stepper = ({ step, data }) => {
  return (
    <Grid justify="center" className="stepper__div">
      <Grid.Col sm={12}>
        <div>
          <div className="stepper__wrapper">
            <div className="stepper__step">
              <div
                className={
                  step === 2
                    ? "stepper__step__number active__step"
                    : "stepper__step__number"
                }
              >
                {step === 1 ? (
                  "1"
                ) : (
                  <i className="fa-sharp fa-solid fa-check"></i>
                )}
              </div>
            </div>
            <div
              className={"stepper__line stepper__line_second__part_active"}
            ></div>
            <div
              className={
                step === 2
                  ? "stepper__line stepper__line_second__part_active"
                  : "stepper__line stepper__line_second__part_disactive "
              }
            ></div>
            <div className="stepper__step">
              <div
                className="stepper__step__number"
                style={{
                  background: step === 1 && "#F1F3F5",
                  border:
                    step === 2 ? "2px solid #086972" : "1px solid #F1F3F5",
                  color: step === 2 ? "#086972" : "#495057",
                }}
              >
                2
              </div>
            </div>
          </div>
        </div>
        <div className="stepper__legend">
          {data.length > 0 &&
            data.map((label) => {
              return <span className="stepper__legend__title">{label}</span>;
            })}
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default Stepper;
