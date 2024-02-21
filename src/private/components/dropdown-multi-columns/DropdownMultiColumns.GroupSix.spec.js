import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DropdownMultiColumns from "./DropdownMultiColumns";

const mockedData = [
  {
    name: "Profit & Loss",
    children: [
      {
        name: "Standard_pl",
        sections: [
          {
            name: "Revenues_Standard_pl",

            items: [
              {
                is_kpi: false,
                name: "Retail",
                type: "Percentage",
                uuid: "ebe4ee79-9977-495e-92b5-088a12a222c7",
              },
              {
                is_kpi: false,
                name: "test 1",
                type: "Monetary",
                uuid: "ebe4ee79-9977-495e-92b5-088a12a222c7",
              },
              {
                is_kpi: false,
                name: "test2",
                type: "Number",
                uuid: "ebe4ee79-9977-495e-92b5-088a12a222c7",
              },
            ],
          },
        ],
      },
      {
        name: "Summary_pl",
        sections: [
          {
            name: "Revenues_Summary_pl",

            items: [
              {
                is_kpi: false,
                name: "Retail",
                type: "Monetary",
                uuid: "ebe4ee79-9977-495e-92b5-088a12a222c7",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Balancesheet",
    children: [
      {
        name: "Standard_bs",
        sections: [
          {
            name: "Revenues BS",

            items: [
              {
                is_kpi: false,
                name: "Retail BS",
                type: "Monetary",
                uuid: "ebe4ee79-9977-495e-92b5-088a12a222c7",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "cashflow",
    children: [],
  },
];

describe("Dropdown Multi Columns", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when click on the label component , the popup div should appear.", async () => {
    const handleAddNewMetricFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownMultiColumns
          labelComponent={"test label"}
          handleAddNewMetric={handleAddNewMetricFn}
          data={mockedData}
          currentYAxisUnits={new Set(["Monetary"])}
          currentList={[
            {
              is_kpi: false,
              name: "T",
              type: "Monetary",
              uuid: "765e465d-18e9-4f79-a1f8-c925bbd02144",
            },
          ]}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("label_component_multi_columns")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label_component_multi_columns"));
    await waitFor(() => {
      expect(
        screen.getByTestId("popup__div_multi_columns")
      ).toBeInTheDocument();
    });
  });

  it("if their is a data , the options div should be appearded.", async () => {
    const handleAddNewMetricFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownMultiColumns
          labelComponent={"test label"}
          handleAddNewMetric={handleAddNewMetricFn}
          data={mockedData}
          currentYAxisUnits={new Set(["Monetary"])}
          currentList={[
            {
              is_kpi: false,
              name: "Total Revenues",
              type: "Monetary",
              uuid: "765e465d-18e9-4f79-a1f8-c925bbd02144",
            },
          ]}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("label_component_multi_columns")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label_component_multi_columns"));
    await waitFor(() => {
      expect(screen.getByTestId("level1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level_1_metric_Profit & Loss")
      ).toBeInTheDocument();
    });
  });

  it("when click on option from the level 1, the second column should be updated.", async () => {
    const handleAddNewMetricFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownMultiColumns
          labelComponent={"test label"}
          handleAddNewMetric={handleAddNewMetricFn}
          data={mockedData}
          currentYAxisUnits={new Set(["Monetary"])}
          currentList={[
            {
              is_kpi: false,
              name: "Total Revenues",
              type: "Monetary",
              uuid: "765e465d-18e9-4f79-a1f8-c925bbd02144",
            },
          ]}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("label_component_multi_columns")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label_component_multi_columns"));
    await waitFor(() => {
      expect(screen.getByTestId("level1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level_2_metric_Standard_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level_1_metric_Balancesheet")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("level_1_metric_Balancesheet"));
    await waitFor(() => {
      expect(
        screen.getByTestId("level_2_metric_Standard_bs")
      ).toBeInTheDocument();
    });
  });

  it("when click on option from the level 2, the third column should be updated.", async () => {
    const handleAddNewMetricFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownMultiColumns
          labelComponent={"test label"}
          handleAddNewMetric={handleAddNewMetricFn}
          data={mockedData}
          currentYAxisUnits={new Set(["Monetary"])}
          currentList={[
            {
              is_kpi: false,
              name: "Total Revenues",
              type: "Monetary",
              uuid: "765e465d-18e9-4f79-a1f8-c925bbd02144",
            },
          ]}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("label_component_multi_columns")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label_component_multi_columns"));
    await waitFor(() => {
      expect(screen.getByTestId("level1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level_2_metric_Standard_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level_2_metric_Summary_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level3_section_Revenues_Standard_pl")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("level_2_metric_Summary_pl"));
    await waitFor(() => {
      expect(
        screen.getByTestId("level3_section_Revenues_Summary_pl")
      ).toBeInTheDocument();
    });
  });

  it("the search input should be rendered and when change it the result should be rendered", async () => {
    const handleAddNewMetricFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownMultiColumns
          labelComponent={"test label"}
          handleAddNewMetric={handleAddNewMetricFn}
          data={mockedData}
          currentYAxisUnits={new Set(["Monetary"])}
          currentList={[
            {
              is_kpi: false,
              name: "Total Revenues",
              type: "Monetary",
              uuid: "765e465d-18e9-4f79-a1f8-c925bbd02144",
            },
          ]}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("label_component_multi_columns")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label_component_multi_columns"));
    await waitFor(() => {
      expect(screen.getByTestId("level1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("level3_section_Revenues_Standard_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("level3_search_input")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("level_3_metric_Retail")).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId("level3_search_input"), {
      target: { value: "test" },
    });
    await waitFor(() => {
      expect(screen.getByTestId("level_3_metric_test 1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId("level_3_metric_Retail")
      ).not.toBeInTheDocument();
    });
  });

  it("if the selected items with 2 different unit and try to select item with another unit , the handleAddNewMetric method shouldn't be called.", async () => {
    const handleAddNewMetricFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownMultiColumns
          labelComponent={"test label"}
          handleAddNewMetric={handleAddNewMetricFn}
          data={mockedData}
          currentYAxisUnits={new Set(["Monetary", "Percentage"])}
          currentList={[
            {
              is_kpi: false,
              name: "Total Revenues",
              type: "Monetary",
              uuid: "765e465d-18e9-4f79-a1f8-c925bbd02144",
            },
          ]}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("label_component_multi_columns")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label_component_multi_columns"));
    await waitFor(() => {
      expect(screen.getByTestId("level1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level_2_metric_Standard_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level_2_metric_Summary_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level3_section_Revenues_Standard_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("level_3_metric_Retail")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("level_3_metric_Retail"));
    await waitFor(() => {
      expect(screen.getByTestId("level_3_metric_test 1")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("level_3_metric_test 1"));
    await waitFor(() => {
      expect(handleAddNewMetricFn).toBeCalledTimes(2);
    });
    await waitFor(() => {
      expect(screen.getByTestId("level_3_metric_test2")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("level_3_metric_test2"));
    await waitFor(() => {
      expect(handleAddNewMetricFn).not.toBeCalledTimes(3);
    });
  });

  it("if this item already selected ,the handleAddNewMetric method shouldn't be called.", async () => {
    const handleAddNewMetricFn = jest.fn();
    render(
      <BrowserRouter>
        <DropdownMultiColumns
          labelComponent={"test label"}
          handleAddNewMetric={handleAddNewMetricFn}
          data={mockedData}
          currentYAxisUnits={new Set(["Monetary", "Percentage"])}
          currentList={[
            {
              is_kpi: false,
              name: "Retail",
              type: "Percentage",
              uuid: "ebe4ee79-9977-495e-92b5-088a12a222c7",
            },
          ]}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("label_component_multi_columns")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("label_component_multi_columns"));
    await waitFor(() => {
      expect(screen.getByTestId("level1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level_2_metric_Standard_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level_2_metric_Summary_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("level3_section_Revenues_Standard_pl")
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("level_3_metric_Retail")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("level_3_metric_Retail"));

    await waitFor(() => {
      expect(handleAddNewMetricFn).not.toBeCalledTimes(1);
    });
  });
});
