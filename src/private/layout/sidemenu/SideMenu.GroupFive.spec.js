import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SideMenu from "./SideMenu";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { SideMenuContext } from "../../../contexts/SideMenuContext";
import { TutorialVideosContext } from "../../../contexts/TutorialVideos";
import thumbnail from "../../../assets/images/Financial Statements Thumbnail.png";
import Router from "react-router";

const mockUsedLocation = jest.fn();
const mockUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"), // use actual for all non-hook parts
  useLocation: () => mockUsedLocation,
  useNavigate: () => mockUsedNavigate,
  useParams: jest.fn(),
}));

describe("SideMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/`,
    });
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const mockCompaniesContext = {
    selectedCompany: {
      uuid: "123",
      name: "Company 1",
    },
  };

  const mockSideMenuContext = {
    isOpen: true,
    setIsOpen: jest.fn(),
  };
  const mockSideMenuContextWithFalse = {
    isOpen: false,
    setIsOpen: jest.fn(),
  };

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
      {
        key: "KPI",
        videoLink:
          "https://www.youtube.com/watch?v=SDHJm5K5CVg&ab_channel=FemtoFP%26A",
        videoThumbnail: thumbnail,
        title: "KPI video",
        desc: "Upload your financial data after reading the guidelines which will help you in the upload process.",
        pathKey: "KPI",
      },
    ],
  };

  it("renders the side menu with the correct class", () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <SideMenuContext.Provider value={mockSideMenuContext}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <SideMenu />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    const sideMenuWrapper = screen.getByTestId("side-menu-wrapper");
    expect(sideMenuWrapper).toHaveClass("sidemenu__wrapper open_wrapper");
  });

  it("toggles the menu when the arrow is clicked", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <SideMenuContext.Provider value={mockSideMenuContext}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <SideMenu />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    const arrowToggle = screen.getByTestId("arrow-toggle");
    fireEvent.click(arrowToggle);
    await waitFor(() => {
      expect(mockSideMenuContext.setIsOpen).toHaveBeenCalledWith(false);
    });

    fireEvent.click(arrowToggle);
    const sideMenuWrapper = screen.getByTestId("side-menu-wrapper");

    await waitFor(() => {
      expect(sideMenuWrapper).toHaveClass("sidemenu__wrapper open_wrapper");
    });
  });

  it("renders the menu is closed with default close", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <SideMenuContext.Provider value={mockSideMenuContextWithFalse}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <SideMenu />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("sidemenu__web__closed")).toBeInTheDocument();
  });

  it("if the side menu item is avilable , the mockUsedNavigate shouldn't be called", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <SideMenuContext.Provider value={mockSideMenuContext}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <SideMenu />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("arrow-toggle")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("arrow-toggle"));
    expect(screen.getByTestId("sidemenu__web__opened")).toBeInTheDocument();
    expect(screen.getByTestId("sidemenu_item_2")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("sidemenu_item_2"));
    expect(mockUsedNavigate).toBeCalled();
  });

  it("if the side menu item is not avilable , the mockUsedNavigate should be called", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <SideMenuContext.Provider value={mockSideMenuContext}>
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <SideMenu />
            </TutorialVideosContext.Provider>
          </SideMenuContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("arrow-toggle")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("arrow-toggle"));
    expect(screen.getByTestId("sidemenu__web__opened")).toBeInTheDocument();
    expect(screen.getByTestId("sidemenu_item_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("sidemenu_item_0"));
    expect(mockUsedNavigate).not.toBeCalled();
  });
});
