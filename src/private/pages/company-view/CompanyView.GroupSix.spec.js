import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CompanyView from "./CompanyView";
import { SideMenuContext } from "../../../contexts/SideMenuContext";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { TimeFrameContext } from "../../../contexts/TimeFrameContext";
import { CompanyPreferencesApiContext } from "../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../contexts/CompanyPreferencesFilter";
import { TutorialVideosContext } from "../../../contexts/TutorialVideos";
import Router from "react-router";
import thumbnail from "../../../assets/images/Financial Statements Thumbnail.png";

const mockUsedLocation = jest.fn();
const mockUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"), // use actual for all non-hook parts
  useParams: jest.fn(),
  useLocation: () => mockUsedLocation,
  useNavigate: () => mockUsedNavigate,
  Outlet: () => <div data-testid="outlet_contnet">Outlet</div>,
}));
const mockTutorialVideoContext = {
  targetVideoKey: "financials",
  setTargetVideoKey: jest.fn(),
  setCurrentVideo: jest.fn(),
  videosList: [
    {
      key: "financials",
      videoLink:
        "https://www.youtube.com/watch?v=SDHJm5K5CVg&ab_channel=FemtoFP%26A",
      videoThumbnail: thumbnail,
      title: "financials video",
      desc: "Upload your financial data after reading the guidelines which will help you in the upload process.",
      pathKey: "financials",
    },
  ],
};
describe("Company view", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("it should be rendered.", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/" });

    render(
      <BrowserRouter>
        <SideMenuContext.Provider value={{ isOpen: true }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
              setIsTimeframeReady: jest.fn(),
              setIsAPIPreferencesReady: jest.fn(),
            }}
          >
            <TimeFrameContext.Provider value={{ fetchTimeFrame: jest.fn() }}>
              <CompanyPreferencesApiContext.Provider
                value={{ getCompanyAPIPreferences: jest.fn() }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{ getCompanyFilterPreferences: jest.fn() }}
                >
                  <TutorialVideosContext.Provider
                    value={mockTutorialVideoContext}
                  >
                    <CompanyView />
                  </TutorialVideosContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </SideMenuContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("CompanyView")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("company_content").className).toBe(
        "company_content sidemenu_open"
      );
    });
  });

  it("if the sidemenu is closed, the content should have sidemenu_close classname.", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/" });
    render(
      <BrowserRouter>
        <SideMenuContext.Provider value={{ isOpen: false }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
              setIsTimeframeReady: jest.fn(),
              setIsAPIPreferencesReady: jest.fn(),
            }}
          >
            <TimeFrameContext.Provider value={{ fetchTimeFrame: jest.fn() }}>
              <CompanyPreferencesApiContext.Provider
                value={{ getCompanyAPIPreferences: jest.fn() }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{ getCompanyFilterPreferences: jest.fn() }}
                >
                  <TutorialVideosContext.Provider
                    value={mockTutorialVideoContext}
                  >
                    <CompanyView />
                  </TutorialVideosContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </SideMenuContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("CompanyView")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("company_content").className).toBe(
        "company_content sidemenu_close"
      );
    });
  });

  it("if their is no selected company, the setIsAPIPreferencesReady method shouldn't be called.", async () => {
    const setIsAPIPreferencesReadyFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/" });
    render(
      <BrowserRouter>
        <SideMenuContext.Provider value={{ isOpen: true }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: null,
              setIsTimeframeReady: jest.fn(),
              setIsAPIPreferencesReady: setIsAPIPreferencesReadyFn,
            }}
          >
            <TimeFrameContext.Provider value={{ fetchTimeFrame: jest.fn() }}>
              <CompanyPreferencesApiContext.Provider
                value={{ getCompanyAPIPreferences: jest.fn() }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{ getCompanyFilterPreferences: jest.fn() }}
                >
                  <TutorialVideosContext.Provider
                    value={mockTutorialVideoContext}
                  >
                    <CompanyView />
                  </TutorialVideosContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </SideMenuContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("CompanyView")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(setIsAPIPreferencesReadyFn).not.toBeCalled();
    });
  });

  it("when update the selected company, the setIsAPIPreferencesReady method should be called.", async () => {
    const setIsAPIPreferencesReadyFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/" });
    render(
      <BrowserRouter>
        <SideMenuContext.Provider value={{ isOpen: true }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
              setIsTimeframeReady: jest.fn(),
              setIsAPIPreferencesReady: setIsAPIPreferencesReadyFn,
            }}
          >
            <TimeFrameContext.Provider value={{ fetchTimeFrame: jest.fn() }}>
              <CompanyPreferencesApiContext.Provider
                value={{ getCompanyAPIPreferences: jest.fn() }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{ getCompanyFilterPreferences: jest.fn() }}
                >
                  <TutorialVideosContext.Provider
                    value={mockTutorialVideoContext}
                  >
                    <CompanyView />
                  </TutorialVideosContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </SideMenuContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("CompanyView")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(setIsAPIPreferencesReadyFn).toBeCalled();
    });
  });

  it("when update the selected company, the setIsTimeframeReady method should be called.", async () => {
    const setIsTimeframeReadyFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/" });
    render(
      <BrowserRouter>
        <SideMenuContext.Provider value={{ isOpen: true }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
              setIsTimeframeReady: setIsTimeframeReadyFn,
              setIsAPIPreferencesReady: jest.fn(),
            }}
          >
            <TimeFrameContext.Provider value={{ fetchTimeFrame: jest.fn() }}>
              <CompanyPreferencesApiContext.Provider
                value={{ getCompanyAPIPreferences: jest.fn() }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{ getCompanyFilterPreferences: jest.fn() }}
                >
                  <TutorialVideosContext.Provider
                    value={mockTutorialVideoContext}
                  >
                    <CompanyView />
                  </TutorialVideosContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </SideMenuContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("CompanyView")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(setIsTimeframeReadyFn).toBeCalled();
    });
  });

  it("when update the selected company, the fetchTimeFrame method should be called.", async () => {
    const fetchTimeFrameFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/" });
    render(
      <BrowserRouter>
        <SideMenuContext.Provider value={{ isOpen: true }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
              setIsTimeframeReady: jest.fn(),
              setIsAPIPreferencesReady: jest.fn(),
            }}
          >
            <TimeFrameContext.Provider
              value={{ fetchTimeFrame: fetchTimeFrameFn }}
            >
              <CompanyPreferencesApiContext.Provider
                value={{ getCompanyAPIPreferences: jest.fn() }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{ getCompanyFilterPreferences: jest.fn() }}
                >
                  <TutorialVideosContext.Provider
                    value={mockTutorialVideoContext}
                  >
                    <CompanyView />
                  </TutorialVideosContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </SideMenuContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("CompanyView")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(fetchTimeFrameFn).toBeCalled();
    });
  });

  it("when update the selected company, the getCompanyAPIPreferences method should be called.", async () => {
    const getCompanyAPIPreferencesFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/" });
    render(
      <BrowserRouter>
        <SideMenuContext.Provider value={{ isOpen: true }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
              setIsTimeframeReady: jest.fn(),
              setIsAPIPreferencesReady: jest.fn(),
            }}
          >
            <TimeFrameContext.Provider value={{ fetchTimeFrame: jest.fn() }}>
              <CompanyPreferencesApiContext.Provider
                value={{ getCompanyAPIPreferences: getCompanyAPIPreferencesFn }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{ getCompanyFilterPreferences: jest.fn() }}
                >
                  <TutorialVideosContext.Provider
                    value={mockTutorialVideoContext}
                  >
                    <CompanyView />
                  </TutorialVideosContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </SideMenuContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("CompanyView")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(getCompanyAPIPreferencesFn).toBeCalled();
    });
  });

  it("when update the selected company, the getCompanyFilterPreferences method should be called.", async () => {
    const getCompanyFilterPreferencesFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/" });
    render(
      <BrowserRouter>
        <SideMenuContext.Provider value={{ isOpen: true }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
              setIsTimeframeReady: jest.fn(),
              setIsAPIPreferencesReady: jest.fn(),
            }}
          >
            <TimeFrameContext.Provider value={{ fetchTimeFrame: jest.fn() }}>
              <CompanyPreferencesApiContext.Provider
                value={{ getCompanyAPIPreferences: jest.fn() }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{
                    getCompanyFilterPreferences: getCompanyFilterPreferencesFn,
                  }}
                >
                  <TutorialVideosContext.Provider
                    value={mockTutorialVideoContext}
                  >
                    <CompanyView />
                  </TutorialVideosContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </SideMenuContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("CompanyView")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(getCompanyFilterPreferencesFn).toBeCalled();
    });
  });

  it("when change the selected company, the new company should be saved in localstorage", async () => {
    const getCompanyFilterPreferencesFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({ pathname: "/" });
    localStorage.setItem("selectedCompanyId", JSON.stringify({ uuid: "456" }));
    const newCompany = {
      uuid: "123",
      period_frequency: "month",
      is_enabled: true,
    };

    render(
      <BrowserRouter>
        <SideMenuContext.Provider value={{ isOpen: true }}>
          <CompaniesContext.Provider
            value={{
              selectedCompany: newCompany,
              setIsTimeframeReady: jest.fn(),
              setIsAPIPreferencesReady: jest.fn(),
            }}
          >
            <TimeFrameContext.Provider value={{ fetchTimeFrame: jest.fn() }}>
              <CompanyPreferencesApiContext.Provider
                value={{ getCompanyAPIPreferences: jest.fn() }}
              >
                <CompanyPreferencesFilterContext.Provider
                  value={{
                    getCompanyFilterPreferences: getCompanyFilterPreferencesFn,
                  }}
                >
                  <TutorialVideosContext.Provider
                    value={mockTutorialVideoContext}
                  >
                    <CompanyView />
                  </TutorialVideosContext.Provider>
                </CompanyPreferencesFilterContext.Provider>
              </CompanyPreferencesApiContext.Provider>
            </TimeFrameContext.Provider>
          </CompaniesContext.Provider>
        </SideMenuContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("CompanyView")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(getCompanyFilterPreferencesFn).toBeCalled();
    });
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("selectedCompanyId"))).toEqual(
        newCompany
      );
    });
  });
});
