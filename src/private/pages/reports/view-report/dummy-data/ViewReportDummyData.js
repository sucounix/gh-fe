import { PLResponse } from "./PLResponse";
import { BSResponse } from "./BSResponse";
import { CFResponse } from "./CFResponse";
import { KPIResponse } from "./KPIResponse";
import { SegResponse } from "./SegResponse";
import { PLResponseEmpty } from "./PLResponseEmpty";
import { BSResponseEmpty } from "./BSResponseEmpty";
import { CFResponseEmpty } from "./CFResponseEmpty";
import { KPIResponseEmpty } from "./KPIResponseEmpty";
import { SegResponseEmpty } from "./SegResponseEmpty";
import { TAResponse } from "./TAResponse";

export const data = {
  uuid: "f498f86d-dc26-4c48-b51b-5cad27c3679b",
  user_uuid: "4fdc30e9-d965-4089-94a6-a3d64707881f",
  company_uuid: "a41e9bb4-1c2d-4a38-a3d3-765cb77d4764",
  created: "2023-08-21T08:48:12",
  modified: "2023-08-22T08:48:12",
  frequency_period: "month", // ['month', 'quarter', 'semi-annual', 'annual']
  period: "Jan 2022",
  template_ref: "xyz-abc",
  title: "Monthly Key Performance Indicators Report (Jan 2022)",
  is_valid: true,
  cover: {
    show_logo: false,
    report_title: "Financial Statements (Write Up) Feb 2022",
    background_color: "#fff",
    fore_color: "#000",
    section_body:
      "                <h3>In this report, we present the monthly performance analysis for [Company Name].</h3>                <h3>This report includes:</h3>                <ol>                <li>Profit & Loss Summary,</li>                <li>Profit & Loss Statement,</li>                <li>Balance Sheet Summary,</li>                <li>Balance Sheet Statement,</li>                <li>Cash Flow Summary,</li>                <li>Cash Flow Statement</li>                </ol>                ",
    uuid: "53311df4-84c7-4eb0-a56e-577d28ae58ff",
    report_uuid: "2a83e711-cb2a-4191-a1b0-992d60ac115f",
    logo: "https://dev-api.femtofpa.com/media/60d6cf1b-919a-42c9-b3dc-c2d2ccb7b783/companies/Trade%20Corp%20LLC5%20edit%202/Trade_Corp_LLC5_edit_2..png",

    company_name: "ABC Corporation Ltd",
    period: "Feb 2022",
    published_on: "2023-09-27T16:37:51+03:00",
    published_by: "Karim Hady",
    created: "2023-09-27T16:37:51+03:00",
    modified: "2023-09-27T16:44:13.017004+03:00",
  },
  sections: [
    {
      uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
      report_uuid: "f498f86d-dc26-4c48-b51b-5cad27c3679b",
      priority: 1,
      created: "2023-08-21T08:48:12",
      modified: "2023-08-22T08:48:12",
      title: "Margins & Contribution Analysis",
      items: [
        {
          uuid: "e2897489-d4c2-4ad0-9021-3e34391b87b7",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 1,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "text",
          text_item: {
            uuid: "f512752b-09b4-44d3-a266-899d668357af",
            value: `<p>Text 1, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p>`,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Profit & Loss",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_type: "Summary", // ['Summary', 'Detailed', 'Management Account']
              view_name: "Standard", // ['Standard', 'EBITDA']
              is_hide: true,
            },
            is_valid: true,
            value: PLResponse,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Profit & Loss",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "month", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Jan 2022",
            params: {
              view_type: "Summary", // ['Summary', 'Detailed', 'Management Account']
              view_name: "Standard", // ['Standard', 'EBITDA']
              is_hide: true,
            },
            is_valid: true,
            value: PLResponseEmpty,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Balance Sheet",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_type: "Summary", // ['Summary', 'Detailed', 'Management Account']
              is_current: true,
              is_equity_first: true,
              is_hide: true,
            },
            is_valid: true,
            value: BSResponse,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Balance Sheet",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "month", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Jan 2022",
            params: {
              view_type: "Summary", // ['Summary', 'Detailed', 'Management Account']
              is_current: true,
              is_equity_first: true,
              is_hide: true,
            },
            is_valid: true,
            value: BSResponseEmpty,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Cash Flow",
            // ['Profit & Loss', 'Cash Flow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_name: "Cash Flow (CFO - CFI - CFF)",
              // ['Cash Flow (CFO - CFI - CFF)', 'Uses & Sources of Cash Flow', 'Net free cash flow']
              is_hide: true,
            },
            is_valid: true,
            value: CFResponse,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Cash Flow",
            // ['Profit & Loss', 'Cash Flow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "month", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Jan 2022",
            params: {
              view_name: "Cash Flow (CFO - CFI - CFF)",
              // ['Cash Flow (CFO - CFI - CFF)', 'Uses & Sources of Cash Flow', 'Net free cash flow']
              is_hide: true,
            },
            is_valid: true,
            value: CFResponseEmpty,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "KPIs",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_name: "all", //['all', 'on_track', 'off_track', 'alert']
              is_hide: true,
            },
            is_valid: true,
            value: KPIResponse,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "KPIs",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "month", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Jan 2022",
            params: {
              view_name: "all", //['all', 'on_track', 'off_track', 'alert']
              is_hide: true,
            },
            is_valid: true,
            value: KPIResponseEmpty,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Segmentation Analysis",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_name: "Revenue Segmentation", // ['all segmentation items ...']
              is_hide: true,
            },
            is_valid: true,
            value: SegResponse,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Segmentation Analysis",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2022",
            params: {
              view_name: "Revenue Segmentation", // ['all segmentation items ...']
              is_hide: false,
            },
            is_valid: true,
            value: SegResponseEmpty,
          },
        },
        {
          priority: 1,
          uuid: "a042defa-8bf8-4432-8d3c-86e7d4b6de3e",
          section_uuid: "86227864-b74b-456d-bb5f-46ec52747aa0",
          created: "2023-09-25T06:46:46.663988Z",
          modified: null,
          type: "chart",
          text_item: null,
          table_item: null,
          chart_item: {
            type: "trend_analysis",
            frequency_period: "month",
            period: "Sep 2022",
            title: "chart edit 1",
            params: {
              selected_chart: "Custom",
              show_table: true,
              show_data_info: true,
              charts: [
                {
                  uuid: "913d4039-f1ae-47df-9b08-e8e291442c99",
                  type: "Monetary",
                  name: "Retail",
                  is_kpi: false,
                  show_moving_average: true,
                  display_type: "line",
                },
              ],
            },
            is_valid: true,
            value: {
              data: {
                headers: [
                  "Jan 2022",
                  "Feb 2022",
                  "Mar 2022",
                  "Apr 2022",
                  "May 2022",
                  "Jun 2022",
                  "Jul 2022",
                  "Aug 2022",
                  "Sep 2022",
                ],
                charts: [
                  {
                    chart_uuid: "913d4039-f1ae-47df-9b08-e8e291442c99",
                    chart_name: "Retail",
                    type: "Monetary",
                    is_kpi: false,
                    color: "#af18dd",
                    values: [
                      {
                        key: "Jan 2022",
                        standard: 20000000.0,
                        moving_average: 20000000.0,
                      },
                      {
                        key: "Feb 2022",
                        standard: 22000000.0,
                        moving_average: 21000000.0,
                      },
                      {
                        key: "Mar 2022",
                        standard: 23000000.0,
                        moving_average: 21666666.666666668,
                      },
                      {
                        key: "Apr 2022",
                        standard: 24000000.0,
                        moving_average: 22250000.0,
                      },
                      {
                        key: "May 2022",
                        standard: 25000000.0,
                        moving_average: 22800000.0,
                      },
                      {
                        key: "Jun 2022",
                        standard: 26000000.0,
                        moving_average: 23333333.333333332,
                      },
                      {
                        key: "Jul 2022",
                        standard: 27000000.0,
                        moving_average: 23857142.85714286,
                      },
                      {
                        key: "Aug 2022",
                        standard: 28000000.0,
                        moving_average: 24375000.0,
                      },
                      {
                        key: "Sep 2022",
                        standard: 29000000.0,
                        moving_average: 24888888.888888888,
                      },
                    ],
                  },
                ],
              },
            },
            uuid: "1483c4f7-57ca-4bb8-8b12-df95e5945a85",
            item_uuid: "a042defa-8bf8-4432-8d3c-86e7d4b6de3e",
            created: "2023-09-25T06:46:46.663988Z",
            modified: "2023-09-26T17:39:57.870957Z",
          },
        },
        {
          uuid: "e2897489-d4c2-4ad0-9021-3e34391b87b7",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 1,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "text",
          text_item: {
            uuid: "f512752b-09b4-44d3-a266-899d668357af",
            value: `<p>Text 1, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p>`,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "0226",
            type: "Profit & Loss",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_type: "Summary", // ['Summary', 'Detailed', 'Management Account']
              view_name: "Standard", // ['Standard', 'EBITDA']
              is_hide: true,
            },
            is_valid: false,
            value: null,
          },
        },

        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Balance Sheet",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_type: "Summary", // ['Summary', 'Detailed', 'Management Account']
              is_current: true,
              is_equity_first: true,
              is_hide: true,
            },
            is_valid: false,
            value: null,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Cash Flow",
            // ['Profit & Loss', 'Cash Flow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_name: "Cash Flow (CFO - CFI - CFF)",
              // ['Cash Flow (CFO - CFI - CFF)', 'Uses & Sources of Cash Flow', 'Net free cash flow']
              is_hide: true,
            },
            is_valid: false,
            value: null,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "KPIs",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_name: "all", //['all', 'on_track', 'off_track', 'alert']
              is_hide: true,
            },
            is_valid: false,
            value: null,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Segmentation Analysis",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_name: "Revenue Segmentation", // ['all segmentation items ...']
              is_hide: true,
            },
            is_valid: false,
            value: null,
          },
        },
        {
          priority: 1,
          uuid: "a042defa-8bf8-4432-8d3c-86e7d4b6de3e",
          section_uuid: "86227864-b74b-456d-bb5f-46ec52747aa0",
          created: "2023-09-25T06:46:46.663988Z",
          modified: null,
          type: "chart",
          text_item: null,
          table_item: null,
          chart_item: {
            type: "trend_analysis",
            frequency_period: "month",
            period: "Sep 2022",
            title: "chart edit 1",
            params: {
              selected_chart: "Custom",
              show_table: true,
              show_data_info: true,
              charts: [
                {
                  uuid: "913d4039-f1ae-47df-9b08-e8e291442c99",
                  type: "Monetary",
                  name: "Retail",
                  is_kpi: false,
                  show_moving_average: true,
                  display_type: "line",
                },
              ],
            },
            is_valid: false,
            value: null,
            uuid: "1483c4f7-57ca-4bb8-8b12-df95e5945a85",
            item_uuid: "a042defa-8bf8-4432-8d3c-86e7d4b6de3e",
            created: "2023-09-25T06:46:46.663988Z",
            modified: "2023-09-26T17:39:57.870957Z",
          },
        },
        {
          priority: 1,
          uuid: "c72b795c-0755-4a5f-b1b5-d1c09df54be6",
          section_uuid: "82665962-097f-4043-a62f-661a400c0009",
          created: "2023-09-28T09:33:41.065444Z",
          modified: null,
          type: "chart",
          text_item: null,
          chart_item: {
            type: "waterfall",
            frequency_period: "quarter",
            period: "Q2 2022/2023",
            title: "Cash Flow Waterfall Presentation",
            params: {
              view_name: "Cash Flow (CFO - CFI - CFF)",
              is_hide: false,
            },
            is_valid: false,
            value: null,
          },
        },
        {
          priority: 2,
          uuid: "d081a25b-dc74-4eca-9175-6ceed64edec1",
          section_uuid: "a013ebff-c399-4917-97c2-a56b0d78dc30",
          created: "2023-09-28T09:34:49.031792Z",
          modified: null,
          type: "chart",
          text_item: null,
          chart_item: {
            type: "breakeven",
            frequency_period: "quarter",
            period: "Q2 2022/2023",
            title: "Break-even Chart",
            params: {
              account: "Revenues",
            },
            is_valid: false,
            value: null,
            uuid: "6afcb41a-21a6-4e55-b296-cd38405213be",
            item_uuid: "d081a25b-dc74-4eca-9175-6ceed64edec1",
            created: "2023-09-28T09:34:49.031792Z",
            modified: null,
          },
          table_item: null,
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "3e87ec67-a4c5-46dd-a53a-1d800be9d485",
            type: "Segmentation Analysis",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_name: "Clients Growth Analysis", // ['all segmentation items ...']
              is_hide: true,
            },
            is_valid: true,
            value: SegResponse,
          },
        },
      ],
    },
    // { add another section for  missing views    // }
  ],
};

