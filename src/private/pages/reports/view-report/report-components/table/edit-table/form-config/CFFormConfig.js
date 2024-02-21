import { FINANCIAL_STATEMENT_VIEWS_CF } from "../../../../../../../../constant/financialStatment";

export const CFFormConfig = [
  {
    title: "Table view",
    inputs: [
      {
        type: "dropdown_single_level",
        name: "view_name",
        label: "Table Type",
        options: FINANCIAL_STATEMENT_VIEWS_CF,
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
