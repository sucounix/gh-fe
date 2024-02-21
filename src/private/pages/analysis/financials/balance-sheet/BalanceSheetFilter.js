import React, { useContext } from "react";
import { Flex, Grid } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import ViewTabs from "../../../../../components/view-tabs/ViewTabs";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";
import { FINANCIAL_STATEMENT_VIEWS } from "../../../../../constant/financialStatment.js";

const BalanceSheetFilter = () => {
  const { timeFrameResult } = useContext(TimeFrameContext);
  const { companyPreferencesFilter, setCompanyFilterPreferences } = useContext(
    CompanyPreferencesFilterContext
  );

  const { companyPreferencesApi, setCompanyAPIPreferences } = useContext(
    CompanyPreferencesApiContext
  );

  const segmentedYoYOptions = ["Show", "Hide"];

  const viewCurrentOptions = [
    {
      label: "Current → Non Current",
      value: true,
    },
    {
      label: "Non Current → Current",
      value: false,
    },
  ];

  return (
    <Grid className="BS__filter__div ">
      <Grid.Col xs={2.4}>
        <div>
          {companyPreferencesFilter && (
            <SingleDropdown
              onChange={(e) => {
                setCompanyFilterPreferences({
                  ...companyPreferencesFilter,
                  viewCurrentFirstBS: e.value,
                });
              }}
              data={viewCurrentOptions}
              value={viewCurrentOptions.find(
                (option) =>
                  option.value === companyPreferencesFilter.viewCurrentFirstBS
              )}
              optionLabel={"label"}
              optionValue={"value"}
              data-testid="select-view-BS"
            />
          )}
        </div>
      </Grid.Col>
      <Grid.Col xs={2.4}>
        {companyPreferencesFilter && (
          <SingleDropdown
            onChange={(e) => {
              setCompanyAPIPreferences({
                ...companyPreferencesApi,
                viewBS: { value: e.value, testId: e.testId },
              });
            }}
            data={FINANCIAL_STATEMENT_VIEWS}
            value={FINANCIAL_STATEMENT_VIEWS.find(
              (option) => option.value === companyPreferencesApi.viewBS?.value
            )}
            optionLabel={"label"}
            optionValue={"value"}
            data-testid="select-view-type-BS"
          />
        )}
      </Grid.Col>
      <Grid.Col xs={4}>
        <Flex align="center" justify="flex-start">
          <ViewTabs
            view={companyPreferencesFilter.viewEquityPlusLiabilitiesBS}
            smallText={true}
            setView={(e) => {
              setCompanyFilterPreferences({
                ...companyPreferencesFilter,
                viewEquityPlusLiabilitiesBS: e,
              });
            }}
            options={[
              {
                label: "Assets = Equity + Liabilities",
                value: true,
              },
              {
                label: "Assets = Liabilities + Equity",
                value: false,
              },
            ]}
          />
        </Flex>
      </Grid.Col>
      <Grid.Col xs={3.2}>
        <Flex align="center" justify="flex-end">
          {timeFrameResult &&
            timeFrameResult.frequency_period !== "annual" &&
            companyPreferencesFilter && (
              <div className="show__toggle show__hide ">
                <label className="toggle__label">Same period last years</label>
                <SegmentedControl
                  name="show last period"
                  data-testid="same_period_last_year_btn_BS"
                  onChange={(e) => {
                    setCompanyAPIPreferences({
                      ...companyPreferencesApi,
                      hideYoYBS: e === "Hide",
                    });
                  }}
                  data={segmentedYoYOptions}
                  defaultValue={
                    companyPreferencesApi.hideYoYBS ? "Hide" : "Show"
                  }
                  value={companyPreferencesApi.hideYoYBS ? "Hide" : "Show"}
                />
              </div>
            )}
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default BalanceSheetFilter;
