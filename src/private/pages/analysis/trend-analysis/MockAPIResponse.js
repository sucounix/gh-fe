// will use this file in the unit test
// to mock the API response
export const data = {
  predefined_chart: [],
  metrics: [
    {
      name: "Profit & loss",
      children: [
        {
          name: "Standerd",
          sections: [
            {
              name: "Volume Consumption By Cumulative Active Clients",
              items: [
                {
                  uuid: "123",
                  is_kpi: false,
                  name: "Total Revenue",
                  type: "Number",
                },
              ],
            },
          ],
        },
        {
          name: "EBITDA",
          sections: [
            {
              name: "Revenue",
              items: [
                {
                  name: "product xx",
                  type: "number",
                },
                {
                  name: "product yy",
                  type: "monetary",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Balance sheet",
      children: [
        {
          name: "",
          sections: [
            {
              name: "Revenue BS",
              items: [
                {
                  name: "product x BS",
                  type: "number",
                },
                {
                  name: "product y BS",
                  type: "number",
                },
                {
                  name: "product y BS product y BS",
                  type: "number",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Cashflow",
      children: [
        {
          name: "Cash Flow (CFO - CFI - CFF)",
          sections: [
            {
              name: "Cashflow 1",
              items: [
                {
                  name: "product x Cashflow",
                  type: "number",
                },
                {
                  name: "product y Cashflow",
                  type: "number",
                },
                {
                  name: "product y Cashflow product y Cashflow",
                  type: "number",
                },
              ],
            },
          ],
        },
        {
          name: "Uses & Sources of Cash Flow",
          sections: [
            {
              name: "Cashflow 2",
              items: [
                {
                  name: "product x Cashflow2",
                  type: "number",
                },
                {
                  name: "product y Cashflow2",
                  type: "number",
                },
                {
                  name: "product y Cashflow2 product y Cashflow2",
                  type: "number",
                },
              ],
            },
            {
              name: "Cashflow 3",
              items: [
                {
                  name: "product x Cashflow3",
                  type: "number",
                },
                {
                  name: "product y Cashflow3",
                  type: "number",
                },
                {
                  name: "product y Cashflow3 product y Cashflow3",
                  type: "number",
                },
              ],
            },
          ],
        },
        {
          name: "Net free cash flow",
          sections: [
            {
              name: "Cashflow 4",
              items: [
                {
                  name: "product x Cashflow4",
                  type: "number",
                },
                {
                  name: "product y Cashflow4",
                  type: "number",
                },
                {
                  name: "product y Cashflow4 product y Cashflow4",
                  type: "number",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Breakdowns",
      children: [
        {
          name: "",
          sections: [
            {
              name: "Breakdowns",
              items: [
                {
                  name: "product x Breakdowns",
                  type: "number",
                },
                {
                  name: "product y Breakdowns",
                  type: "number",
                },
                {
                  name: "product y Breakdowns product y Breakdowns",
                  type: "number",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "KPI's",
      children: [
        {
          name: "",
          sections: [
            {
              name: "KPI's",
              items: [
                {
                  name: "product x KPI's",
                  type: "number",
                },
                {
                  name: "product y KPI's",
                  type: "number",
                },
                {
                  name: "product y KPI's product y KPI's",
                  type: "number",
                },
              ],
            },
            {
              name: "KPI's2",
              items: [
                {
                  name: "product x KPI's2",
                  type: "number",
                },
                {
                  name: "product y KPI's2",
                  type: "number",
                },
                {
                  name: "product y KPI's2 product y KPI's2222",
                  type: "number",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
