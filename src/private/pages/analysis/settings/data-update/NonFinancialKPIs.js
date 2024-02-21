import React, { useContext, useEffect, useState } from "react";
import { Button, Grid } from "@mantine/core";
import { useParams, Link } from "react-router-dom";
import { useForm } from "@mantine/form";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { handleResponseError } from "../../../../../utils/errorHandling";
import { renderUnit } from "../../../../helpers/RenderUnit";
import "./style/DataUpdate.scss";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { handleCurrencyPrecision } from "../../../../helpers/handleCurrency";
import SliderRow from "../../../../../components/slider-row/SliderRow";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";

const NonFinancialKPIs = ({
  data,
  selectedYear,
  setSelectedYear,
  listOfYears,
}) => {
  const params = useParams();

  const [changeKpiLoading, setChangeKpiLoading] = useState(false);

  const { selectedCompany } = useContext(CompaniesContext);

  const form = useForm({});

  useEffect(() => {
    if (data) {
      for (let i = 0; i < data.kpis.length; i++) {
        form.setFieldValue(`sliderRow_${i}`, data.kpis[i].values);
      }
      form.resetDirty();
      form.resetTouched();
    }
  }, [data]);

  const handleSubmit = (values) => {
    setChangeKpiLoading(true);
    let data = [];
    for (let i = 0; i < Object.keys(values).length; i++) {
      for (let j = 0; j < values[`sliderRow_${i}`].length; j++) {
        data.push(values[`sliderRow_${i}`][j]);
      }
    }
    axios
      .put(`/analysis/data_update/update/kpi/${params.companyId}/`, {
        values: data,
      })
      .then(() => {
        setChangeKpiLoading(false);
        notifications?.show({
          title: "Success",
          message: "Your changes has been saved successfully",
        });
      })
      .catch((err) => {
        setChangeKpiLoading(false);
        handleResponseError(err);
      });
  };

  return (
    <>
      {selectedCompany && selectedCompany.is_kpi_ready && (
        <div className="CardData__kpi" data-testid="non_finacail_kpi">
          <p className="title1_kpi">
            Non Financial KPIs
            {data && data.kpis.length > 0 && (
              <span className="kpis__count">{`(${data.kpis.length} Non financial KPIs)`}</span>
            )}
          </p>
          <Grid>
            <Grid.Col span={2} offset={10}>
              {data && data.kpis.length > 0 && (
                <div>
                  <SingleDropdown
                    data={listOfYears.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                    value={listOfYears
                      .map((item) => ({ label: item, value: item }))
                      .find((item) => item.value === selectedYear)}
                    onChange={(e) => {
                      setSelectedYear(e.value);
                    }}
                    optionLabel={"label"}
                    optionValue={"value"}
                  />
                </div>
              )}
            </Grid.Col>
          </Grid>

          {data && data.kpis.length > 0 && (
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
              {data.kpis.map((kpi, kpiIndex) => {
                return (
                  <div>
                    <p className="kpi__name">{kpi.name}</p>

                    <SliderRow
                      form={form}
                      formValues={form.values[`sliderRow_${kpiIndex}`]}
                      fieldName={`sliderRow_${kpiIndex}`}
                      rowIndex={kpiIndex}
                      adjustByAmountOption={true}
                      copyOption={true}
                      adjustByPercentageOption={true}
                      modalTestId={`adjust__modal__kpi`}
                      labelKey="period"
                      rightSection={
                        <div>
                          {renderUnit(
                            data.kpis[kpiIndex].type,
                            selectedCompany.currency
                          )}
                        </div>
                      }
                    />
                  </div>
                );
              })}

              {form.isTouched() && (
                <div className="btn__div">
                  <Button
                    type="submit"
                    size="md"
                    loading={changeKpiLoading}
                    data-testid="save_button_fixed"
                  >
                    <span>Save changes</span>
                  </Button>
                </div>
              )}
            </form>
          )}
          {data && data.kpis.length === 0 && (
            <div className="no__data__exist">
              <p className="no__data">There are no Non-financial KPIs</p>
              <Button
                type="submit"
                size="md"
                radius={10}
                className="create__btn"
              >
                <Link
                  to={`/company/${params.companyId}/analysis/kpis/add/custom`}
                >
                  Create non financial KPI
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NonFinancialKPIs;
