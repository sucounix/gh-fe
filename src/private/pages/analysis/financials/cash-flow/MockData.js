export const mockdataCF = {
  headers: {
    analysis_statement: "Cash Flow",
    period: "December",
    financial_year: "2023/2024",
    view_type: null,
    columns_length: 6,
  },
  columns: [
    {
      col_data: "Cash Flow",
    },
    {
      col_data: "Dec 2023/2024",
    },
    {
      col_data: "Nov 2023/2024",
    },
    {
      col_data: "Period on Period",
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
            col_data: "Operating Activities",
          },
        ],
        rows: [
          {
            row: [
              {
                col_data: "Net Profit",
                col_type: "text",
              },
              {
                col_data: 26283109.73,
                col_type: "Monetary",
              },
              {
                col_data: 25748246.03,
                col_type: "Monetary",
              },
              {
                col_data: 2.0772820772988365,
                col_type: "Percentage",
              },
              {
                col_data: 19773477.76,
                col_type: "Monetary",
              },
              {
                col_data: 32.92102708997609,
                col_type: "Percentage",
              },
            ],
            display_type: "sub_total",
          },
        ],
        border: true,
      },
    },
  ],
};
