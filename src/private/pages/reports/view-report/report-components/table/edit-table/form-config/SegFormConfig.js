export const SegFormConfig = [
  {
    title: "Table view",
    inputs: [
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
