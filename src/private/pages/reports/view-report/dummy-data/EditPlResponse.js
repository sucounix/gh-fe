// EBITDA view
// show values of the last year
export const EditPLResponse = {
  uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
  type: "Profit & Loss",
  frequency_period: "quarter", // ['month', 'quarter', 'semi-annual', 'annual']
  period: "Q2 2023/2024",
  params: {
    view_type: "Management Account", // ['Summary', 'Detailed', 'Management Account']
    view_name: "EBITDA", // ['Standard', 'EBITDA']
    is_hide: false,
  },
  value: {
    headers: {
      analysis_statement: "Profit & Loss",
      period: "October",
      financial_year: "2023/2024",
      view_name: "EBITDA Management accounts",
      view_type: "Management accounts",
      columns_length: 8,
    },
    columns: [
      {
        col_data: "Profit & Loss",
      },
      {
        col_data: "Oct 2023/2024",
      },
      {
        col_data: "Sep 2023/2024",
      },
      {
        col_data: "Period on Period",
      },
      {
        col_data: "Common Size",
      },
      {
        col_data: "Oct 2022/2023",
      },
      {
        col_data: "YoY Variance",
      },
      {
        col_data: "YTD",
      },
    ],
    rows: [
      {
        row: {
          columns: [
            {
              col_data: "Revenues",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data: "Wholesale (Recurring Revenues)",
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
                  col_data: 50.0,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 15000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 40.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 171000000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
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
                  col_data: 50.0,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 15000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 40.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 171000000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
            {
              row: [
                {
                  col_data: "Wholesale (Recurring Revenues)",
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
                  col_data: 50.0,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 15000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 40.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 171000000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
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
                  col_data: 50.0,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 15000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 40.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 171000000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
          ],
          border: true,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Cost of Sales",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data: "Retail (Variable Costs)",
                  col_type: "text",
                },
                {
                  col_data: -19622500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -19120000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6281380753138075,
                  col_type: "Percentage",
                },
                {
                  col_data: -46.720238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -13592500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 44.362700018392495,
                  col_type: "Percentage",
                },
                {
                  col_data: -158512500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Wholesale (Variable Costs)",
                  col_type: "text",
                },
                {
                  col_data: -10975000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -10675000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.810304449648712,
                  col_type: "Percentage",
                },
                {
                  col_data: -26.130952380952383,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -7375000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 48.8135593220339,
                  col_type: "Percentage",
                },
                {
                  col_data: -87975000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Retail (Fixed Costs)",
                  col_type: "text",
                },
                {
                  col_data: -19622500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -19120000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6281380753138075,
                  col_type: "Percentage",
                },
                {
                  col_data: -46.720238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -13592500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 44.362700018392495,
                  col_type: "Percentage",
                },
                {
                  col_data: -158512500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Wholesale (Fixed Costs)",
                  col_type: "text",
                },
                {
                  col_data: -10975000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -10675000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.810304449648712,
                  col_type: "Percentage",
                },
                {
                  col_data: -26.130952380952383,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -7375000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 48.8135593220339,
                  col_type: "Percentage",
                },
                {
                  col_data: -87975000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Retail (Variable Overheads)",
                  col_type: "text",
                },
                {
                  col_data: -19622500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -19120000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6281380753138075,
                  col_type: "Percentage",
                },
                {
                  col_data: -46.720238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -13592500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 44.362700018392495,
                  col_type: "Percentage",
                },
                {
                  col_data: -158512500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Wholesale (Variable Overheads)",
                  col_type: "text",
                },
                {
                  col_data: -10975000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -10675000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.810304449648712,
                  col_type: "Percentage",
                },
                {
                  col_data: -26.130952380952383,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -7375000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 48.8135593220339,
                  col_type: "Percentage",
                },
                {
                  col_data: -87975000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Retail (Fixed Overheads)",
                  col_type: "text",
                },
                {
                  col_data: -19622500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -19120000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6281380753138075,
                  col_type: "Percentage",
                },
                {
                  col_data: -46.720238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -13592500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 44.362700018392495,
                  col_type: "Percentage",
                },
                {
                  col_data: -158512500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Wholesale (Fixed Overheads)",
                  col_type: "text",
                },
                {
                  col_data: -10975000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -10675000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.810304449648712,
                  col_type: "Percentage",
                },
                {
                  col_data: -26.130952380952383,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -7375000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 48.8135593220339,
                  col_type: "Percentage",
                },
                {
                  col_data: -87975000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Depreciation Cost (Assets Depreciation & Amortization)",
                  col_type: "text",
                },
                {
                  col_data: -143968.1,
                  col_type: "Monetary",
                },
                {
                  col_data: -140392.51,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5468523926240767,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.3427811904761905,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -106499.31,
                  col_type: "Monetary",
                },
                {
                  col_data: 35.182190382266334,
                  col_type: "Percentage",
                },
                {
                  col_data: -1174721.5300000003,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Cost of Sales",
                  col_type: "text",
                },
                {
                  col_data: -30741468.1,
                  col_type: "Monetary",
                },
                {
                  col_data: -29935392.51,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6927176242326807,
                  col_type: "Percentage",
                },
                {
                  col_data: -73.19397166666667,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -21073999.31,
                  col_type: "Monetary",
                },
                {
                  col_data: 45.87391623104311,
                  col_type: "Percentage",
                },
                {
                  col_data: -247662221.53,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
            {
              row: [
                {
                  col_data: "Retail (Variable Costs)",
                  col_type: "text",
                },
                {
                  col_data: -19622500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -19120000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6281380753138075,
                  col_type: "Percentage",
                },
                {
                  col_data: -46.720238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -13592500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 44.362700018392495,
                  col_type: "Percentage",
                },
                {
                  col_data: -158512500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Wholesale (Variable Costs)",
                  col_type: "text",
                },
                {
                  col_data: -10975000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -10675000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.810304449648712,
                  col_type: "Percentage",
                },
                {
                  col_data: -26.130952380952383,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -7375000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 48.8135593220339,
                  col_type: "Percentage",
                },
                {
                  col_data: -87975000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Retail (Fixed Costs)",
                  col_type: "text",
                },
                {
                  col_data: -19622500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -19120000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6281380753138075,
                  col_type: "Percentage",
                },
                {
                  col_data: -46.720238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -13592500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 44.362700018392495,
                  col_type: "Percentage",
                },
                {
                  col_data: -158512500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Wholesale (Fixed Costs)",
                  col_type: "text",
                },
                {
                  col_data: -10975000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -10675000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.810304449648712,
                  col_type: "Percentage",
                },
                {
                  col_data: -26.130952380952383,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -7375000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 48.8135593220339,
                  col_type: "Percentage",
                },
                {
                  col_data: -87975000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Retail (Variable Overheads)",
                  col_type: "text",
                },
                {
                  col_data: -19622500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -19120000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6281380753138075,
                  col_type: "Percentage",
                },
                {
                  col_data: -46.720238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -13592500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 44.362700018392495,
                  col_type: "Percentage",
                },
                {
                  col_data: -158512500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Wholesale (Variable Overheads)",
                  col_type: "text",
                },
                {
                  col_data: -10975000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -10675000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.810304449648712,
                  col_type: "Percentage",
                },
                {
                  col_data: -26.130952380952383,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -7375000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 48.8135593220339,
                  col_type: "Percentage",
                },
                {
                  col_data: -87975000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Retail (Fixed Overheads)",
                  col_type: "text",
                },
                {
                  col_data: -19622500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -19120000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6281380753138075,
                  col_type: "Percentage",
                },
                {
                  col_data: -46.720238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -13592500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 44.362700018392495,
                  col_type: "Percentage",
                },
                {
                  col_data: -158512500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Wholesale (Fixed Overheads)",
                  col_type: "text",
                },
                {
                  col_data: -10975000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -10675000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.810304449648712,
                  col_type: "Percentage",
                },
                {
                  col_data: -26.130952380952383,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -7375000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 48.8135593220339,
                  col_type: "Percentage",
                },
                {
                  col_data: -87975000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Depreciation Cost (Assets Depreciation & Amortization)",
                  col_type: "text",
                },
                {
                  col_data: -143968.1,
                  col_type: "Monetary",
                },
                {
                  col_data: -140392.51,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5468523926240767,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.3427811904761905,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -106499.31,
                  col_type: "Monetary",
                },
                {
                  col_data: 35.182190382266334,
                  col_type: "Percentage",
                },
                {
                  col_data: -1174721.5299999998,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Cost of Sales",
                  col_type: "text",
                },
                {
                  col_data: -30741468.1,
                  col_type: "Monetary",
                },
                {
                  col_data: -29935392.51,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.6927176242326807,
                  col_type: "Percentage",
                },
                {
                  col_data: -73.19397166666667,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -21073999.31,
                  col_type: "Monetary",
                },
                {
                  col_data: 45.87391623104311,
                  col_type: "Percentage",
                },
                {
                  col_data: -247662221.52999997,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
          ],
          border: false,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Gross Profit",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data: "Gross Profit",
                  col_type: "text",
                },
                {
                  col_data: -9741468.1,
                  col_type: "Monetary",
                },
                {
                  col_data: -9435392.51,
                  col_type: "Monetary",
                },
                {
                  col_data: 3.2439094576681247,
                  col_type: "Percentage",
                },
                {
                  col_data: -23.193971666666666,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -6073999.31,
                  col_type: "Monetary",
                },
                {
                  col_data: 60.379802545614716,
                  col_type: "Percentage",
                },
                {
                  col_data: -76662221.52999999,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
            {
              row: [
                {
                  col_data: "Gross Profit",
                  col_type: "text",
                },
                {
                  col_data: -9741468.1,
                  col_type: "Monetary",
                },
                {
                  col_data: -9435392.51,
                  col_type: "Monetary",
                },
                {
                  col_data: 3.2439094576681247,
                  col_type: "Percentage",
                },
                {
                  col_data: -23.193971666666666,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -6073999.31,
                  col_type: "Monetary",
                },
                {
                  col_data: 60.379802545614716,
                  col_type: "Percentage",
                },
                {
                  col_data: -76662221.52999999,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
          ],
          border: true,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Operating Income",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data: "Supplier Discounts (Other Operating Income)",
                  col_type: "text",
                },
                {
                  col_data: 520000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 500000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 1.2380952380952381,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 280000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 85.71428571428571,
                  col_type: "Percentage",
                },
                {
                  col_data: 3960000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Other Operating Income (Other Operating Income)",
                  col_type: "text",
                },
                {
                  col_data: 69650.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 66333.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 5.000527640842416,
                  col_type: "Percentage",
                },
                {
                  col_data: 0.16583333333333333,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 38783.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 79.58899517829977,
                  col_type: "Percentage",
                },
                {
                  col_data: 519808.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Operating Income",
                  col_type: "text",
                },
                {
                  col_data: 589650.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 566333.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.117189003642733,
                  col_type: "Percentage",
                },
                {
                  col_data: 1.4039285714285714,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 318783.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 84.96908555349563,
                  col_type: "Percentage",
                },
                {
                  col_data: 4479808.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
            {
              row: [
                {
                  col_data: "Supplier Discounts (Other Operating Income)",
                  col_type: "text",
                },
                {
                  col_data: 520000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 500000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 1.2380952380952381,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 280000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 85.71428571428571,
                  col_type: "Percentage",
                },
                {
                  col_data: 3960000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Other Operating Income (Other Operating Income)",
                  col_type: "text",
                },
                {
                  col_data: 69650.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 66333.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 5.000527640842416,
                  col_type: "Percentage",
                },
                {
                  col_data: 0.16583333333333333,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 38783.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 79.58899517829977,
                  col_type: "Percentage",
                },
                {
                  col_data: 519808.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Operating Income",
                  col_type: "text",
                },
                {
                  col_data: 589650.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 566333.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.117189003642733,
                  col_type: "Percentage",
                },
                {
                  col_data: 1.4039285714285714,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 318783.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 84.96908555349563,
                  col_type: "Percentage",
                },
                {
                  col_data: 4479808.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
          ],
          border: true,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Operating Expenses",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data: "Payroll & Salaries (Salaries & Staff Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -2500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -2500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.005952380952380952,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -2500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -22500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Staff Medical Insurance (Salaries & Staff Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -3125.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -3125.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.007440476190476191,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -3125.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -28125.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Other Operating Expenses (Other Operating Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.002976190476190476,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -11250.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Staff Income Taxes (Salaries & Staff Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -2875.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -2875.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.006845238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -2875.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -25875.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Retail (Other Operating Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -42000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -41000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.4390243902439024,
                  col_type: "Percentage",
                },
                {
                  col_data: -100.0,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -30000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 40.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -342000000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Selling & Distribution Expenses (Selling & Distribution Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.029761904761904764,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -112500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Repairs & Maintenance (General & Administrative Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.002976190476190476,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -11250.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Other Administrative Expenses (General & Administrative Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.029761904761904764,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -112500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Marketing Expenses (Marketing & Advertising Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -30000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -30000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.07142857142857142,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -30000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -270000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Administrative Depreciation Expense (Admin Depreciation & Amortization)",
                  col_type: "text",
                },
                {
                  col_data: -1625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -1625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.0038690476190476187,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -1625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -14625.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Operating Expenses",
                  col_type: "text",
                },
                {
                  col_data: -42067625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -41067625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.435008111620772,
                  col_type: "Percentage",
                },
                {
                  col_data: -100.16101190476189,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -30067625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 39.91003612689729,
                  col_type: "Percentage",
                },
                {
                  col_data: -342608625.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
            {
              row: [
                {
                  col_data: "Retail (Other Operating Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -42000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -41000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.4390243902439024,
                  col_type: "Percentage",
                },
                {
                  col_data: -100.0,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -30000000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 40.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -342000000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Payroll & Salaries (Salaries & Staff Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -2500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -2500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.005952380952380952,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -2500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -22500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Staff Medical Insurance (Salaries & Staff Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -3125.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -3125.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.007440476190476191,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -3125.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -28125.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Staff Income Taxes (Salaries & Staff Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -2875.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -2875.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.006845238095238095,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -2875.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -25875.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Other Operating Expenses (Other Operating Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.002976190476190476,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -11250.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Selling & Distribution Expenses (Selling & Distribution Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.029761904761904764,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -112500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Repairs & Maintenance (General & Administrative Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.002976190476190476,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -1250.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -11250.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Other Administrative Expenses (General & Administrative Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.029761904761904764,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -12500.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -112500.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Marketing Expenses (Marketing & Advertising Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -30000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -30000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.07142857142857142,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -30000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -270000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data:
                    "Administrative Depreciation Expense (Admin Depreciation & Amortization)",
                  col_type: "text",
                },
                {
                  col_data: -1625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -1625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.0038690476190476187,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -1625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -0.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -14625.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Operating Expenses",
                  col_type: "text",
                },
                {
                  col_data: -42067625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -41067625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.435008111620772,
                  col_type: "Percentage",
                },
                {
                  col_data: -100.16101190476189,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -30067625.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 39.91003612689729,
                  col_type: "Percentage",
                },
                {
                  col_data: -342608625.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
          ],
          border: false,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Adjusted EBITDA",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data: "Adjusted EBITDA",
                  col_type: "text",
                },
                {
                  col_data: -51073850.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -49794667.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5689156631974264,
                  col_type: "Percentage",
                },
                {
                  col_data: -121.60440476190477,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -35714717.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 43.005053070979116,
                  col_type: "Percentage",
                },
                {
                  col_data: -413601692.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
            {
              row: [
                {
                  col_data: "Adjusted EBITDA",
                  col_type: "text",
                },
                {
                  col_data: -51073850.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -49794667.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5689156631974264,
                  col_type: "Percentage",
                },
                {
                  col_data: -121.60440476190477,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -35714717.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 43.005053070979116,
                  col_type: "Percentage",
                },
                {
                  col_data: -413601692.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
          ],
          border: true,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Non Operating Line Items",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data:
                    "Other Non Operating Income (Other Non Operating Income)",
                  col_type: "text",
                },
                {
                  col_data: 22000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 21000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.761904761904762,
                  col_type: "Percentage",
                },
                {
                  col_data: 0.05238095238095238,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 10000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 120.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 162000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Non Operating Income",
                  col_type: "text",
                },
                {
                  col_data: 22000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 21000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.761904761904762,
                  col_type: "Percentage",
                },
                {
                  col_data: 0.05238095238095238,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 10000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 120.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 162000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
            {
              row: [
                {
                  col_data:
                    "Other Non Operating Income (Other Non Operating Income)",
                  col_type: "text",
                },
                {
                  col_data: 22000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 21000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.761904761904762,
                  col_type: "Percentage",
                },
                {
                  col_data: 0.05238095238095238,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 10000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 120.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 162000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Non Operating Income",
                  col_type: "text",
                },
                {
                  col_data: 22000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 21000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.761904761904762,
                  col_type: "Percentage",
                },
                {
                  col_data: 0.05238095238095238,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 10000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 120.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 162000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
          ],
          border: true,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Non Operating Expenses",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data:
                    "Other Non Operating Expenses (Other Non Operating Expense)",
                  col_type: "text",
                },
                {
                  col_data: -22000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -21000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.761904761904762,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.05238095238095238,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -10000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 120.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -162000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Provisions (Provisions Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -148005.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -134550.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 10.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.3523928571428572,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -47158.95,
                  col_type: "Monetary",
                },
                {
                  col_data: 213.84286545820044,
                  col_type: "Percentage",
                },
                {
                  col_data: -937600.75,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Non Operating Expense",
                  col_type: "text",
                },
                {
                  col_data: -170005.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -155550.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 9.292831886853103,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.40477380952380954,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -57158.95,
                  col_type: "Monetary",
                },
                {
                  col_data: 197.42498768784242,
                  col_type: "Percentage",
                },
                {
                  col_data: -1099600.75,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
            {
              row: [
                {
                  col_data:
                    "Other Non Operating Expenses (Other Non Operating Expense)",
                  col_type: "text",
                },
                {
                  col_data: -22000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -21000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 4.761904761904762,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.05238095238095238,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -10000.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 120.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -162000.0,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Provisions (Provisions Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -148005.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -134550.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 10.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.3523928571428572,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -47158.95,
                  col_type: "Monetary",
                },
                {
                  col_data: 213.84286545820044,
                  col_type: "Percentage",
                },
                {
                  col_data: -937600.75,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Non Operating Expense",
                  col_type: "text",
                },
                {
                  col_data: -170005.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -155550.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 9.292831886853103,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.40477380952380954,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -57158.95,
                  col_type: "Monetary",
                },
                {
                  col_data: 197.42498768784242,
                  col_type: "Percentage",
                },
                {
                  col_data: -1099600.75,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
          ],
          border: false,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "EBITDA",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data: "EBITDA",
                  col_type: "text",
                },
                {
                  col_data: -51221855.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -49929217.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5889410603014262,
                  col_type: "Percentage",
                },
                {
                  col_data: -121.95679761904763,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -35761875.95,
                  col_type: "Monetary",
                },
                {
                  col_data: 43.230335767662645,
                  col_type: "Percentage",
                },
                {
                  col_data: -414539292.74999994,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
            {
              row: [
                {
                  col_data: "EBITDA",
                  col_type: "text",
                },
                {
                  col_data: -51221855.0,
                  col_type: "Monetary",
                },
                {
                  col_data: -49929217.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5889410603014262,
                  col_type: "Percentage",
                },
                {
                  col_data: -121.95679761904763,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -35761875.95,
                  col_type: "Monetary",
                },
                {
                  col_data: 43.230335767662645,
                  col_type: "Percentage",
                },
                {
                  col_data: -414539292.74999994,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
          ],
          border: true,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Interest",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data: "Interest Income (Interest Income)",
                  col_type: "text",
                },
                {
                  col_data: 74002.5,
                  col_type: "Monetary",
                },
                {
                  col_data: 67275.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 10.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 0.1761964285714286,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 23579.48,
                  col_type: "Monetary",
                },
                {
                  col_data: 213.84279890820324,
                  col_type: "Percentage",
                },
                {
                  col_data: 468800.36,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Finance Expenses (Interest Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -111003.75,
                  col_type: "Monetary",
                },
                {
                  col_data: -100912.5,
                  col_type: "Monetary",
                },
                {
                  col_data: 10.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.2642946428571429,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -35369.22,
                  col_type: "Monetary",
                },
                {
                  col_data: 213.84279890820324,
                  col_type: "Percentage",
                },
                {
                  col_data: -703200.56,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Total Interest",
                  col_type: "text",
                },
                {
                  col_data: -37001.25,
                  col_type: "Monetary",
                },
                {
                  col_data: -33637.5,
                  col_type: "Monetary",
                },
                {
                  col_data: 10.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.0880982142857143,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -11789.74,
                  col_type: "Monetary",
                },
                {
                  col_data: 213.84279890820324,
                  col_type: "Percentage",
                },
                {
                  col_data: -234400.19999999998,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
            {
              row: [
                {
                  col_data: "Earnings Before Taxes",
                  col_type: "text",
                },
                {
                  col_data: -51404449.35,
                  col_type: "Monetary",
                },
                {
                  col_data: -50104872.01,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5937145189007413,
                  col_type: "Percentage",
                },
                {
                  col_data: -122.39154607142856,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -35881790.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 43.260549013859126,
                  col_type: "Percentage",
                },
                {
                  col_data: -415963039.48,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
            {
              row: [
                {
                  col_data: "Interest Income (Interest Income)",
                  col_type: "text",
                },
                {
                  col_data: 74002.5,
                  col_type: "Monetary",
                },
                {
                  col_data: 67275.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 10.0,
                  col_type: "Percentage",
                },
                {
                  col_data: 0.1761964285714286,
                  col_type: "chart_percentage",
                },
                {
                  col_data: 23579.48,
                  col_type: "Monetary",
                },
                {
                  col_data: 213.84279890820324,
                  col_type: "Percentage",
                },
                {
                  col_data: 468800.36,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Finance Expenses (Interest Expenses)",
                  col_type: "text",
                },
                {
                  col_data: -111003.75,
                  col_type: "Monetary",
                },
                {
                  col_data: -100912.5,
                  col_type: "Monetary",
                },
                {
                  col_data: 10.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.2642946428571429,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -35369.22,
                  col_type: "Monetary",
                },
                {
                  col_data: 213.84279890820324,
                  col_type: "Percentage",
                },
                {
                  col_data: -703200.56,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Total Interest",
                  col_type: "text",
                },
                {
                  col_data: -37001.25,
                  col_type: "Monetary",
                },
                {
                  col_data: -33637.5,
                  col_type: "Monetary",
                },
                {
                  col_data: 10.0,
                  col_type: "Percentage",
                },
                {
                  col_data: -0.0880982142857143,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -11789.74,
                  col_type: "Monetary",
                },
                {
                  col_data: 213.84279890820324,
                  col_type: "Percentage",
                },
                {
                  col_data: -234400.19999999995,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
            {
              row: [
                {
                  col_data: "Earnings Before Taxes",
                  col_type: "text",
                },
                {
                  col_data: -51404449.35,
                  col_type: "Monetary",
                },
                {
                  col_data: -50104872.01,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5937145189007413,
                  col_type: "Percentage",
                },
                {
                  col_data: -122.39154607142856,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -35881790.0,
                  col_type: "Monetary",
                },
                {
                  col_data: 43.260549013859126,
                  col_type: "Percentage",
                },
                {
                  col_data: -415963039.48,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
          ],
          border: true,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Taxes",
            },
          ],
          rows: [
            {
              row: [
                {
                  col_data: "Current Income Tax (Current Tax Expense)",
                  col_type: "text",
                },
                {
                  col_data: -7383950.58,
                  col_type: "Monetary",
                },
                {
                  col_data: -7221814.42,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.245088984161409,
                  col_type: "Percentage",
                },
                {
                  col_data: -17.580834714285714,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -5442513.4,
                  col_type: "Monetary",
                },
                {
                  col_data: 35.67170234252431,
                  col_type: "Percentage",
                },
                {
                  col_data: -60624756.36,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Income Tax",
                  col_type: "text",
                },
                {
                  col_data: -7383950.58,
                  col_type: "Monetary",
                },
                {
                  col_data: -7221814.42,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.245088984161409,
                  col_type: "Percentage",
                },
                {
                  col_data: -17.580834714285714,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -5442513.4,
                  col_type: "Monetary",
                },
                {
                  col_data: 35.67170234252431,
                  col_type: "Percentage",
                },
                {
                  col_data: -60624756.36,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
            {
              row: [
                {
                  col_data: "Current Income Tax (Current Tax Expense)",
                  col_type: "text",
                },
                {
                  col_data: -7383950.58,
                  col_type: "Monetary",
                },
                {
                  col_data: -7221814.42,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.245088984161409,
                  col_type: "Percentage",
                },
                {
                  col_data: -17.580834714285714,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -5442513.4,
                  col_type: "Monetary",
                },
                {
                  col_data: 35.67170234252431,
                  col_type: "Percentage",
                },
                {
                  col_data: -60624756.36,
                  col_type: "Monetary",
                },
              ],
              display_type: "normal",
            },
            {
              row: [
                {
                  col_data: "Income Tax",
                  col_type: "text",
                },
                {
                  col_data: -7383950.58,
                  col_type: "Monetary",
                },
                {
                  col_data: -7221814.42,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.245088984161409,
                  col_type: "Percentage",
                },
                {
                  col_data: -17.580834714285714,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -5442513.4,
                  col_type: "Monetary",
                },
                {
                  col_data: 35.67170234252431,
                  col_type: "Percentage",
                },
                {
                  col_data: -60624756.36,
                  col_type: "Monetary",
                },
              ],
              display_type: "sub_total",
            },
          ],
          border: false,
        },
      },
      {
        row: {
          columns: [
            {
              col_data: "Net Profit",
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
                  col_data: -58788399.93,
                  col_type: "Monetary",
                },
                {
                  col_data: -57326686.43,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5497958996546175,
                  col_type: "Percentage",
                },
                {
                  col_data: -139.97238078571428,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -41324303.4,
                  col_type: "Monetary",
                },
                {
                  col_data: 42.2610790578989,
                  col_type: "Percentage",
                },
                {
                  col_data: -476587795.84000003,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
            {
              row: [
                {
                  col_data: "Net Profit",
                  col_type: "text",
                },
                {
                  col_data: -58788399.93,
                  col_type: "Monetary",
                },
                {
                  col_data: -57326686.43,
                  col_type: "Monetary",
                },
                {
                  col_data: 2.5497958996546175,
                  col_type: "Percentage",
                },
                {
                  col_data: -139.97238078571428,
                  col_type: "chart_percentage",
                },
                {
                  col_data: -41324303.4,
                  col_type: "Monetary",
                },
                {
                  col_data: 42.2610790578989,
                  col_type: "Percentage",
                },
                {
                  col_data: -476587795.84000003,
                  col_type: "Monetary",
                },
              ],
              display_type: "total",
            },
          ],
          border: false,
        },
      },
    ],
  },
};
