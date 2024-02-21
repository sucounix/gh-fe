export const uploadData = {
  dates_periods: ["Jan 2020", "Feb 2020", "Mar 2020"], //# list of dates ["Q1 2020", "Q2 2020", ...]
  financial_data: {
    uuid: "0000 - 0000 - 0000 - 0000",
    data_source: "Excel", //# Excel or Quickbooks
    modified: "2020-01-01 20:10:06",
  },
  breakdown: {
    uuid: "0000 - 0000 - 0000 - 0000",
    modified: "2020-01-01 20:10:06",
    hasData: true,
  },
};
export const uploadDataQuickbooks = {
  dates_periods: ["Jan 2020", "Feb 2020", "Mar 2020"], //# list of dates ["Q1 2020", "Q2 2020", ...]
  financial_data: {
    uuid: "0000 - 0000 - 0000 - 0000",
    data_source: "Quickbooks", //# Excel or Quickbooks
    modified: "2020-01-01 20:10:06",
    periodically_update: 5,
  },
  breakdown: {
    uuid: "0000 - 0000 - 0000 - 0000",
    modified: "2020-01-01 20:10:06",
    hasData: true,
  },
};

export const listOfYearsKPIs = {
  timeframe: ["2021/2022", "2022/2023", "2023/2024"],
};

export const kpiData = {
  headers: ["Jan 2020", "Feb 2020", "Mar 2020", "Apr 2020", "May 2020"], //# list of dates ["Q1 2020", "Q2 2020", ...]
  kpis: [
    {
      name: "Non financial KPI 1",
      uuid: "0000 - 0000 - 0000 - 0000",
      unit: "Value", // # one of the units ["Value", "Percentage", "Days", "Multiples", "Custom"]
      values: [
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
      ],
    },
    {
      name: "Non financial KPI 2",
      uuid: "0000 - 0000 - 0000 - 0000",
      unit: "%", // # one of the units ["Value", "Percentage", "Days", "Multiples", "Custom"]
      values: [
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
      ],
    },
    {
      name: "Non financial KPI 3",
      uuid: "0000 - 0000 - 0000 - 0000",
      unit: "%", // # one of the units ["Value", "Percentage", "Days", "Multiples", "Custom"]
      values: [
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
        {
          uuid: "b447f88e-200f-43b2-971c-fec227033be8",
          kpi: "e209e9b7-c674-458c-813b-3a48d4e0d799",
          date: "2022-01-28",
          value: 55.0,
        },
      ],
    },
  ],
};
