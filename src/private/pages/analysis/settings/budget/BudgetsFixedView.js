import { Divider } from "@mantine/core";
import React, { useContext } from "react";
import { handleCurrencySymbol } from "../../../../helpers/handleCurrency";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import RowInput from "../../../../../components/row-input/RowInput";

function BudgetsFixedView({ fixedData, fixedFormValues, form }) {
  const { selectedCompany } = useContext(CompaniesContext);

  return fixedData.map((table, index) => {
    return (
      <div
        className={fixedData.length - 1 !== index && "budget__settings__table"}
        style={{
          marginTop: "2.5rem",
        }}
        key={table.uuid}
      >
        <p className="settings__table__title">{table.group_name}</p>
        <Divider />

        {table.kpis &&
          table.kpis.map((row, rowIndex) => {
            return (
              <React.Fragment key={row.uuid}>
                <div className="table__fixed__row">
                  <RowInput
                    rowInputTestId={`fixed-budget-group-${index}-input-${rowIndex}`}
                    testId={"fixed-budget-row"}
                    rowName={row.name}
                    form={form}
                    inputValue={
                      fixedFormValues[`group_${index}_row_${rowIndex}`].value
                    }
                    inputName={`group_${index}_row_${rowIndex}`}
                    rightSectionIcon={
                      <span className="settings__table__row__input__currency">
                        {row.type === "Monetary"
                          ? handleCurrencySymbol(selectedCompany.currency)
                          : row.type === "Percentage"
                          ? "%"
                          : ""}
                      </span>
                    }
                  />
                </div>
                <Divider />
              </React.Fragment>
            );
          })}
      </div>
    );
  });
}

export default BudgetsFixedView;
