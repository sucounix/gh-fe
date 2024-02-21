import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SelectTimeFrame from "../../../components/select-time-frame/SelectTimeFrame";
import { Tabs } from "@mantine/core";
import ProfitAndLoss from "./profit-and-loss/ProfitAndLoss";
import BalanceSheet from "./balance-sheet/BalanceSheet";
import CashFlow from "./cash-flow/CashFlow";
import { TimeFrameContext } from "../../../../contexts/TimeFrameContext";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import ReportCTA from "../../../../components/report-cta/ReportCTA";
import "./Financials.css";

const Financials = () => {
  const params = useParams();
  const { timeFrameResult, timeFrameRequestData, handleSelectTimeFrame } =
    useContext(TimeFrameContext);
  const { companyPreferencesFilter } = useContext(
    CompanyPreferencesFilterContext
  );
  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);

  const [financialsView, setFinancialsView] = useState(
    localStorage.getItem(`${params.companyId}_financials_view`)
      ? localStorage.getItem(`${params.companyId}_financials_view`)
      : "profit_and_loss"
  );
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);
  const { selectedCompany } = useContext(CompaniesContext);

  useEffect(() => {
    setBreadCrumbs([{ title: "Analysis" }, { title: "Financials" }]);
  }, []);

  return (
    selectedCompany && (
      <div className="financials" data-testid="financials">
        <ReportCTA page="financials" />
        <div className="finance__header">
          {timeFrameResult && timeFrameRequestData && (
            <SelectTimeFrame
              companyFrequency={localStorage.getItem(
                `${params.companyId}_companyFreq`
              )}
              timeframe={timeFrameRequestData.timeframe}
              initialValue={timeFrameResult}
              handleSelectTimeFrame={handleSelectTimeFrame}
            />
          )}
        </div>
        <Tabs
          defaultValue={financialsView}
          onTabChange={(value) => {
            setFinancialsView(value);
            localStorage.setItem(`${params.companyId}_financials_view`, value);
          }}
          data-testid="tabs"
        >
          <Tabs.List className="tabs__style">
            <Tabs.Tab
              className={
                financialsView === "profit_and_loss"
                  ? "active__tab__name"
                  : "single__tab__name"
              }
              value="profit_and_loss"
              data-testid="profit_and_loss"
            >
              Profit & loss
            </Tabs.Tab>
            <Tabs.Tab
              className={
                financialsView === "balance_sheet"
                  ? "active__tab__name"
                  : "single__tab__name"
              }
              value="balance_sheet"
              data-testid="balance_sheet"
            >
              Balance sheet
            </Tabs.Tab>
            <Tabs.Tab
              className={
                financialsView === "cash_flow"
                  ? "active__tab__name"
                  : "single__tab__name"
              }
              value="cash_flow"
              data-testid="cash_flow"
            >
              Cash flow
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="profit_and_loss" className="single__tab">
            {timeFrameResult &&
              companyPreferencesFilter &&
              companyPreferencesApi &&
              financialsView === "profit_and_loss" && (
                <div data-testid="pl__wrapper">
                  <ProfitAndLoss />
                </div>
              )}
          </Tabs.Panel>

          <Tabs.Panel value="balance_sheet" className="single__tab">
            {timeFrameResult &&
              companyPreferencesFilter &&
              companyPreferencesApi &&
              financialsView === "balance_sheet" && (
                <div data-testid="bs__wrapper">
                  <BalanceSheet />
                </div>
              )}
          </Tabs.Panel>

          <Tabs.Panel value="cash_flow" className="single__tab">
            {timeFrameResult &&
              companyPreferencesFilter &&
              companyPreferencesApi &&
              financialsView === "cash_flow" && (
                <div data-testid="cf__wrapper">
                  <CashFlow />
                </div>
              )}
          </Tabs.Panel>
        </Tabs>
      </div>
    )
  );
};

export default Financials;
