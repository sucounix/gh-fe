import React, { useContext } from "react";
import { handleCurrencySymbol } from "../../../../helpers/handleCurrency";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import RowToggleInput from "../../../../../components/row-toggle-input/RowToggleInput";

const FixedView = ({ fixedData, fixedFormValues, form }) => {
  const { selectedCompany } = useContext(CompaniesContext);

  return (
    fixedData &&
    fixedData.map((table, index) => {
      return (
        <div
          className="alerts__table"
          data-testid={`alerts__table_${index}`}
          key={`alerts_${index}`}
        >
          <div className="alerts__table__title">
            <span data-testid={`alerts_fixed_group_${index}`}>
              {table.group_name}
            </span>
          </div>
          <div className="alerts__table__content">
            {table.kpis &&
              table.kpis.map((item, tableIndex) => {
                return (
                  <>
                    <RowToggleInput
                      componentTestId={`alert_row_${index}_${tableIndex}`}
                      rowTitleTestid={`row_title_${index}_row_${tableIndex}`}
                      form={form}
                      formVariables={fixedFormValues}
                      segmentedName={`toggle_section_${index}_row_${tableIndex}`}
                      segmentedData={["OFF", "ON"]}
                      rowTitle={item.name}
                      rowCaption={
                        item.kpi_alert.sign === "lt" ? "less than" : "more than"
                      }
                      inputName={`group_${index}_row_${tableIndex}`}
                      inputTestId={`fixed__alert__input__${index}__${tableIndex}`}
                      inputDisable={
                        fixedFormValues[
                          `toggle_section_${index}_row_${tableIndex}`
                        ] === "OFF"
                      }
                      inputRightSectionIcon={
                        <span>
                          {item.type === "Monetary"
                            ? handleCurrencySymbol(selectedCompany.currency)
                            : item.type === "Percentage"
                            ? "%"
                            : ""}
                        </span>
                      }
                    />
                  </>
                );
              })}
            {fixedData.length - 1 !== index && (
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

export default FixedView;
