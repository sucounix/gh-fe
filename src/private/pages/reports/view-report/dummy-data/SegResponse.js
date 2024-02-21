export const SegResponse = {
  extra: { requirements: ["Revenue"] },
  headers: {
    analysis_statement: "Segmentation Analysis",
    period: "October",
    financial_year: "2023/2024",
    view_name: "Revenue",
    alerts: 15,
    columns_length: 6,
  },
  columns: [
    {
      col_data: "Segmentation Analysis",
    },
    {
      col_data: "October 2023/2024",
    },
    {
      col_data: "Sep 2023/2024",
    },
    {
      col_data: "Period on Period",
    },
    {
      col_data: "Budget",
    },
    {
      col_data: "Variance",
    },
  ],
  rows: [
    {
      row: {
        columns: [
          {
            col_data: "Period Margins",
          },
        ],
        rows: [
          {
            row: [
              {
                col_data: "Total Revenues",
                col_type: "text",
              },
              {
                col_data: 21000000.0,
                col_type: "Monetary",
              },
              {
                col_data: 20500000.0,
                col_type: "Monetary",
              },
              {
                col_data: 2.4390243902439024,
                col_type: "Percentage",
              },
              {
                col_data: 100000000.0,
                col_type: "Monetary",
              },
              {
                col_data: -79.0,
                col_type: "Percentage",
              },
            ],
            display_type: "normal",
            alert: false,
          },
        ],
        border: true,
      },
    },
  ],
};
