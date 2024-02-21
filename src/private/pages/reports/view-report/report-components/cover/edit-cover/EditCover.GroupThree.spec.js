import React from "react";
import {
  getByTestId,
  getByText,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import EditCover from "./EditCover";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";

jest.mock("axios");

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
describe("View Report details", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
  });
  const setCoverDate = jest.fn();
  const setShowOverlayLoader = jest.fn();
  const drawerHandlers = {
    close: jest.fn(),
    open: jest.fn(),
  };
  const showOverlayLoader = false;

  //   Background Section
  it("when choose the fill option , the color picker should appear", async () => {
    const data = {
      show_logo: false,
      logo: null,
      report_title: "report price change analysis",
      company_name: "ABC Monthly 1",
      period: "Jan 2019/2020",
      background_color: "#fff",
      fore_color: "#f01111",
      section_body:
        "<h3>In this report, we present the monthly performance analysis for [Company Name].</h3><h3>This report includes:</h3><ol><li>Pricing Analysis</li><li>Price Volume Mix Analysis</li></ol>",
    };
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              logo: null,
              currency: "EGP",
            },
          }}
        >
          <EditCover
            data={data}
            drawerHandlers={drawerHandlers}
            showOverlayLoader={showOverlayLoader}
            setCoverDate={setCoverDate}
            setShowOverlayLoader={setShowOverlayLoader}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("fill")).not.toBeChecked();
    fireEvent.click(screen.getByTestId("fill"));
    expect(screen.getByTestId("fill")).toBeChecked();
    await waitFor(() => {
      expect(screen.getByTestId("color_picker")).toBeInTheDocument();
    });
  });

  it("If the background color is white the no-fill option should be selected by default", async () => {
    const data = {
      show_logo: false,
      logo: null,
      report_title: "report price change analysis",
      company_name: "ABC Monthly 1",
      period: "Jan 2019/2020",
      background_color: "#fff",
      fore_color: "#f01111",
      section_body:
        "<h3>In this report, we present the monthly performance analysis for [Company Name].</h3><h3>This report includes:</h3><ol><li>Pricing Analysis</li><li>Price Volume Mix Analysis</li></ol>",
    };
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              logo: null,
            },
          }}
        >
          <EditCover
            data={data}
            drawerHandlers={drawerHandlers}
            showOverlayLoader={showOverlayLoader}
            setCoverDate={setCoverDate}
            setShowOverlayLoader={setShowOverlayLoader}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("no_fill")).toBeChecked();
  });

  it("when select a color , the request should send with the new value", async () => {
    const data = {
      uuid: 123,
      logo: null,
      show_logo: false,
      report_title: "report price change analysis",
      company_name: "ABC Monthly 1",
      period: "Jan 2019/2020",
      background_color: "#fff",
      fore_color: "#f01111",
      section_body:
        "<h3>In this report, we present the monthly performance analysis for [Company Name].</h3><h3>This report includes:</h3><ol><li>Pricing Analysis</li><li>Price Volume Mix Analysis</li></ol>",
    };
    AxiosMock.put.mockResolvedValueOnce({
      data: data,
    });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              logo: null,
              currency: "EGP",
            },
          }}
        >
          <EditCover
            data={data}
            drawerHandlers={drawerHandlers}
            showOverlayLoader={showOverlayLoader}
            setCoverDate={setCoverDate}
            setShowOverlayLoader={setShowOverlayLoader}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("fill")).not.toBeChecked();
    fireEvent.click(screen.getByTestId("fill"));
    expect(screen.getByTestId("fill")).toBeChecked();
    await waitFor(() => {
      expect(screen.getByTestId("color_picker")).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId("color_picker"), {
      target: { value: "#09c" },
    });
    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(`/report/cover/${data.uuid}`, {
        background_color: "#09c",
        show_logo: false,
        report_title: "report price change analysis",
        fore_color: "#f01111",
      });
    });
  });

  //   Logo Section

  it("If the company hasn't a logo , the upload link should appear ", async () => {
    const data = {
      uuid: 123,
      logo: null,
      show_logo: false,
      report_title: "report price change analysis",
      company_name: "ABC Monthly 1",
      period: "Jan 2019/2020",
      background_color: "#fff",
      fore_color: "#f01111",
      section_body:
        "<h3>In this report, we present the monthly performance analysis for [Company Name].</h3><h3>This report includes:</h3><ol><li>Pricing Analysis</li><li>Price Volume Mix Analysis</li></ol>",
    };
    AxiosMock.put.mockResolvedValueOnce({
      data: data,
    });
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              logo: null,
              currency: "EGP",
            },
          }}
        >
          <EditCover
            data={data}
            drawerHandlers={drawerHandlers}
            showOverlayLoader={showOverlayLoader}
            setCoverDate={setCoverDate}
            setShowOverlayLoader={setShowOverlayLoader}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("go_to_company_profile")).toBeInTheDocument();
    });
  });

  it("If the company has a logo, the toggle should appear", async () => {
    const data = {
      uuid: 123,
      show_logo: false,
      logo: "https://dev7b783/companies/Trade%20Corp%20LLC%20waterfall3/Trade_Corp_LLC__5Bdf5sr.png",
      report_title: "report price change analysis",
      company_name: "ABC Monthly 1",
      period: "Jan 2019/2020",
      background_color: "#fff",
      fore_color: "#f01111",
      section_body:
        "<h3>In this report, we present the monthly performance analysis for [Company Name].</h3><h3>This report includes:</h3><ol><li>Pricing Analysis</li><li>Price Volume Mix Analysis</li></ol>",
    };

    AxiosMock.put.mockResolvedValueOnce({
      data: { ...data, logo: null },
    });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              currency: "EGP",
              logo: "https://dev7b783/companies/Trade%20Corp%20LLC%20waterfall3/Trade_Corp_LLC__5Bdf5sr.png",
            },
          }}
        >
          <EditCover
            data={data}
            drawerHandlers={drawerHandlers}
            showOverlayLoader={showOverlayLoader}
            setCoverDate={setCoverDate}
            setShowOverlayLoader={setShowOverlayLoader}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("show_hide_logo_toggle")).toBeInTheDocument();
    });
  });

  it("when change the show/hide logo toggle , the new value should send in the request", async () => {
    const data = {
      uuid: 123,
      show_logo: true,
      logo: "https://dev7b783/companies/Trade%20Corp%20LLC%20waterfall3/Trade_Corp_LLC__5Bdf5sr.png",
      report_title: "report price change analysis",
      company_name: "ABC Monthly 1",
      period: "Jan 2019/2020",
      background_color: "#fff",
      fore_color: "#f01111",
      section_body:
        "<h3>In this report, we present the monthly performance analysis for [Company Name].</h3><h3>This report includes:</h3><ol><li>Pricing Analysis</li><li>Price Volume Mix Analysis</li></ol>",
    };

    AxiosMock.put.mockResolvedValueOnce({
      data: { ...data, show_logo: false },
    });

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              logo: "https://dev7b783/companies/Trade%20Corp%20LLC%20waterfall3/Trade_Corp_LLC__5Bdf5sr.png",
            },
          }}
        >
          <EditCover
            data={data}
            drawerHandlers={drawerHandlers}
            showOverlayLoader={showOverlayLoader}
            setCoverDate={setCoverDate}
            setShowOverlayLoader={setShowOverlayLoader}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("show_hide_logo_toggle")).toBeInTheDocument();
    });
    let radioBtnShow = "";
    let radioBtnHide = "";
    await waitFor(() => {
      radioBtnShow = screen.getByLabelText("Show");
      radioBtnHide = screen.getByLabelText("Hide");
    });

    await waitFor(() => {
      expect(radioBtnShow.checked).toEqual(true);
    });
    await waitFor(() => {
      expect(radioBtnHide.checked).toEqual(false);
    });
    fireEvent.click(radioBtnHide);
    await waitFor(() => {
      expect(radioBtnShow.checked).toEqual(false);
    });
    await waitFor(() => {
      expect(radioBtnHide.checked).toEqual(true);
    });
    fireEvent.click(screen.getByTestId("save_btn"));

    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(`/report/cover/${data.uuid}`, {
        background_color: "#fff",
        show_logo: false,
        report_title: "report price change analysis",
        fore_color: "#f01111",
      });
    });
  });

  //  Title Section
  it("when change title and it's color , the request should send with the new value", async () => {
    const data = {
      uuid: 123,
      logo: null,
      show_logo: false,
      report_title: "report price change analysis",
      company_name: "ABC Monthly 1",
      period: "Jan 2019/2020",
      background_color: "#fff",
      fore_color: "#f01111",
      section_body:
        "<h3>In this report, we present the monthly performance analysis for [Company Name].</h3><h3>This report includes:</h3><ol><li>Pricing Analysis</li><li>Price Volume Mix Analysis</li></ol>",
    };
    AxiosMock.put.mockResolvedValueOnce({
      data: { ...data, report_title: "test report edit", fore_color: "#09c" },
    });
    window.ResizeObserver = ResizeObserver;

    render(
      <BrowserRouter>
        <CompaniesContext.Provider
          value={{
            selectedCompany: {
              uuid: "123",
              logo: null,
              currency: "EGP",
            },
          }}
        >
          <EditCover
            data={data}
            drawerHandlers={drawerHandlers}
            showOverlayLoader={showOverlayLoader}
            setCoverDate={setCoverDate}
            setShowOverlayLoader={setShowOverlayLoader}
          />
        </CompaniesContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("report_title")).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId("report_title"), {
      target: { value: "test report edit" },
    });
    await waitFor(() => {
      expect(screen.getByTestId("font_color_picker")).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId("font_color_picker"), {
      target: { value: "#09c" },
    });
    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledWith(`/report/cover/${data.uuid}`, {
        background_color: "#fff",
        show_logo: false,
        report_title: "test report edit",
        fore_color: "#09c",
      });
    });
  });
});
