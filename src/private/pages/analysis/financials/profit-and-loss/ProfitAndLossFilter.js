import React, { useContext } from "react";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import ViewTabs from "../../../../../components/view-tabs/ViewTabs";
import { Flex, Grid, SegmentedControl } from "@mantine/core";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";
import { FINANCIAL_STATEMENT_VIEWS } from "../../../../../constant/financialStatment.js";

const ProfitAndLossFilter = () => {
  const segmentedOptions = ["Show", "Hide"];

  const { timeFrameResult } = useContext(TimeFrameContext);

  const { companyPreferencesApi, setCompanyAPIPreferences } = useContext(
    CompanyPreferencesApiContext
  );

  return (
    <Grid className="pl__header">
      <Grid.Col span={9}>
        <Grid>
          <Grid.Col span={3}>
            <SingleDropdown
              data-testid="select-view-pl"
              onChange={(e) => {
                setCompanyAPIPreferences({
                  ...companyPreferencesApi,
                  viewPL: { value: e.value, testId: e.testId },
                });
              }}
              data={FINANCIAL_STATEMENT_VIEWS}
              value={FINANCIAL_STATEMENT_VIEWS.find(
                (option) => option.value === companyPreferencesApi.viewPL?.value
              )}
              optionLabel={"label"}
              optionValue={"value"}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <ViewTabs
              view={companyPreferencesApi.isStandardPL ? "Standard" : "EBITDA"}
              setView={(e) => {
                setCompanyAPIPreferences(
                  e === "Standard"
                    ? { ...companyPreferencesApi, isStandardPL: true }
                    : { ...companyPreferencesApi, isStandardPL: false }
                );
              }}
              options={[
                {
                  label: "Standard",
                  value: "Standard",
                },
                {
                  label: "EBITDA",
                  value: "EBITDA",
                },
              ]}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={3}>
        <Flex align="center" justify="flex-end">
          {timeFrameResult.frequency_period !== "annual" && (
            <>
              <span>Same period last years</span>
              <SegmentedControl
                data-testid="show-YoY"
                name="show-YOY"
                onChange={(e) => {
                  setCompanyAPIPreferences(
                    e === "Show"
                      ? { ...companyPreferencesApi, hideYoYPL: false }
                      : { ...companyPreferencesApi, hideYoYPL: true }
                  );
                }}
                data={segmentedOptions}
                defaultValue={companyPreferencesApi.hideYoYPL ? "Hide" : "Show"}
                value={companyPreferencesApi.hideYoYPL ? "Hide" : "Show"}
              />
            </>
          )}
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default ProfitAndLossFilter;