export const validReportData = {
  uuid: "f498f86d-dc26-4c48-b51b-5cad27c3679b",
  user_uuid: "4fdc30e9-d965-4089-94a6-a3d64707881f",
  company_uuid: "a41e9bb4-1c2d-4a38-a3d3-765cb77d4764",
  created: "2023-08-21T08:48:12",
  modified: "2023-08-22T08:48:12",
  frequency_period: "month", // ['month', 'quarter', 'semi-annual', 'annual']
  period: "Jan 2022",
  template_ref: "xyz-abc",
  title: "Monthly Key Performance Indicators Report (Jan 2022)",
  is_valid: true,
  cover: {
    show_logo: false,
    report_title: "Financial Statements (Write Up) Feb 2022",
    background_color: "#fff",
    fore_color: "#000",
    section_body:
      "                <h3>In this report, we present the monthly performance analysis for [Company Name].</h3>                <h3>This report includes:</h3>                <ol>                <li>Profit & Loss Summary,</li>                <li>Profit & Loss Statement,</li>                <li>Balance Sheet Summary,</li>                <li>Balance Sheet Statement,</li>                <li>Cash Flow Summary,</li>                <li>Cash Flow Statement</li>                </ol>                ",
    uuid: "53311df4-84c7-4eb0-a56e-577d28ae58ff",
    report_uuid: "2a83e711-cb2a-4191-a1b0-992d60ac115f",
    logo: "https://dev-api.femtofpa.com/media/60d6cf1b-919a-42c9-b3dc-c2d2ccb7b783/companies/Trade%20Corp%20LLC5%20edit%202/Trade_Corp_LLC5_edit_2..png",

    company_name: "ABC Corporation Ltd",
    period: "Feb 2022",
    published_on: "2023-09-27T16:37:51+03:00",
    published_by: "Karim Hady",
    created: "2023-09-27T16:37:51+03:00",
    modified: "2023-09-27T16:44:13.017004+03:00",
  },
  sections: [
    {
      uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
      report_uuid: "f498f86d-dc26-4c48-b51b-5cad27c3679b",
      priority: 1,
      created: "2023-08-21T08:48:12",
      modified: "2023-08-22T08:48:12",
      title: "Margins & Contribution Analysis",
      items: [
        {
          uuid: "e2897489-d4c2-4ad0-9021-3e34391b87b7",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 1,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "text",
          text_item: {
            uuid: "f512752b-09b4-44d3-a266-899d668357af",
            value: `<p>Text 1, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p><p>In this report, we present the monthly performance analysis for [Company Name].
              This report includes:</p>`,
          },
        },
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "0226",
            type: "Profit & Loss",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_type: "Summary", // ['Summary', 'Detailed', 'Management Account']
              view_name: "Standard", // ['Standard', 'EBITDA']
              is_hide: true,
            },
            is_valid: false,
            value: null,
          },
        },
      ],
    },
  ],
};

