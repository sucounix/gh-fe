import React, { useContext, useState } from "react";
import "./ReportCTA.scss";
import { Button } from "@mantine/core";
import SneakPeakReport from "../../components/modals/sneak-peak-report/SneakPeakReport";
import revenueAnalysisReport from "../../assets/images/reports-sneak/revenueAnalysis.png";
import breakevenReport from "../../assets/images/reports-sneak/breakeven.png";
import financialStatementsReport from "../../assets/images/reports-sneak/financialStatements.png";
import kpiReport from "../../assets/images/reports-sneak/kpi.png";
import performanceSummaryReport from "../../assets/images/reports-sneak/performanceSummary.png";
import { SubscriptionContext } from "../../contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { CompaniesContext } from "../../contexts/CompaniesContext";
import { FREE_SUBSCRIPTION_PRICING_MODEL } from "../../constant/SubscriptionPlans";

function ReportCTA({ page }) {
  const [sneakOpened, setSneakOpened] = useState(false);

  const { subscriptionInfo } = useContext(SubscriptionContext);
  const { selectedCompany } = useContext(CompaniesContext);

  const navigate = useNavigate();

  const openSneakPeak = () => {
    setSneakOpened(true);
  };

  const sneakPeakImages = {
    financials: financialStatementsReport,
    segementations: revenueAnalysisReport,
    kpi: kpiReport,
    breakeven: breakevenReport,
    trend: performanceSummaryReport,
  };

  const reportsNames = {
    financials: "Financial Statements (Write-Up)",
    segementations: "Revenue Analysis Report",
    kpi: "Key Performance Indicators Report",
    breakeven: "Company Break-even Analysis Report",
    trend: "Performance Summary Report",
  };

  const handleHideSneakPeakModal = () => {
    setSneakOpened(false);
  };
  return subscriptionInfo?.pricingModel === FREE_SUBSCRIPTION_PRICING_MODEL ? (
    <>
      {sneakOpened && (
        <div className="cta__modal__wrapper" onClick={handleHideSneakPeakModal}>
          <SneakPeakReport
            handleHideSneakPeakModal={handleHideSneakPeakModal}
            name={reportsNames[page]}
            image={sneakPeakImages[page]}
          />
        </div>
      )}
      <div className="report__cta__wrapper" data-testid="report-cta">
        <span>You can extract and download the {page} report</span>
        <div>
          <Button
            onClick={openSneakPeak}
            className="cta__button"
            variant="outline"
            size="md"
            data-testid="view-report-cta"
          >
            View Report
          </Button>
          <Button
            onClick={() => {
              navigate(`/company/${selectedCompany.uuid}/reports`);
            }}
            className="cta__button"
            size="md"
            data-testid="go-to-report-cta"
          >
            Go to Reports
          </Button>
        </div>
      </div>
    </>
  ) : null;
}
export default ReportCTA;
