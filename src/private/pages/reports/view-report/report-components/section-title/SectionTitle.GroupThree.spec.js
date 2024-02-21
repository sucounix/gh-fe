import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SectionTitle from "./SectionTitle";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");

describe("SectionTitle", () => {
  const section = {
    uuid: "section-uuid",
    title: "Section Title",
  };
  const sectionIndex = 0;
  const reportDetails = {
    sections: [section],
  };
  const setReportDetails = jest.fn();

  it("should render section title", () => {
    render(
      <BrowserRouter>
        <SectionTitle
          section={section}
          sectionIndex={sectionIndex}
          reportDetails={reportDetails}
          setReportDetails={setReportDetails}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("Section Title")).toBeInTheDocument();
  });

  it("should open edit section title modal when edit option is clicked", async () => {
    render(
      <BrowserRouter>
        <SectionTitle
          section={section}
          sectionIndex={sectionIndex}
          reportDetails={reportDetails}
          setReportDetails={setReportDetails}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit-section-title")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit-section-title"));

    await waitFor(() => {
      expect(screen.getByTestId("edit-btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("edit-section")).toBeInTheDocument();
    });
  });

  it("should close delete section modal when 'Cancel' button is clicked", async () => {
    render(
      <BrowserRouter>
        <SectionTitle
          section={section}
          sectionIndex={sectionIndex}
          reportDetails={reportDetails}
          setReportDetails={setReportDetails}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("edit-section-title")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit-section-title"));

    await waitFor(() => {
      expect(screen.getByTestId("edit-btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit-btn"));

    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByText("Are you sure you want to delete this section")
    ).not.toBeInTheDocument();
  });
});
