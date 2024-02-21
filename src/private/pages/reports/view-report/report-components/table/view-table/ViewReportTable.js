import React, { useState, useContext, useEffect } from "react";
import TableComponent from "../../../../../../../components/table/Table";
import { handleBsData } from "./HandleBsData";
import {
  handleCurrencyPrecision,
  handleCurrencySymbol,
} from "../../../../../../helpers/handleCurrency";
import FemtoAlert from "../../../../../../../components/femto-alert/FemtoAlert";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";
import RenderSegEmptyView from "./render-empty-view/RenderSegEmptyView";
import { TimeFrameContext } from "../../../../../../../contexts/TimeFrameContext";
import RenderKpiEmptyView from "./render-empty-view/RenderKpiEmptyView";
import RenderFinancialsEmptyView from "./render-empty-view/RenderFinancialsEmptyView";
import {
  KPI_TABLE_TYPE,
  BALANCE_SHEET_TABLE_TYPE,
  SEGMENTATION_TABLE_TYPE,
  CASH_FLOW_TABLE_TYPE,
} from "../../../../../../../constant/ReportDetails";
import {
  PRICE_PER_UNIT,
  GROSS_MARKET_VALUE,
  PRICE_VOLUME_MIX_METRIC,
  REVENUE_SEG_METRIC,
} from "../../../../../../../constant/SegmentationsMetrics";
import {
  ANNUALIZED_RETURN_ANALYSIS,
  PERIODICAL_RETURN_ANALYSIS,
  ACTIVITY_ANALYSIS,
  PROFIT_AND_LOSS_CHANGES,
  BALANCE_SHEET_CHANGES,
} from "../../../../../../../constant/Kpi";
import {
  FINANCIAL_STATEMENT_VIEWS,
  FINANCIAL_STATEMENT_VIEWS_CF,
} from "../../../../../../../constant/financialStatment";
import "./style/ViewReportTable.scss";

const ViewReportTable = ({ data }) => {
  const [tableData, setTableData] = useState(null);
  const [totalAssetsNumbers, setTotalAssetsNumber] = useState(0);
  const [totalEquPlusLibNumber, setTotalEquPlusLibNumber] = useState(0);
  // if the common size of total (equity and liabilties) not equal the common size of total assets
  const [wrongNumbersFlag, setWrongNumbersFlag] = useState(false);

  const { selectedCompany } = useContext(CompaniesContext);
  const { timeFrameResult } = useContext(TimeFrameContext);

  useEffect(() => {
    if (data.table_item.type === BALANCE_SHEET_TABLE_TYPE) {
      // if their is no data , No need to handle the views
      if (data.table_item.value.rows.length === 0) {
        setTableData(data.table_item.value);
        return;
      }

      let dataHandled = handleBsData(data);

      setTotalAssetsNumber(dataHandled.totalAssetsNumber);
      setTotalEquPlusLibNumber(dataHandled.totalEquPlusLibNumber);
      setTableData({
        columns: dataHandled.columns,
        headers: dataHandled.headers,
        rows: dataHandled.rows,
      });
    } else if (data.table_item.type === KPI_TABLE_TYPE) {
      const KPIsViews = {
        all: "All",
        on_track: "On Track",
        off_track: "Off Track",
        alert: "Alert",
      };
      let copyData = { ...data };
      // the KPI table has a special case in the header at the first cell
      // in analysis==> KPIs
      // in reports ==> KPIs (${view_name})
      // this view name could be one of {KPIsViews} object
      copyData.table_item.value.columns[0] = {
        col_data: `KPIs  (${
          KPIsViews[copyData.table_item.value.headers.view_name]
        })`,
      };
      setTableData(copyData.table_item.value);
    } else {
      setTableData(data.table_item.value);
    }
  }, [data]);

  useEffect(() => {
    if (totalAssetsNumbers && totalEquPlusLibNumber) {
      setWrongNumbersFlag(
        Math.abs(totalAssetsNumbers - totalEquPlusLibNumber) > 0.01
      );
    }
  }, [totalAssetsNumbers, totalEquPlusLibNumber]);

  const calculateTheDifference = () => {
    return (totalAssetsNumbers - totalEquPlusLibNumber).toFixed(
      handleCurrencyPrecision(selectedCompany.currency)
    );
  };

  const wrongNumbers = () => {
    return (
      wrongNumbersFlag && (
        <FemtoAlert
          data-testid="wrong__credentials"
          state="warning"
          icon={<i className="fa-solid fa-triangle-exclamation"></i>}
          caption={`The sum of the “Liabilities” and “Equity” is not equal to the “Assets”, and the difference is "${handleCurrencySymbol(
            selectedCompany.currency
          )} ${calculateTheDifference()}" `}
        ></FemtoAlert>
      )
    );
  };

  const renderEmptyView = () => {
    if (data.table_item.type === KPI_TABLE_TYPE) return <RenderKpiEmptyView />;
    if (data.table_item.type === SEGMENTATION_TABLE_TYPE)
      return <RenderSegEmptyView data={data} />;
    else return <RenderFinancialsEmptyView data={data.table_item.value} />;
  };

  const isSegmentationMonetaryTable = (tableItem) => {
    if (
      tableItem.type === SEGMENTATION_TABLE_TYPE &&
      ![
        PRICE_PER_UNIT,
        GROSS_MARKET_VALUE,
        PRICE_VOLUME_MIX_METRIC,
        REVENUE_SEG_METRIC,
      ].includes(tableItem?.params?.view_name)
    ) {
      return false;
    }
    if (
      tableItem.type === KPI_TABLE_TYPE &&
      [
        ANNUALIZED_RETURN_ANALYSIS,
        PERIODICAL_RETURN_ANALYSIS,
        ACTIVITY_ANALYSIS,
        PROFIT_AND_LOSS_CHANGES,
        BALANCE_SHEET_CHANGES,
      ].includes(tableItem?.params?.view_type)
    ) {
      return false;
    }
    return true;
  };

  const handleTableHeaderTestId = (data) => {
    if (data.table_item.type === SEGMENTATION_TABLE_TYPE) {
      return `report_header_${data.table_item.type}_${data.table_item.params.view_name}`;
    }
    if (data.table_item.type === CASH_FLOW_TABLE_TYPE) {
      return `report_header_${data.table_item.type}_${
        FINANCIAL_STATEMENT_VIEWS_CF.filter((view) => {
          return view.value === data.table_item.params.view_name;
        })[0]?.label
      }`;
    }
    return `report_header_${data.table_item.type}_${
      FINANCIAL_STATEMENT_VIEWS.filter((view) => {
        return view.value === data.table_item.params.view_type;
      })[0]?.label
    }`;
  };

  return (
    <div className="table__container">
      <div className="table__container__content">
        {wrongNumbers()}

        {data && tableData && timeFrameResult ? (
          tableData.rows.length > 0 ? (
            <TableComponent
              data={tableData}
              testIdSuffix={data.table_item.type}
              headerTestId={handleTableHeaderTestId(data)}
              checkAlerts={data.table_item.type === KPI_TABLE_TYPE}
              neglectColourColumns={
                data.table_item.type === KPI_TABLE_TYPE ? [1, 2, 4] : []
              }
              showCurrencyFlag={isSegmentationMonetaryTable(data.table_item)}
            />
          ) : (
            renderEmptyView()
          )
        ) : null}
      </div>
    </div>
  );
};
export default ViewReportTable;
