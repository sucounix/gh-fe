/* istanbul ignore file */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { setupAxios } from "./utils/axios";
import { UserProvider } from "./contexts/UserContext";
import { TimeFrameProvider } from "./contexts/TimeFrameContext";
import { BreadcrumbsProvider } from "./contexts/BreadcrumbsContext";
import { CompanyPreferencesApiProvider } from "./contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterProvider } from "./contexts/CompanyPreferencesFilter";
import { TutorialVideosProvider } from "./contexts/TutorialVideos";
import { SideMenuProvider } from "./contexts/SideMenuContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { MantineProvider } from "@mantine/core";
import { mantineTheme } from "./MantineTheme";
import { SetupGapi } from "./utils/SetupGapi";
import { ErrorBoundry } from "./utils/ErrorBoundary";
import "./assets/fonts/css/solid.css";
import "./assets/fonts/css/regular.css";
import "./assets/fonts/css/brands.css";
import "./assets/fonts/css/fontawesome.css";
import "./style/overrides.scss";
import { Notifications } from "@mantine/notifications";
import { CompaniesProvider } from "./contexts/CompaniesContext";
import { ModalsProvider } from "@mantine/modals";
import { Amplify } from "aws-amplify";
import { getAmplifiyConfiguration } from "./aws-exports";
import { BrowserRouter } from "react-router-dom";

Amplify.configure(getAmplifiyConfiguration());
setupAxios();
SetupGapi();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ErrorBoundry>
      <TutorialVideosProvider>
        <SubscriptionProvider>
          <UserProvider>
            <SideMenuProvider>
              <CompaniesProvider>
                <CompanyPreferencesApiProvider>
                  <CompanyPreferencesFilterProvider>
                    <BreadcrumbsProvider>
                      <TimeFrameProvider>
                        <MantineProvider
                          withGlobalStyles
                          withNormalizeCSS
                          theme={mantineTheme}
                        >
                          <Notifications />
                          <ModalsProvider />
                          <App />
                        </MantineProvider>
                      </TimeFrameProvider>
                    </BreadcrumbsProvider>
                  </CompanyPreferencesFilterProvider>
                </CompanyPreferencesApiProvider>
              </CompaniesProvider>
            </SideMenuProvider>
          </UserProvider>
        </SubscriptionProvider>
      </TutorialVideosProvider>
    </ErrorBoundry>
  </BrowserRouter>
);

reportWebVitals();
