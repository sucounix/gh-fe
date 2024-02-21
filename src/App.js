import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useIdle } from "@mantine/hooks";
import { IdleUser } from "./components/modals/idle-user/IdleUser";
import { UserContext } from "./contexts/UserContext";
import { TutorialVideosContext } from "./contexts/TutorialVideos";
import TutorialVideoModal from "./components/modals/tutorial-video-modal/TutorialVideoModal";
import { Suspense, lazy, useContext, useEffect } from "react";
// NotFound page
import NotFound from "./not-found/NotFound";
/* 
  Guards
*/
import RequireAuth from "./guards/RequireAuth";
import RequireNoAuth from "./guards/RequireNoAuth";
import RequireSubscription from "./guards/RequireSubscription";
/*
  Authentication
*/
import Register from "./public/pages/register";
import Login from "./public/pages/login";
import VerifyEmail from "./public/pages/verify-email/VerifyEmail";
import ResetPassword from "./public/pages/reset-password/ResetPassword";
import ForgetPassword from "./public/pages/reset-password/ForgetPassword";
/*
  Utils
*/
import Loading from "./public/components/Loading";
import AnalysisHome from "./private/pages/analysis/AnalysisHome";
// SubscriptionPlan
const SubscriptionPlan = lazy(() =>
  import("./private/pages/subscription-plan/SubscriptionPlan")
);
const SubscriptionRedirect = lazy(() =>
  import("./private/pages/subscription-plan/SubscriptionRedirect")
);
/* 
  Upload
*/
const HomePage = lazy(() => import("./private/pages/home-page/HomePage"));
const UploadExcel = lazy(() =>
  import("./private/pages/upload-excel/UploadExcel")
);
const QRedirectURL = lazy(() =>
  import("./private/pages/quickbooks/Q_redirectURL")
);
/* 
  Company
*/
const CompaniesHome = lazy(() => import("./private/pages/CompaniesHome"));
const CompanyView = lazy(() =>
  import("./private/pages/company-view/CompanyView")
);

const Forecast = lazy(() => import("./private/pages/forecast/Forecast"));

/* 
Analysis
*/
const Financials = lazy(() =>
  import("./private/pages/analysis/financials/Financials")
);
const Breakeven = lazy(() =>
  import("./private/pages/analysis/breakeven/Breakeven")
);
const Segmentations = lazy(() =>
  import("./private/pages/analysis/segmentations/Segmentations")
);
const KPI = lazy(() => import("./private/pages/analysis/kpi/KPI"));
const TrendAnalysis = lazy(() =>
  import("./private/pages/analysis/trend-analysis/TrendAnalysis")
);

// Analysis settings
const AnalysisSettings = lazy(() =>
  import("./private/pages/analysis/settings/AnalysisSettings")
);
const OutstandingShares = lazy(() =>
  import(
    "./private/pages/analysis/settings/outstanding-shares/OutstandingShares"
  )
);
const BudgetSettings = lazy(() =>
  import("./private/pages/analysis/settings/budget/BudgetSettings")
);
const KPIsSettings = lazy(() =>
  import("./private/pages/analysis/settings/kpis/KPIsSettings")
);
const ChartOfAccounts = lazy(() =>
  import("./private/pages/analysis/settings/chart-of-accounts/ChartOfAccounts")
);
const DataUpdate = lazy(() =>
  import("./private/pages/analysis/settings/data-update/DataUpdate")
);
const AddCustomKPI = lazy(() =>
  import("./private/pages/analysis/settings/kpis/add-custom-kpi/AddCustomKPI")
);
const EditCustomKPI = lazy(() =>
  import("./private/pages/analysis/settings/kpis/edit-custom-kpi/EditCustomKPI")
);

const Alerts = lazy(() =>
  import("./private/pages/analysis/settings/alerts/Alerts")
);

// OrganisationSettings
const OrganisationSettings = lazy(() =>
  import("./private/pages/organisation-settings/OrganisationSettings")
);
const CompanyProfile = lazy(() =>
  import("./private/pages/organisation-settings/compnay-profile/CompanyProfile")
);
const UserProfile = lazy(() =>
  import("./private/pages/organisation-settings/user-profile/UserProfile")
);
const SubscriptionSettings = lazy(() =>
  import(
    "./private/pages/organisation-settings/subscription-settings/SubscriptionSettings"
  )
);

