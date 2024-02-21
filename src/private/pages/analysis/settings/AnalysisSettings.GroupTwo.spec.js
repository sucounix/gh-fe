import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { BreadcrumbsContext } from "../../../../contexts/BreadcrumbsContext";
import AnalysisSettings from "./AnalysisSettings";
import Router from "react-router";

const mockUsedLocation = jest.fn();
const mockUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"), // use actual for all non-hook parts
  useLocation: () => mockUsedLocation,
  useNavigate: () => mockUsedNavigate,
  useParams: jest.fn(),
}));

describe("AnalysisSettings", () => {
  const setBreadCrumbs = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render AnalysisSettings component", () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/`,
    });
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <AnalysisSettings />
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("Analysis Settings")).toBeInTheDocument();
    expect(screen.getByText("Data Update")).toBeInTheDocument();
    expect(screen.getByText("Outstanding Shares")).toBeInTheDocument();
    expect(screen.getByText("Chart of accounts")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("KPI's")).toBeInTheDocument();
    expect(mockUsedNavigate).toBeCalled();
    expect(screen.getByTestId("submenu_link_1").className).toBe(
      "single__tab__active"
    );
  });

  it("if the path is data-update then DataUpdateTab should be selected ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/data-update`,
    });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <AnalysisSettings />
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_1").className).toBe(
        "single__tab__active"
      );
    });
    expect(screen.getByText("Outstanding Shares")).not.toHaveClass(
      "single__tab__active"
    );
    expect(screen.getByText("Chart of accounts")).not.toHaveClass(
      "single__tab__active"
    );
    expect(screen.getByText("Alerts")).not.toHaveClass("single__tab__active");
    expect(screen.getByText("Budget")).not.toHaveClass("single__tab__active");
    expect(screen.getByText("KPI's")).not.toHaveClass("single__tab__active");
  });

  it("if the path is outstanding-shares then outstanding-shares tab should be selected ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/outstanding-shares`,
    });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <AnalysisSettings />
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_2").className).toBe(
        "single__tab__active"
      );
    });
  });

  it("if the path is chart-of-accounts then chart-of-accounts tab should be selected ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/chart-of-accounts`,
    });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <AnalysisSettings />
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_3").className).toBe(
        "single__tab__active"
      );
    });
  });

  it("if the path is alerts then alerts tab should be selected ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/alerts`,
    });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <AnalysisSettings />
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_4").className).toBe(
        "single__tab__active"
      );
    });
  });

  it("if the path is budgets then budgets tab should be selected ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/budgets`,
    });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <AnalysisSettings />
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_5").className).toBe(
        "single__tab__active"
      );
    });
  });

  it("if the path is kpis then kpis tab should be selected ", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/kpis`,
    });

    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <AnalysisSettings />
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_6").className).toBe(
        "single__tab__active"
      );
    });
  });

  it("should set breadcrumbs", () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/`,
    });
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <AnalysisSettings />
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    expect(setBreadCrumbs).toHaveBeenCalledWith([
      { title: "Analysis" },
      { title: "Settings" },
    ]);
  });

  it("should fetch company list and navigate to data-update tab on mount", () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ companyId: "123" });
    jest.spyOn(Router, "useLocation").mockReturnValue({
      pathname: `/company/123/analysis/settings/`,
    });
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs }}>
          <AnalysisSettings />
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("Data Update")).toHaveAttribute(
      "href",
      "/data-update"
    );
  });
});
