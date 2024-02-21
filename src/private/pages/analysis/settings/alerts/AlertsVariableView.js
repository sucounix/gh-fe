import React, { useContext } from "react";
import { SegmentedControl } from "@mantine/core";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import SliderRow from "../../../../../components/slider-row/SliderRow";
import { renderUnit } from "../../../../helpers/RenderUnit";

const VariableView = ({ form, variableData, setVariableValueChange }) => {
  const { selectedCompany } = useContext(CompaniesContext);

  return (
    variableData &&
    variableData.map((table, index) => {
      return (
        <div
          className="alerts__table"
          key={`table_${index}`}
          data-testid={`alerts__table_${index}`}
        >
          <div className="alerts__table__title">
            <span data-testid={`group_${index}`}>{table.group_name}</span>
          </div>
          <div className="alerts__table__content">
            {table.kpis &&
              table.kpis.map((item, tableIndex) => {
                return (
                  <div
                    className="alerts__row__border"
                    data-testid={`alert_row_${index}_${tableIndex}`}
                    key={tableIndex}
                  >
                    <div className="alerts__table__row">
                      <div className="alerts__row__content">
                        <SegmentedControl
                          data={["OFF", "ON"]}
                          onChange={(e) => {
                            setVariableValueChange(true);
                          }}
                          {...form.getInputProps(
                            `toggle_section_${index}_row_${tableIndex}`
                          )}
                          data-testid={`toggle_section_${index}_row_${tableIndex}`}
                        />
                        <span
                          className="alerts__row__title"
                          style={
                            form.values[
                              `toggle_section_${index}_row_${tableIndex}`
                            ] === "ON"
                              ? { opacity: 1 }
                              : { opacity: 0.5 }
                          }
                          data-testid={`row_title_${index}_row_${tableIndex}`}
                        >
                          {item.name} is{" "}
                          {item.kpi_alert.sign === "lt"
                            ? "less than"
                            : "more than"}
                        </span>
                      </div>
                    </div>

                    <SliderRow
                      form={form}
                      formValues={
                        form.values[`group_${index}_sliderRow_${tableIndex}`]
                      }
                      fieldName={`group_${index}_sliderRow_${tableIndex}`}
                      rowIndex={tableIndex}
                      adjustByAmountOption={true}
                      copyOption={true}
                      adjustByPercentageOption={true}
                      modalTestId={`adjust__modal__kpi`}
                      disabled={
                        form.values[
                          `toggle_section_${index}_row_${tableIndex}`
                        ] === "OFF"
                      }
                      rightSection={
                        <div>
                          <small>
                            {renderUnit(
                              table.kpis[tableIndex].type,
                              selectedCompany.currency
                            )}
                          </small>
                        </div>
                      }
                    />
                  </div>
                );
              })}

            {variableData.length - 1 !== index && (
              <div
                className="alerts__row__divider"
                data-testid={`alerts__row__divider_${index}`}
              ></div>
            )}
          </div>
        </div>
      );
    })
  );
};
export default VariableView;
