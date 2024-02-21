/* istanbul ignore file */
export const preRequisetes = {
  predefined_chart: [
    {
      name: "Profit",
      required: [
        {
          uuid: "ef8f3193-4e1c-4120-b88e-518b91f96645",
          name: "Total Revenues",
          type: "Monetary",
          is_kpi: false,
          show_moving_average: false,
          display_type: "line",
        },
        {
          uuid: "0187d66b-89d4-4efd-a3d7-c3db998ebe85",
          name: "Gross Profit",
          type: "Monetary",
          is_kpi: false,
          show_moving_average: false,
          display_type: "line",
        },
        {
          uuid: "13d3b5c8-1a0a-4928-9452-05593e4fde56",
          name: "Earnings Before Interest & Taxes",
          type: "Monetary",
          is_kpi: false,
          show_moving_average: false,
          display_type: "line",
        },
        {
          uuid: "dcf3a70b-121a-44ce-aa48-db2b28a86c51",
          name: "EBITDA",
          type: "Monetary",
          is_kpi: false,
          show_moving_average: false,
          display_type: "line",
        },
        {
          uuid: "64e18965-80e4-463c-bd45-5b1b6eedc3eb",
          name: "Net Profit",
          type: "Monetary",
          is_kpi: false,
          show_moving_average: false,
          display_type: "line",
        },
      ],
    },
  ],
  metrics: [
    {
      name: "Profit & Loss",
      children: [
        {
          name: "Standard",
          sections: [
            {
              name: "Revenues",
              items: [
                {
                  uuid: "913d4039-f1ae-47df-9b08-e8e291442c99",
                  name: "Retail",
                  type: "Monetary",
                  is_kpi: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const data = {
  chart_item: {
    type: "trend_analysis",
    frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
    period: "Q2 2021/2022",
    title: "chart 1",
    is_valid: true,
    params: {
      selected_chart: "Custom",
      show_table: true,
      show_data_info: false,
      charts: [
        {
          uuid: "913d4039-f1ae-47df-9b08-e8e291442c99",
          type: "Monetary",
          name: "Retail",
          is_kpi: false,
          show_moving_average: false,
          display_type: "line",
        },
      ],
    },
    value: {
      data: {
        headers: [
          "Jan 2022",
          "Feb 2022",
          "Mar 2022",
          "Apr 2022",
          "May 2022",
          "Jun 2022",
          "Jul 2022",
          "Aug 2022",
          "Sep 2022",
        ],
        charts: [
          {
            chart_uuid: "913d4039-f1ae-47df-9b08-e8e291442c99",
            chart_name: "Retail",
            type: "Monetary",
            is_kpi: false,
            color: "#af18dd",
            values: [
              {
                key: "Jan 2022",
                standard: 20000000.0,
                moving_average: 20000000.0,
              },
              {
                key: "Feb 2022",
                standard: 22000000.0,
                moving_average: 21000000.0,
              },
              {
                key: "Mar 2022",
                standard: 23000000.0,
                moving_average: 21666666.666666668,
              },
              {
                key: "Apr 2022",
                standard: 24000000.0,
                moving_average: 22250000.0,
              },
              {
                key: "May 2022",
                standard: 25000000.0,
                moving_average: 22800000.0,
              },
              {
                key: "Jun 2022",
                standard: 26000000.0,
                moving_average: 23333333.333333332,
              },
              {
                key: "Jul 2022",
                standard: 27000000.0,
                moving_average: 23857142.85714286,
              },
              {
                key: "Aug 2022",
                standard: 28000000.0,
                moving_average: 24375000.0,
              },
              {
                key: "Sep 2022",
                standard: 29000000.0,
                moving_average: 24888888.888888888,
              },
            ],
          },
        ],
      },
    },
    uuid: "123",
    item_uuid: "a042defa-8bf8-4432-8d3c-86e7d4b6de3e",
    created: "2023-09-25T06:46:46.663988Z",
    modified: "2023-09-26T17:39:57.870957Z",
  },
  created: "2023-09-25T06:46:46.663988Z",
  modified: null,
  priority: 1,
  section_uuid: "86227864-b74b-456d-bb5f-46ec52747aa0",
  table_item: null,
  text_item: null,
  type: "chart",
  uuid: "a042defa-8bf8-4432-8d3c-86e7d4b6de3e",
};
