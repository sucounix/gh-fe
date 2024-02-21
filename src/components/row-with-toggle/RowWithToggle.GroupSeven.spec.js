import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RowWithToggle from "./RowWithToggle";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("Row with toggle", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the row should render and can change the segmented control", async () => {
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <RowWithToggle
          rowName={"test_name"}
          rowIcon={null}
          editRow={{
            editTitle: "Edit KPI Entry",
            linkTo: `/company/123/analysis/kpis/edit/custom/456`,
            editTestId: "edit_kpi_button",
          }}
          disableSegmentedControl={false}
          segmentedData={[
            { label: "Hide", value: "hide" },
            { label: "Show", value: "show" },
          ]}
          segmentedTestId={`toggler__row__test_name`}
          onSegmentedChange={jest.fn()}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("KPI_row_test_name")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("edit_kpi_button")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("toggler__row__test_name")).toBeInTheDocument();
    });
    let checkboX = screen.queryAllByRole("radio");
    fireEvent.click(checkboX[0], { target: { checked: "" } });
  });
  it("if the editRow= null , can't edit the row", async () => {
    window.ResizeObserver = ResizeObserver;
    render(
      <BrowserRouter>
        <RowWithToggle
          rowName={"test_name"}
          rowIcon={null}
          disableSegmentedControl={false}
          segmentedData={[
            { label: "Hide", value: "hide" },
            { label: "Show", value: "show" },
          ]}
          segmentedTestId={`toggler__row__test_name`}
          onSegmentedChange={jest.fn()}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("KPI_row_test_name")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("edit_kpi_button")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("toggler__row__test_name")).toBeInTheDocument();
    });
    let checkboX = screen.queryAllByRole("radio");
    fireEvent.click(checkboX[0], { target: { checked: "" } });
  });
});
