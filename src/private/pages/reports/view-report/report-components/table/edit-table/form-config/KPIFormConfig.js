export const KPIFormConfig = [
  {
    title: "Table view",
    inputs: [
      {
        type: "dropdown_single_level",
        name: "view_name",
        label: "Show",
        options: [
          {
            label: "All KPIs",
            value: "all",
          },
          {
            label: "On track KPIs",
            value: "on_track",
          },
          {
            label: "Off track KPIs",
            value: "off_track",
          },
          {
            label: "KPIs with alerts",
            value: "alert",
          },
        ],
      },
      {
        type: "checkbox",
        name: "is_hide",
        label: "Hide budget column",
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