export const inValidReportData = {
  uuid: "f498f86d-dc26-4c48-b51b-5cad27c3679b",
  user_uuid: "4fdc30e9-d965-4089-94a6-a3d64707881f",
  company_uuid: "a41e9bb4-1c2d-4a38-a3d3-765cb77d4764",
  created: "2023-08-21T08:48:12",
  modified: "2023-08-22T08:48:12",
  frequency_period: "month", // ['month', 'quarter', 'semi-annual', 'annual']
  period: "Jan 2022",
  template_ref: "xyz-abc",
  title: "Monthly Key Performance Indicators Report (Jan 2022)",
  is_valid: true,
  cover: {
    show_logo: false,
    report_title: "Financial Statements (Write Up) Feb 2022",
    background_color: "#fff",
    fore_color: "#000",
    section_body:
      "                <h3>In this report, we present the monthly performance analysis for [Company Name].</h3>                <h3>This report includes:</h3>                <ol>                <li>Profit & Loss Summary,</li>                <li>Profit & Loss Statement,</li>                <li>Balance Sheet Summary,</li>                <li>Balance Sheet Statement,</li>                <li>Cash Flow Summary,</li>                <li>Cash Flow Statement</li>                </ol>                ",
    uuid: "53311df4-84c7-4eb0-a56e-577d28ae58ff",
    report_uuid: "2a83e711-cb2a-4191-a1b0-992d60ac115f",
    logo: "https://dev-api.femtofpa.com/media/60d6cf1b-919a-42c9-b3dc-c2d2ccb7b783/companies/Trade%20Corp%20LLC5%20edit%202/Trade_Corp_LLC5_edit_2..png",

    company_name: "ABC Corporation Ltd",
    period: "Feb 2022",
    published_on: "2023-09-27T16:37:51+03:00",
    published_by: "Karim Hady",
    created: "2023-09-27T16:37:51+03:00",
    modified: "2023-09-27T16:44:13.017004+03:00",
  },
  sections: [
    {
      uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
      report_uuid: "f498f86d-dc26-4c48-b51b-5cad27c3679b",
      priority: 1,
      created: "2023-08-21T08:48:12",
      modified: "2023-08-22T08:48:12",
      title: "Margins & Contribution Analysis",
      items: [
        {
          uuid: "51fd509b-c9fd-4b06-afa5-5830600ffff6",
          section_uuid: "0d1567e0-7e63-4480-9f3d-13c3d18d0a53",
          priority: 3,
          created: "2023-08-21T08:48:12",
          modified: "2023-08-22T08:48:12",
          type: "table",
          table_item: {
            uuid: "0226",
            type: "Profit & Loss",
            // ['Profit & Loss', 'Cashflow', 'Balance Sheet', 'KPIs', 'Segmentation Analysis']
            frequency_period: "quarter", //['month', 'quarter', 'semi-annual', 'annual']
            period: "Q2 2021/2022",
            params: {
              view_type: "Summary", // ['Summary', 'Detailed', 'Management Account']
              view_name: "Standard", // ['Standard', 'EBITDA']
              is_hide: true,
            },
            is_valid: false,
            value: PLResponseEmpty,
          },
        },
      ],
    },
  ],
};

export const trendAnalysisReportChartItem = {
  type: "chart",
  chart_item: {
    is_valid: true,
    type: "trend_analysis",
    value: TAResponse,
  },
};
