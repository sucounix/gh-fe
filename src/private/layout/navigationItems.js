import React from "react";
export const defaultMenuItems = (companyId) => {
  return [
    {
      label: "Analysis",
      icon: <i className="fa-sharp fa-solid fa-chart-mixed"></i>,
      variant: "link",
      color: "secondary",
      available: true,
      url: `/company/${companyId}/analysis/financials`,
      children: [
        {
          icon: (
            <i
              className="closed__menu__icon fa-sharp fa-solid fa-coins"
              data-testid="Financials__icon"
            ></i>
          ),
          label: "Financials",
          variant: "link",
          color: "secondary",
          url: `/company/${companyId}/analysis/financials`,
        },
        {
          icon: (
            <i
              className="closed__menu__icon fa-regular fa-chart-user"
              data-testid="Segmentation__icon"
            ></i>
          ),
          label: "Segmentation Analysis",
          variant: "link",
          color: "secondary",
          url: `/company/${companyId}/analysis/segmentation-analysis`,
        },
        {
          icon: (
            <i
              className="closed__menu__icon fa-regular fa-chart-line"
              data-testid="Breakeven__icon"
            ></i>
          ),
          label: "Breakeven",
          variant: "link",
          color: "secondary",
          url: `/company/${companyId}/analysis/breakeven`,
        },
        {
          icon: (
            <i
              className="closed__menu__icon fa-solid fa-clipboard-list-check"
              data-testid="KPI__icon"
            ></i>
          ),
          label: "KPI",
          variant: "link",
          color: "secondary",
          url: `/company/${companyId}/analysis/kpi`,
        },
        {
          icon: (
            <i
              className="closed__menu__icon fa-solid fa-chart-mixed"
              data-testid="Trend__Analysis__icon"
            ></i>
          ),
          label: "Trend Analysis",
          variant: "link",
          color: "secondary",
          url: `/company/${companyId}/analysis/trend-analysis`,
        },
        {
          icon: (
            <i
              className="closed__menu__icon fa-sharp fa-solid fa-gear"
              data-testid="Analysis__Settings__icon"
            ></i>
          ),
          label: "Analysis Settings",
          variant: "link",
          color: "secondary",
          url: `/company/${companyId}/analysis/settings/`,
        },
      ],
    },
    {
      label: "Reports",
      icon: (
        <i
          className="fa-sharp fa-solid fa-chart-bar"
          data-testid="Reports__section__icon"
        ></i>
      ),
      variant: "link",
      color: "secondary",
      children: [
        {
          icon: (
            <i
              className="closed__menu__icon fa-solid fa-rectangle-list"
              data-testid="report__settings__icon"
            ></i>
          ),
          label: "Templates",
          variant: "link",
          color: "secondary",
          url: `/company/${companyId}/reports/`,
        },
      ],
      url: `/company/${companyId}/reports/`,
      available: true,
    },
    {
      label: "Forecast",
      icon: (
        <i
          className="fa-sharp fa-solid fa-chart-line"
          data-testid="Forecast__section__icon"
        ></i>
      ),
      variant: "link",
      color: "secondary",
      children: [],
      url: `/company/${companyId}/forecast/`,
      available: false,
    },
  ];
};
