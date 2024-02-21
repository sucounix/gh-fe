import {
  currentEquityView,
  nonCurrentEquityView,
  nonCurrentLiabilitiesView,
  currentLiabilitiesView,
} from "../../../../../../../shared-files/BalanceSheetViews";

export const handleBsData = (data) => {
  let renderedView = null;
  const isCurrent = data.table_item.params.is_current;
  const isEquityFirst = data.table_item.params.is_equity_first;

  switch (true) {
    case isCurrent && isEquityFirst:
      renderedView = renderViews(data, currentEquityView);
      break;
    case !isCurrent && isEquityFirst:
      renderedView = renderViews(data, nonCurrentEquityView);
      break;
    case isCurrent && !isEquityFirst:
      renderedView = renderViews(data, currentLiabilitiesView);
      break;
    case !isCurrent && !isEquityFirst:
      renderedView = renderViews(data, nonCurrentLiabilitiesView);
      break;
    default:
      break;
  }
  return renderedView;
};

const renderViews = (data, currentViews) => {
  const tempRows = [];
  let finalTable = {};
  let totalAssetsNumber = 0;
  let totalEquPlusLibNumber = 0;
  if (data.table_item.params.view_type === "Summary") {
    if (data.table_item.value.rows.length > 0) {
      for (let i = 0; i < currentViews.length; i++) {
        let matchedGroup = data.table_item.value.rows[0].row.rows.find(
          (group) => {
            if (group.row[0].col_data === currentViews[i]) {
              return group;
            }
          }
        );

        if (matchedGroup) {
          tempRows.push(matchedGroup);

          if (currentViews[i] === "Total Assets")
            totalAssetsNumber = matchedGroup.row[1].col_data;
          if (currentViews[i] === "Equity & Liabilities")
            totalEquPlusLibNumber = matchedGroup.row[1].col_data;
        }
      }
    }

    finalTable = {
      rows: [
        {
          row: {
            border: false,
            columns: [],
            rows: tempRows,
          },
        },
      ],
      columns: data.table_item.value.columns,
      headers: data.table_item.value.headers,
      totalAssetsNumber,
      totalEquPlusLibNumber,
    };
  } else {
    for (let i = 0; i < currentViews.length; i++) {
      let matchedGroup = data.table_item.value.rows.find((group) => {
        //normal group
        if (group.row.columns.length > 0) {
          if (group.row.columns[0].col_data === currentViews[i]) return group;
        } else {
          // total group
          if (group.row.rows[0].row[0].col_data === currentViews[i]) {
            return group;
          }
        }
      });
      if (matchedGroup) {
        if (currentViews[i] === "Total Assets")
          totalAssetsNumber = matchedGroup.row.rows[0].row[1].col_data;
        if (currentViews[i] === "Equity & Liabilities")
          totalEquPlusLibNumber = matchedGroup.row.rows[0].row[1].col_data;
        tempRows.push(matchedGroup);
      }
    }
    finalTable = {
      rows: tempRows,
      columns: data.table_item.value.columns,
      headers: data.table_item.value.headers,
      totalAssetsNumber,
      totalEquPlusLibNumber,
    };
  }
  return finalTable;
};