const EditCompany = lazy(() =>
  import(
    "./private/pages/organisation-settings/compnay-profile/components/EditCompany"
  )
);

// Help Center
const HelpCenter = lazy(() => import("./private/pages/help-center/HelpCenter"));
const TermsAndConditions = lazy(() =>
  import("./private/pages/help-center/terms-and-services/TermsAndConditions")
);
const PrivacyPolicy = lazy(() =>
  import("./private/pages/help-center/privacy-policy/PrivacyPolicy")
);
const FAQs = lazy(() => import("./private/pages/help-center/faq/FAQ"));

//***************Reports_start**************//
const Reports = lazy(() => import("./private/pages/reports/Reports"));
const ViewReport = lazy(() =>
  import("./private/pages/reports/view-report/ViewReport")
);

//***************Reports_end**************//

function App() {
  const idle = useIdle(600000, { initialState: false });
  const { user, logoutUser } = useContext(UserContext);
  const { currentVideo, clearCurrentVideo } = useContext(TutorialVideosContext);

  useEffect(() => {
    if (idle && user) {
      clearCurrentVideo();
      logoutUser();
    }
  }, [idle]);

  return (
    <Suspense fallback={<Loading />}>
      {idle && user && <IdleUser />}
      {currentVideo && <TutorialVideoModal />}

      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/subscription" element={<SubscriptionPlan />} />
          <Route
            path="/subscription/callback"
            element={<SubscriptionRedirect />}
          />
          <Route element={<RequireSubscription />}>
            <Route path="/" element={<CompaniesHome />}>
              <Route path="" element={<HomePage />} />
              <Route path="upload">
                <Route path="excel" element={<UploadExcel />} />
              </Route>

              <Route path="company/:companyId" element={<CompanyView />}>
                <Route path="analysis" element={<AnalysisHome />}>
                  <Route path="" element={<Financials />} />
                  <Route path="financials" element={<Financials />} />
                  <Route
                    path="segmentation-analysis"
                    element={<Segmentations />}
                  />
                  <Route path="breakeven" element={<Breakeven />} />
                  <Route path="kpi" element={<KPI />} />
                  <Route path="trend-analysis" element={<TrendAnalysis />} />
                  <Route path="settings" element={<AnalysisSettings />}>
                    <Route
                      path="outstanding-shares"
                      element={<OutstandingShares />}
                    />
                    <Route path="budgets" element={<BudgetSettings />} />
                    <Route path="kpis" element={<KPIsSettings />} />
                    <Route
                      path="chart-of-accounts"
                      element={<ChartOfAccounts />}
                    />
                    <Route path="data-update" element={<DataUpdate />} />
                    <Route path="alerts" element={<Alerts />} />
                  </Route>
                  <Route path="kpis/add/custom" element={<AddCustomKPI />} />
                  <Route
                    path="kpis/edit/custom/:kpiId"
                    element={<EditCustomKPI />}
                  />
                </Route>
                <Route path="forecast">
                  <Route path="" element={<Forecast />} />
                </Route>
                <Route path="reports">
                  <Route path="" element={<Reports />} />
                  <Route path=":reportId" element={<ViewReport />} />
                </Route>
              </Route>

              <Route
                path="organisation-settings"
                element={<OrganisationSettings />}
              >
                <Route path="company-profile" element={<CompanyProfile />} />
                <Route path="company-profile/edit" element={<EditCompany />} />
                <Route path="user-profile" element={<UserProfile />} />
                <Route
                  path="subscription-settings"
                  element={<SubscriptionSettings />}
                />
              </Route>
              <Route path="help-center" element={<HelpCenter />}>
                <Route
                  path="terms-and-conditions"
                  element={<TermsAndConditions />}
                />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="faq" element={<FAQs />} />
              </Route>
            </Route>

            <Route path="/quickbooks/callback" element={<QRedirectURL />} />
          </Route>
        </Route>

        <Route element={<RequireNoAuth />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/verify-email/:verifyCode/:user_name/:email"
            element={<VerifyEmail />}
          />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route
            path="/reset-password/:verifyCode/:user_id"
            element={<ResetPassword />}
          />
        </Route>

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
