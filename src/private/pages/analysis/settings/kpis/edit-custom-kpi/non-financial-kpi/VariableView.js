import React, { useContext } from "react";
import { Divider } from "@mantine/core";
import SliderRow from "../../../../../../../components/slider-row/SliderRow";
import { renderUnit } from "../../../../../../helpers/RenderUnit";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";

const VariableView = ({
  form,
  listOfYears,
  selectedYear,
  kpiUnit,
  kpiName,
}) => {
  const { selectedCompany } = useContext(CompaniesContext);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
        marginTop: "1.5rem",
      }}
    >
      <Divider />
      <div className="non__fin__body">
        <span className="KPI__title">{kpiName}</span>
        <div
          className="variable__inputs__wrapper"
          data-testid="variable__inputs__wrapper"
        >
          {selectedCompany.period_frequency === "annual" && (
            <SliderRow
              form={form}
              formValues={form.values[`sliderRow_${0}`]}
              fieldName={`sliderRow_${0}`}
              rowIndex={0}
              labelKey="actualDate"
              adjustByAmountOption={true}
              copyOption={true}
              adjustByPercentageOption={true}
              AdjustByModalTestId={`adjust__modal__kpi`}
              rightSection={
                <div>
                  <small>{renderUnit(kpiUnit, selectedCompany.currency)}</small>
                </div>
              }
            />
          )}
          {selectedCompany.period_frequency !== "annual" &&
            listOfYears &&
            listOfYears.length > 0 &&
            listOfYears.map((year, yearIndex) => {
              return (
                year.label === selectedYear && (
                  <SliderRow
                    form={form}
                    formValues={form.values[`sliderRow_${yearIndex}`]}
                    fieldName={`sliderRow_${yearIndex}`}
                    rowIndex={yearIndex}
                    labelKey="actualDate"
                    adjustByAmountOption={true}
                    copyOption={true}
                    adjustByPercentageOption={true}
                    modalTestId={`adjust__modal__kpi`}
                    rightSection={
                      <div>
                        <small>
                          {renderUnit(kpiUnit, selectedCompany.currency)}
                        </small>
                      </div>
                    }
                  />
                )
              );
            })}
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default VariableView;
