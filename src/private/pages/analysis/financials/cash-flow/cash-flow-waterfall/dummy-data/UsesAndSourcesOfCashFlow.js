/* istanbul ignore file */
export const secondViewData = {
  headers: {
    analysis_statement: "Cash Flow",
    period: "December",
    financial_year: "2023/2024",
    view_name: "Uses & Sources of Cash Flow",
    columns_length: 6,
  },
  columns: [
    {
      col_data: "Uses & Sources of Cash Flow",
    },
    {
      col_data: "Dec 2023/2024",
    },
    {
      col_data: "Nov 2023/2024",
    },
    {
      col_data: "MoM",
    },
    {
      col_data: "Dec 2022/2023",
    },
    {
      col_data: "YoY Variance",
    },
  ],
  rows: [
    {
      row: {
        columns: [
          {
            col_data: "Uses Of Cash Flow (Spending)",
          },
        ],
        rows: [
          {
            row: [
              {
                col_data: "CHG. Inventory",
                col_type: "text",
              },
              {
                col_data: -500000.0,
                col_type: "Monetary",
              },
              {
                col_data: -500000.0,
                col_type: "Monetary",
              },
              {
                col_data: -0.0,
                col_type: "Percentage",
              },
              {
                col_data: -500000.0,
                col_type: "Monetary",
              },
              {
                col_data: -0.0,
                col_type: "Percentage",
              },
            ],
            display_type: "normal",
          },
        ],
        border: true,
      },
    },
  ],
};
