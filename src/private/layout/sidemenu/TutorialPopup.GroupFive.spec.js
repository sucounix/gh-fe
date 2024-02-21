import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TutorialPopup from "./TutorialPopup";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
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

describe("Tutorial Popup", () => {
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

  it("when click on video_list_close__icon, the video__list__dropdown shouldn't be render ", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/test`,
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("video_list_target")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("video_list_target"));
    await waitFor(() => {
      expect(screen.getByTestId("video__list__dropdown")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("video_list_close__icon")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("video_list_close__icon"));
    await waitFor(() => {
      expect(mockTutorialVideoContext.setCurrentVideo).toBeCalled();
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId("video__list__dropdown")
      ).not.toBeInTheDocument();
    });
  });

  it("when select a video ,the video__list__dropdown shouldn't be render ", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/test`,
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("video_list_target")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("video_list_target"));
    await waitFor(() => {
      expect(screen.getByTestId("video__list__dropdown")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("video_0")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("video_0"));
    await waitFor(() => {
      expect(mockTutorialVideoContext.setCurrentVideo).toBeCalled();
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId("video__list__dropdown")
      ).not.toBeInTheDocument();
    });
  });

  it("the video list should be rendered ", async () => {
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("video_list_target")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("video_list_target"));
    expect(screen.getByTestId("video__list__dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("video_0")).toBeInTheDocument();
  });

  it("when click on video_list_target ,the video__list__dropdown should be render ", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/test`,
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("video_list_target")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("video_list_target"));
    expect(screen.getByTestId("video__list__dropdown")).toBeInTheDocument();
  });

  it("the video__list__dropdown shouldn't be render at the first ", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/test`,
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(
      screen.queryByTestId("video__list__dropdown")
    ).not.toBeInTheDocument();
  });

  it("if the targetVideoKey = null , the video_list_target shouldn't be render", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/financials`,
    });
    const mockTutorialVideoContextCopy = { ...mockTutorialVideoContext };
    mockTutorialVideoContextCopy.targetVideoKey = null;
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContextCopy}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.queryByTestId("video_list_target")).not.toBeInTheDocument();
  });

  it("if the path is related to organisation-settings the setTargetVideoKey method shouldn be called with null", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/test`,
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(mockTutorialVideoContext.setTargetVideoKey).toHaveBeenCalledWith(
      null
    );
  });

  it("if the path is related to analysis , the tutorial video should be rendered", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/financials`,
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("video_list_target")).toBeInTheDocument();
  });

  it("if the path is related to organisation-settings , the tutorial video should be rendered", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/organisation-settings`,
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("video_list_target")).toBeInTheDocument();
  });

  it("if the path is related to reports , the tutorial video shouldm't be rendered", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/reports/`,
    });
    let mockTutorialVideoContextCopy = { ...mockTutorialVideoContext };
    mockTutorialVideoContextCopy.targetVideoKey = null;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContextCopy}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.queryByTestId("video_list_target")).not.toBeInTheDocument();
  });

  it("if the path is related to analysis and the pathKey match the current location, the setTargetVideoKey method should be called", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/financials`,
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(mockTutorialVideoContext.setTargetVideoKey).toBeCalled();
  });

  it("if the path is related to analysis and the pathKey doesn't match the current location, the setTargetVideoKey method shouldn't be called", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/test`,
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(mockTutorialVideoContext.setTargetVideoKey).not.toBeCalled();
  });

  it("if the path is related to organisation-settings, the setTargetVideoKey method should be called with settings", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/organisation-settings`,
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(mockTutorialVideoContext.setTargetVideoKey).toHaveBeenCalledWith(
      "settings"
    );
  });

  it("if the video list contains 2 videos, the sperator should be rendered", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/test`,
    });
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("video_list_target")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("video_list_target"));
    expect(screen.getByTestId("video__list__dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("seperator")).toBeInTheDocument();
    expect(screen.getByTestId("seperator")).toHaveClass("seperator");
  });

  it("if the video list contains 1 videos, the sperator shouldn't be rendered", async () => {
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/test`,
    });
    let mockTutorialVideoContextCopy = { ...mockTutorialVideoContext };
    mockTutorialVideoContextCopy.videosList = [
      {
        key: "financials",
        videoLink:
          "https://www.youtube.com/watch?v=SDHJm5K5CVg&ab_channel=FemtoFP%26A",
        videoThumbnail: thumbnail,
        title: "financials video",
        desc: "Upload your financial data after reading the guidelines which will help you in the upload process.",
        pathKey: "financials",
      },
    ];
    render(
      <BrowserRouter>
        <CompaniesContext.Provider value={mockCompaniesContext}>
          <TutorialVideosContext.Provider value={mockTutorialVideoContextCopy}>
            <TutorialPopup isSideMenuOpen={true} />
          </TutorialVideosContext.Provider>
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("video_list_target")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("video_list_target"));
    expect(screen.getByTestId("video__list__dropdown")).toBeInTheDocument();
    expect(screen.queryByTestId("seperator")).not.toBeInTheDocument();
  });
});
