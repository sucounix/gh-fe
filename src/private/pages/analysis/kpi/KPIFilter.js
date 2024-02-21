import React, { useContext } from "react";
import { Grid, SegmentedControl } from "@mantine/core";
import { Select, Flex } from "@mantine/core";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import SingleDropdown from "../../../../components/single-level-dropdown/SingleDropdown";

const KPIBudgetOptions = ["Show", "Hide"];

const KPIFilter = ({ numOfAlerts, isEmptyKpi }) => {
  const { companyPreferencesApi, setCompanyAPIPreferences } = useContext(
    CompanyPreferencesApiContext
  );
  const { companyPreferencesFilter } = useContext(
    CompanyPreferencesFilterContext
  );

  const views = [
    {
      label: "All KPIs",
      value: "all",
    },
    {
      label: "On track KPIs",
      value: "on_track",
    },
    {
      label: "Off track KPIs",
      value: "off_track",
    },
    {
      label: "KPIs with alerts",
      value: "alert",
    },
  ];

  return (
    companyPreferencesApi &&
    companyPreferencesFilter && (
      <Grid className="kpi__filter">
        <Grid.Col span={2}>
          <SingleDropdown
            onChange={(e) => {
              setCompanyAPIPreferences({
                ...companyPreferencesApi,
                KPIFilter: e.value,
              });
            }}
            data={views}
            value={views.find(
              (view) => view.value === companyPreferencesApi.KPIFilter
            )}
            optionLabel={"label"}
            optionValue={"value"}
          />
        </Grid.Col>
        <Grid.Col span={10}>
          <div className="toggle__col">
            <Flex align="center" justify="flex-end" className="toggle__options">
              {!isEmptyKpi && (
                <div className="alerts__div">
                  <i className="fa-solid fa-circle "></i>
                  {numOfAlerts} alerts
                </div>
              )}
              <div className="show__toggle show__hide ">
                <label style={{ marginRight: "10px" }}>Budget Column </label>
                <SegmentedControl
                  data-testid="same_period_last_year_btn"
                  onChange={(e) => {
                    setCompanyAPIPreferences({
                      ...companyPreferencesApi,
                      hideKPIBudget: e === "Hide",
                    });
                  }}
                  data={KPIBudgetOptions}
                  defaultValue={
                    companyPreferencesApi.hideKPIBudget ? "Hide" : "Show"
                  }
                  value={companyPreferencesApi.hideKPIBudget ? "Hide" : "Show"}
                />
              </div>
            </Flex>
          </div>
        </Grid.Col>
      </Grid>
    )
  );
};
export default KPIFilter;
