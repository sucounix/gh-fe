import { FINANCIAL_STATEMENT_VIEWS } from "../../../../../../../../constant/financialStatment";

export const PlFormConfig = [
  {
    title: "Table view",
    inputs: [
      {
        type: "dropdown_single_level",
        name: "view_type",
        label: "Table Type",
        options: FINANCIAL_STATEMENT_VIEWS,
      },
      {
        type: "toggle",
        name: "view_name",
        smallText: false,
        options: [
          {
            label: "Standard",
            value: "Standard",
          },
          {
            label: "EBITDA",
            value: "EBITDA",
          },
        ],
      },
      {
        type: "checkbox",
        name: "is_hide",
        label: "Hide same period last year",
      },
    ],
  },
  {
    title: "Table time period",
    inputs: [
      {
        type: "timeframe",
        freqFormFieldName: "frequency_period",
        periodFormFieldName: "period",
      },
    ],
  },
];
