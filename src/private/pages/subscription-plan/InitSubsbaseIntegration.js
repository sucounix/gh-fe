/* istanbul ignore file */
import {
  STARTER_PLAN,
  REPORT_MONTHLY,
  REPORT_ANNUALLY,
  ASTRA_PLAN_ANNUALLY,
  ASTRA_PLAN_MONTHLY,
} from "../../../constant/SubscriptionPlans";
export const initSubsbaseIntegration = (user) => {
  (function (d, o, s, a, m) {
    a = d.createElement(o);
    m = d.getElementsByTagName(o)[0];
    a.async = 1;
    a.defer = 1;
    a.src = s;
    m.parentNode.insertBefore(a, m);
  })(document, "script", "https://embed.subsbase.com/sb.min.js");
  window.sb =
    window.sb ||
    function () {
      (window.sb.s = window.sb.s || []).push(arguments);
    };
  window.sb("siteId", process.env.REACT_APP_SUBSBASE_SITE_ID);
  window.sb("attachPlan", STARTER_PLAN, "starter-plan-btn", "id", "click");
  window.sb(
    "attachPlan",
    REPORT_MONTHLY,
    "report-plan-btn-monthly",
    "id",
    "click"
  );
  window.sb(
    "attachPlan",
    REPORT_ANNUALLY,
    "report-plan-btn-yearly",
    "id",
    "click"
  );
  window.sb(
    "attachPlan",
    ASTRA_PLAN_ANNUALLY,
    "astra-plan-btn-yearly",
    "id",
    "click"
  );
  window.sb(
    "attachPlan",
    ASTRA_PLAN_MONTHLY,
    "astra-plan-btn-monthly",
    "id",
    "click"
  );

  window.sb("queryParam", "infoFields[name]", user?.name); // by default info fields values
  window.sb("queryParam", "infoFields[email]", user?.email); // by default info fields values
  window.sb("queryParam", "disableInfoFields", false); // disable user editing info fields
  window.sb("queryParam", "customFields[userUUID]", user.cognito_uid); // Any custom fields
  window.sb("checkoutVersion", "v2");
  window.sb(
    "queryParam",
    "redirects[success]",
    process.env.REACT_APP_SUBSBASE_REDIRECT_URI
  );
};
