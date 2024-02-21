import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DropdownTwoColumns from "./DropdownTwoColumns";

describe("Dropdown Two Columns", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when click on the label component , the popup div should appear.", async () => {
    const handleNewClassifySelectedFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownTwoColumns
          classificationLoading={false}
          labelComponent={"test label"}
          data={[
            {
              items: [{ name: "Recurring Revenues", code: "RREV" }],
              name: "Revenues",
            },
          ]}
          handleNewClassifySelected={handleNewClassifySelectedFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("label__component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label__component"));
    await waitFor(() => {
      expect(screen.getByTestId("popup__div")).toBeInTheDocument();
    });
  });

  it("loader should appear if the classificationLoading = true.", async () => {
    const handleNewClassifySelectedFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownTwoColumns
          classificationLoading={true}
          labelComponent={"test label"}
          data={[
            {
              items: [{ name: "Recurring Revenues", code: "RREV" }],
              name: "Revenues",
            },
          ]}
          handleNewClassifySelected={handleNewClassifySelectedFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("label__component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label__component"));
    await waitFor(() => {
      expect(screen.getByTestId("popup__div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("loader_dropdown_two_columns")
      ).toBeInTheDocument();
    });
  });

  it("loader should appear if the their is no data.", async () => {
    const handleNewClassifySelectedFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownTwoColumns
          classificationLoading={false}
          labelComponent={"test label"}
          data={null}
          handleNewClassifySelected={handleNewClassifySelectedFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("label__component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label__component"));
    await waitFor(() => {
      expect(screen.getByTestId("popup__div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("loader_dropdown_two_columns")
      ).toBeInTheDocument();
    });
  });

  it("the first column data and the second column data should appear.", async () => {
    const handleNewClassifySelectedFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownTwoColumns
          classificationLoading={false}
          labelComponent={"test label"}
          data={[
            {
              items: [{ name: "Recurring Revenues", code: "RREV" }],
              name: "Revenues",
            },
          ]}
          handleNewClassifySelected={handleNewClassifySelectedFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("label__component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label__component"));
    await waitFor(() => {
      expect(screen.getByTestId("popup__div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("first_column_0")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("second_column_0")).toBeInTheDocument();
    });
  });

  it("when select new item from the first column, the second column should be updated.", async () => {
    const handleNewClassifySelectedFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownTwoColumns
          classificationLoading={false}
          labelComponent={"test label"}
          data={[
            {
              items: [{ name: "Recurring Revenues", code: "RREV" }],
              name: "Revenues",
            },
            {
              items: [
                {
                  code: "VCOST",
                  name: "Variable Costs",
                },
              ],
              name: "cost of sales",
            },
          ]}
          handleNewClassifySelected={handleNewClassifySelectedFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("label__component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label__component"));
    await waitFor(() => {
      expect(screen.getByTestId("popup__div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("first_column_0")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("second_column_0")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("second_column_0").textContent).toBe(
        "Recurring Revenues"
      );
    });
    fireEvent.click(screen.getByTestId("first_column_1"));
    await waitFor(() => {
      expect(screen.getByTestId("second_column_0").textContent).toBe(
        "Variable Costs"
      );
    });
  });

  it("when select new item from the second column, the selected view should be updated.", async () => {
    const handleNewClassifySelectedFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownTwoColumns
          classificationLoading={false}
          labelComponent={"test label"}
          data={[
            {
              items: [{ name: "Recurring Revenues", code: "RREV" }],
              name: "Revenues",
            },
            {
              items: [
                {
                  code: "VCOST",
                  name: "Variable Costs",
                },
              ],
              name: "cost of sales",
            },
          ]}
          handleNewClassifySelected={handleNewClassifySelectedFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("label__component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label__component"));
    await waitFor(() => {
      expect(screen.getByTestId("popup__div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("first_column_0")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("second_column_0")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("second_column_0").textContent).toBe(
        "Recurring Revenues"
      );
    });
    fireEvent.click(screen.getByTestId("second_column_0"));
    await waitFor(() => {
      expect(handleNewClassifySelectedFn).toBeCalled();
    });
  });

  it("when click outside the popup, the popup should disappear.", async () => {
    const handleNewClassifySelectedFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownTwoColumns
          classificationLoading={false}
          labelComponent={"test label"}
          data={[
            {
              items: [{ name: "Recurring Revenues", code: "RREV" }],
              name: "Revenues",
            },
            {
              items: [
                {
                  code: "VCOST",
                  name: "Variable Costs",
                },
              ],
              name: "cost of sales",
            },
          ]}
          handleNewClassifySelected={handleNewClassifySelectedFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("label__component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label__component"));
    await waitFor(() => {
      expect(screen.getByTestId("popup__div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("first_column_0")).toBeInTheDocument();
    });
    fireEvent.click(document.body);
    await waitFor(() => {
      expect(screen.queryByTestId("popup__div")).not.toBeInTheDocument();
    });
  });

  it("when select new item from the first column and their is no items , the second column should be empty.", async () => {
    const handleNewClassifySelectedFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownTwoColumns
          classificationLoading={false}
          labelComponent={"test label"}
          data={[
            {
              items: [{ name: "Recurring Revenues", code: "RREV" }],
              name: "Revenues",
            },
            {
              items: [],
              name: "cost of sales",
            },
          ]}
          handleNewClassifySelected={handleNewClassifySelectedFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("label__component")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label__component"));
    await waitFor(() => {
      expect(screen.getByTestId("popup__div")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("first_column_0")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("second_column_0")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("second_column_0").textContent).toBe(
        "Recurring Revenues"
      );
    });
    fireEvent.click(screen.getByTestId("first_column_1"));
    await waitFor(() => {
      expect(screen.queryByTestId("second_column_0")).not.toBeInTheDocument();
    });
  });
});
