import { Divider, Menu, NumberInput } from "@mantine/core";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  handleCurrencyPrecision,
  handleCurrencySymbol,
} from "../../../../helpers/handleCurrency";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { renderUnit } from "../../../../helpers/RenderUnit";
import SliderRow from "../../../../../components/slider-row/SliderRow";
import RowEdit from "../../../../../components/row-edit/RowEdit";

function BudgetsVariableView({
  form,
  variableData,
  inEditKPIID,
  setInEditKPIID,
}) {
  const params = useParams();
  const { selectedCompany } = useContext(CompaniesContext);

  return variableData.map((table, index) => {
    return (
      <div
        className={
          variableData.length - 1 !== index && "budget__settings__table"
        }
        data-testid="variable__page"
        key={table.uuid}
      >
        <p className="settings__table__title">{table.group_name}</p>
        <Divider />
        {table.kpis &&
          table.kpis.map((row, tableIndex) => {
            return (
              <React.Fragment key={row.uuid}>
                <div className="table__variable__row">
                  {inEditKPIID !== row.uuid && (
                    <RowEdit
                      rowName={row.name}
                      editBtnTestId={`edit_budget_button_${row.name}`}
                      onEditClick={() => {
                        setInEditKPIID(row.uuid);
                      }}
                    />
                  )}
                  {inEditKPIID === row.uuid && (
                    <div>
                      <div>
                        <span
                          className="budget__variable__row__name"
                          data-testid={`budget_variable_${row.name}`}
                        >
                          {row.name}
                        </span>
                      </div>
                      <div
                        className="table__variable__row__values"
                        data-testid={`budget_inputs_${row.uuid}`}
                      >
                        <SliderRow
                          form={form}
                          formValues={
                            form.values[
                              `group_${index}_sliderRow_${tableIndex}`
                            ]
                          }
                          fieldName={`group_${index}_sliderRow_${tableIndex}`}
                          rowIndex={`${index}_${tableIndex}`}
                          adjustByAmountOption={true}
                          copyOption={true}
                          adjustByPercentageOption={true}
                          modalTestId={`adjust__modal__kpi`}
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
                    </div>
                  )}
                </div>
                <Divider />
              </React.Fragment>
            );
          })}
      </div>
    );
  });
}

export default BudgetsVariableView;
