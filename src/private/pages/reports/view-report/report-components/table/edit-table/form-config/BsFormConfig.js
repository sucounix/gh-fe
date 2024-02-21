import { FINANCIAL_STATEMENT_VIEWS } from "../../../../../../../../constant/financialStatment";
export const BsFormConfig = [
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
        type: "dropdown_single_level",
        name: "is_current",
        label: "Table View",
        options: [
          {
            label: "Current → Non Current",
            value: true,
          },
          {
            label: "Non Current → Current",
            value: false,
          },
        ],
      },
      {
        type: "toggle",
        name: "is_equity_first",
        smallText: true,
        options: [
          {
            label: "Assets = Equity + Liability",
            value: true,
          },
          {
            label: "Assets= Liability + Equity",
            value: false,
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
