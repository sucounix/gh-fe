import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import Router from "react-router";
import HelpCenter from "./HelpCenter";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { TutorialVideosContext } from "../../../contexts/TutorialVideos";
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
describe("Help Center", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("it should be rendered.", async () => {
    const setBreadCrumbsFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest
      .spyOn(Router, "useLocation")
      .mockReturnValue({ pathname: "/help-center" });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ setBreadCrumbs: setBreadCrumbsFn }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
            }}
          >
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <HelpCenter />
            </TutorialVideosContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("help_center")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(setBreadCrumbsFn).toBeCalled();
    });
  });

  it("if the current path = `/help-center` ,it should navigate to `/help-center/faq`.", async () => {
    const setBreadCrumbsFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest
      .spyOn(Router, "useLocation")
      .mockReturnValue({ pathname: "/help-center" });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ setBreadCrumbs: setBreadCrumbsFn }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
            }}
          >
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <HelpCenter />
            </TutorialVideosContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("help_center")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mockUsedNavigate).toBeCalledWith("/help-center/faq");
    });
  });

  it("if the current path = `/help-center/` ,it should navigate to `/help-center/faq`.", async () => {
    const setBreadCrumbsFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest
      .spyOn(Router, "useLocation")
      .mockReturnValue({ pathname: "/help-center/" });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ setBreadCrumbs: setBreadCrumbsFn }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
            }}
          >
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <HelpCenter />
            </TutorialVideosContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("help_center")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mockUsedNavigate).toBeCalledWith("/help-center/faq");
    });
  });

  it("if the current path include faq, the faq tab should be active.", async () => {
    const setBreadCrumbsFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest
      .spyOn(Router, "useLocation")
      .mockReturnValue({ pathname: "/help-center/faq" });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ setBreadCrumbs: setBreadCrumbsFn }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
            }}
          >
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <HelpCenter />
            </TutorialVideosContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("help_center")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_1").className).toBe(
        "single__tab__active"
      );
    });
  });

  it("if the current path include terms-and-conditions, the terms and conditions tab should be active.", async () => {
    const setBreadCrumbsFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest
      .spyOn(Router, "useLocation")
      .mockReturnValue({ pathname: "/help-center/terms-and-conditions" });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ setBreadCrumbs: setBreadCrumbsFn }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
            }}
          >
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <HelpCenter />
            </TutorialVideosContext.Provider>
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("help_center")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_2").className).toBe(
        "single__tab__active"
      );
    });
  });

  it("if the current path include privacy-policy, the privacy policy tab should be active.", async () => {
    const setBreadCrumbsFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest
      .spyOn(Router, "useLocation")
      .mockReturnValue({ pathname: "/help-center/privacy-policy" });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ setBreadCrumbs: setBreadCrumbsFn }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
            }}
          >
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <HelpCenter />
            </TutorialVideosContext.Provider>{" "}
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("help_center")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_3").className).toBe(
        "single__tab__active"
      );
    });
  });

  it("the outlet should be rendered.", async () => {
    const setBreadCrumbsFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest
      .spyOn(Router, "useLocation")
      .mockReturnValue({ pathname: "/help-center/privacy-policy" });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ setBreadCrumbs: setBreadCrumbsFn }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
            }}
          >
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <HelpCenter />
            </TutorialVideosContext.Provider>{" "}
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("outlet_contnet")).toBeInTheDocument();
    });
  });

  it("when click on submenu, the new item should be active", async () => {
    const setBreadCrumbsFn = jest.fn();
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest
      .spyOn(Router, "useLocation")
      .mockReturnValue({ pathname: "/help-center/privacy-policy" });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ setBreadCrumbs: setBreadCrumbsFn }}
        >
          <CompaniesContext.Provider
            value={{
              selectedCompany: {
                uuid: "123",
              },
            }}
          >
            <TutorialVideosContext.Provider value={mockTutorialVideoContext}>
              <HelpCenter />
            </TutorialVideosContext.Provider>{" "}
          </CompaniesContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("help_center")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_3").className).toBe(
        "single__tab__active"
      );
    });

    fireEvent.click(screen.getByTestId("submenu_link_1"));

    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_1").className).toBe(
        "single__tab__active"
      );
    });
  });
});
