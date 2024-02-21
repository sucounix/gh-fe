import React, { useContext, useEffect } from "react";
import "./style/Waterfall.scss";
import CFOCashflowWaterfall from "./views/CFOCashflowWaterfall";
import { CompanyPreferencesApiContext } from "../../../../../../contexts/CompanyPreferencesApi";
import UsesSourcesCashflowWaterfall from "./views/UsesSourcesCashflowWaterfall";
import NetFreeCashflowWaterfall from "./views/NetFreeCashflowWaterfall";

function CashFlowWaterfall({ cashflowData }) {
  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);

  return (
    <>
      {companyPreferencesApi.currentViewCashFlow?.value ===
        "Cash Flow (CFO - CFI - CFF)" && (
        <div data-testid="CFOCashflowWaterfallView">
          <CFOCashflowWaterfall data={cashflowData} />
        </div>
      )}
      {companyPreferencesApi.currentViewCashFlow?.value ===
        "Uses & Sources of Cash Flow" && (
        <div data-testid="UsesSourcesCashflowWaterfallView">
          <UsesSourcesCashflowWaterfall data={cashflowData} />
        </div>
      )}
      {companyPreferencesApi.currentViewCashFlow?.value ===
        "Net free cash flow" && (
        <div data-testid="NetFreeCashflowWaterfallView">
          <NetFreeCashflowWaterfall data={cashflowData} />
        </div>
      )}
    </>
  );
}

export default CashFlowWaterfall;
