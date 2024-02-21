import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormulaVariables from "./FormulaVariables";

describe("FormulaVariables", () => {
  const setSearchText = jest.fn();
  const addVariable = jest.fn();
  const setSelectedAddType = jest.fn();
  const searchFilter = "all";
  const setSearchFilter = jest.fn();
  const searchText = "";

  const dynamicValues = [
    { label: "Variable 1" },
    { label: "Variable 2" },
    { label: "Variable 3" },
  ];

  it("renders the component", () => {
    render(
      <FormulaVariables
        setSearchText={setSearchText}
        dynamicValues={dynamicValues}
        addVariable={addVariable}
        setSelectedAddType={setSelectedAddType}
        selectedAddType=""
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        searchText={searchText}
      />
    );

    expect(
      screen.getByText("Select a variable to include in the formula:")
    ).toBeInTheDocument();
  });

  it("calls setSearchText when the search input value changes", () => {
    render(
      <FormulaVariables
        setSearchText={setSearchText}
        dynamicValues={dynamicValues}
        addVariable={addVariable}
        setSelectedAddType={setSelectedAddType}
        selectedAddType=""
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        searchText={searchText}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search for a variable");
    fireEvent.change(searchInput, { target: { value: "Variable 1" } });
    expect(setSearchText).toHaveBeenCalledWith("Variable 1");
  });

  it("renders the dynamic values", () => {
    render(
      <FormulaVariables
        setSearchText={setSearchText}
        dynamicValues={dynamicValues}
        addVariable={addVariable}
        setSelectedAddType={setSelectedAddType}
        selectedAddType=""
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        searchText={searchText}
      />
    );

    const dynamicValue1 = screen.getByText("Variable 1");
    const dynamicValue2 = screen.getByText("Variable 2");
    const dynamicValue3 = screen.getByText("Variable 3");
    expect(dynamicValue1).toBeInTheDocument();
    expect(dynamicValue2).toBeInTheDocument();
    expect(dynamicValue3).toBeInTheDocument();
  });

  it("calls addVariable when a variable is selected", async () => {
    render(
      <FormulaVariables
        setSearchText={setSearchText}
        dynamicValues={dynamicValues}
        addVariable={addVariable}
        setSelectedAddType={setSelectedAddType}
        selectedAddType=""
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        searchText={searchText}
      />
    );

    const dynamicValue1 = screen.getByTestId("add_variable_0");
    fireEvent.click(dynamicValue1);

    await waitFor(() => {
      expect(addVariable).toHaveBeenCalledWith(dynamicValues[0]);
    });
  });

  it("calls setSelectedAddType when the radio button value changes", () => {
    render(
      <FormulaVariables
        setSearchText={setSearchText}
        dynamicValues={dynamicValues}
        addVariable={addVariable}
        setSelectedAddType={setSelectedAddType}
        selectedAddType=""
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        searchText={searchText}
      />
    );

    const currentPeriodRadio = screen.getByLabelText("Use current period");
    fireEvent.click(currentPeriodRadio);
    expect(setSelectedAddType).toHaveBeenCalledWith("current");
  });
});
