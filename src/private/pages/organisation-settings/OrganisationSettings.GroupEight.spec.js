import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OrganisationSettings from "./OrganisationSettings";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { SideMenuContext } from "../../../contexts/SideMenuContext";
import { TutorialVideosContext } from "../../../contexts/TutorialVideos";
import thumbnail from "../../../assets/images/Financial Statements Thumbnail.png";
import Router from "react-router";

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
const mockedUsedNavigate = jest.fn();
const mockUsedLocation = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
  useLocation: () => mockUsedLocation,
}));

describe("OrganisationSettings", () => {
  const setBreadCrumbs = jest.fn();
  const isOpen = false;

  it("renders the component", () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/organisation-settings`,
    });
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <SideMenuContext.Provider value={{ isOpen }}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <OrganisationSettings />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    expect(
      screen.getByTestId("organisation_settings_view")
    ).toBeInTheDocument();
  });

  it("sets the breadcrumbs", () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/organisation-settings`,
    });
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <SideMenuContext.Provider value={{ isOpen }}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <OrganisationSettings />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    expect(setBreadCrumbs).toHaveBeenCalledWith([
      { title: "Analysis" },
      { title: "Settings" },
    ]);
  });

  it("navigates to the company profile when the location is /organisation-settings or /organisation-settings/", () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/organisation-settings`,
    });
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <SideMenuContext.Provider value={{ isOpen }}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <OrganisationSettings />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("submenu")).toHaveTextContent("Company Profile");
  });

  it("sets the active tab based on the location", () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/organisation-settings`,
    });
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <SideMenuContext.Provider value={{ isOpen }}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <OrganisationSettings />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("submenu")).toHaveTextContent("User Profile");
  });

  it("if the current path = organisation-settings , should redirect to company-profile", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/organisation-settings`,
    });
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <SideMenuContext.Provider value={{ isOpen }}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <OrganisationSettings />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toBeCalledWith(
        `/organisation-settings/company-profile`
      );
    });
  });

  it("if the current path = /organisation-settings/ , should redirect to company-profile", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/organisation-settings/`,
    });
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <SideMenuContext.Provider value={{ isOpen }}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <OrganisationSettings />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toBeCalledWith(
        `/organisation-settings/company-profile`
      );
    });
  });
});
