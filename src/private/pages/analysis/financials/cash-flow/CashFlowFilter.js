import React, { useState, useContext, useEffect } from "react";
import { Flex, Grid } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";
import { FINANCIAL_STATEMENT_VIEWS_CF } from "../../../../../constant/financialStatment";

const CashFlowFilter = ({ hideShowLastYearToggle }) => {
  const { timeFrameResult } = useContext(TimeFrameContext);

  const { companyPreferencesApi, setCompanyAPIPreferences } = useContext(
    CompanyPreferencesApiContext
  );

  const { companyPreferencesFilter, setCompanyFilterPreferences } = useContext(
    CompanyPreferencesFilterContext
  );

  const segmentedYoYOptions = ["Show", "Hide"];
  const segmentedChartOptions = [
    {
      value: "Hide",
      label: <i className="fa-solid fa-table"></i>,
    },
    {
      value: "Show",
      label: <i className="fa-solid fa-chart-bar"></i>,
    },
  ];

  const { width } = useViewportSize();

  return (
    <Grid className="cashflow__filter">
      <Grid.Col span={3}>
        <SingleDropdown
          data-testid="select-view-CF"
          onChange={(e) => {
            setCompanyAPIPreferences({
              ...companyPreferencesApi,
              currentViewCashFlow: { value: e.value, testId: e.testId },
            });
          }}
          data={FINANCIAL_STATEMENT_VIEWS_CF}
          value={FINANCIAL_STATEMENT_VIEWS_CF.find(
            (option) =>
              option.value === companyPreferencesApi.currentViewCashFlow?.value
          )}
          optionLabel={"label"}
          optionValue={"value"}
        />
      </Grid.Col>
      <Grid.Col span={9}>
        <Flex align="center" justify="flex-end" className="toggle__options">
          {timeFrameResult &&
            timeFrameResult.frequency_period !== "annual" &&
            companyPreferencesFilter &&
            !companyPreferencesFilter.viewCashFlowWaterFall && (
              <div className="show__toggle show__hide ">
                <label style={{ marginRight: "10px" }}>
                  Same period last years
                </label>
                <SegmentedControl
                  data-testid="same_period_last_year_btn"
                  name="YOY-CF"
                  size={width < 810 && "xs"}
                  onChange={(e) => {
                    setCompanyAPIPreferences({
                      ...companyPreferencesApi,
                      hideYoYCF: e === "Hide" ? true : false,
                    });
                  }}
                  data={segmentedYoYOptions}
                  defaultValue={
                    companyPreferencesApi?.hideYoYCF ? "Hide" : "Show"
                  }
                  value={companyPreferencesApi?.hideYoYCF ? "Hide" : "Show"}
                />
              </div>
            )}

          <div className="view__chart__toggle">
            <label style={{ marginRight: "10px" }}>View</label>
            <SegmentedControl
              data-testid="view_waterfall_btn"
              name="CF-waterfall"
              size={width < 810 && "xs"}
              onChange={(e) => {
                setCompanyFilterPreferences({
                  ...companyPreferencesFilter,
                  viewCashFlowWaterFall: e === "Show",
                });
              }}
              data={segmentedChartOptions}
              defaultValue={
                companyPreferencesFilter?.viewCashFlowWaterFall
                  ? "Show"
                  : "Hide"
              }
              value={
                companyPreferencesFilter?.viewCashFlowWaterFall
                  ? "Show"
                  : "Hide"
              }
            />
          </div>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default CashFlowFilter;
