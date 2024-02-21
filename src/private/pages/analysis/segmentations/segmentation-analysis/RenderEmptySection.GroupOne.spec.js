import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RenderEmptySection from "./RenderEmptySection";

describe("RenderEmptySection", () => {
  const viewName = "Segmentation Analysis";
  const requirements = ["Requirement 1", "Requirement 2"];
  const renderUploadView = jest.fn();

  it("renders the component with the correct content", () => {
    render(
      <RenderEmptySection
        viewName={viewName}
        requirements={requirements}
        renderUploadView={renderUploadView}
      />
    );

    expect(screen.getByAltText("empty content")).toBeInTheDocument();
    expect(screen.getByTestId("no_entries")).toBeInTheDocument();

    requirements.forEach((requirement, index) => {
      expect(screen.getByText(requirement)).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Upload Segmentation analysis" })
    ).toBeInTheDocument();
  });

  it("calls the renderUploadView function when the upload button is clicked", () => {
    render(
      <RenderEmptySection
        viewName={viewName}
        requirements={requirements}
        renderUploadView={renderUploadView}
      />
    );

    const uploadButton = screen.getByRole("button", {
      name: "Upload Segmentation analysis",
    });
    fireEvent.click(uploadButton);

    expect(renderUploadView).toHaveBeenCalled();
  });
});
