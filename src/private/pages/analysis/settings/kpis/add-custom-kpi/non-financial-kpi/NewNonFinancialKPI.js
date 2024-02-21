import React, { useContext } from "react";
import { Divider, Grid } from "@mantine/core";
import FixedView from "./FixedView";
import VariableView from "./VariableView";
import "./style/NewNonFinancialKPI.css";
import ViewTabs from "../../../../../../../components/view-tabs/ViewTabs";
import SingleDropdown from "../../../../../../../components/single-level-dropdown/SingleDropdown";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";
function NewNonFinancialKPI({
  listOfYears,
  form,
  selectedYear,
  setSelectedYear,
  kpiName,
  kpiUnit,
}) {
  const { selectedCompany } = useContext(CompaniesContext);

  return (
    <div className="non__fin__wrapper">
      <Grid>
        <Grid.Col
          span={10}
          className="non__fin__settings"
          justify="space-between"
          mt={30}
        >
          <ViewTabs
            view={form.values.KPIType}
            setView={(e) => form.setFieldValue("KPIType", e)}
            options={[
              {
                label: "Fixed Values",
                value: "fixed",
              },
              {
                label: "Variable Values",
                value: "variable",
              },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          {form.values.KPIType === "variable" &&
            selectedCompany.period_frequency !== "annual" && (
              <SingleDropdown
                data={listOfYears}
                value={listOfYears.find((item) => item.value === selectedYear)}
                onChange={(e) => {
                  setSelectedYear(e.value);
                }}
                optionLabel={"label"}
                optionValue={"value"}
                field="Year"
                style={{ marginInlineEnd: "2rem" }}
              />
            )}
        </Grid.Col>
      </Grid>
      {form.values.KPIType === "fixed" && (
        <div className="fixed__values__wrapper">
          <Divider />

          <FixedView form={form} kpiUnit={kpiUnit} kpiName={kpiName} />
          <Divider />
        </div>
      )}
      {form.values.KPIType === "variable" && (
        <VariableView
          form={form}
          selectedYear={selectedYear}
          listOfYears={listOfYears}
          kpiUnit={kpiUnit}
          kpiName={kpiName}
        />
      )}
    </div>
  );
}

export default NewNonFinancialKPI;
