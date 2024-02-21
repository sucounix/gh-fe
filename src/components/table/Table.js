import React from "react";
import RenderHeaders from "./component/RenderHeader";
import GroupTitle from "./component/GroupTitle";
import RenderRow from "./component/RenderRow";
import "./style/Table.scss";

const TableComponent = ({
  data,
  testIdSuffix,
  headerTestId,
  checkAlerts = false,
  neglectColourColumns = [],
  showCurrencyFlag = true,
}) => {
  return (
    <div className="table__wrapper ">
      <table
        className="table__style"
        data-testid={`table_component_${testIdSuffix}`}
      >
        <RenderHeaders
          columns={data.columns}
          headerTestId={headerTestId}
          showCurrencyFlag={showCurrencyFlag}
        />

        <tbody>
          {data.rows.length > 0 &&
            data.rows.map((group, groupIndex) => {
              return (
                <>
                  {group.row.columns.length > 0 && (
                    <GroupTitle
                      columns={group.row.columns}
                      testIdSuffix={testIdSuffix}
                      groupIndex={groupIndex}
                    />
                  )}
                  {group.row.rows.map((singleRow, singleRowIndex) => {
                    return (
                      <RenderRow
                        singleRow={singleRow}
                        groupName={
                          group.row.columns.length > 0
                            ? group.row.columns[0].col_data
                            : ""
                        }
                        testIdSuffix={testIdSuffix}
                        checkAlerts={checkAlerts}
                        rowType={singleRow.display_type}
                        singleRowIndex={singleRowIndex}
                        hasIndent={
                          group.row.columns.length > 0 &&
                          singleRowIndex !== group.row.rows.length - 1
                        }
                        neglectColourColumns={neglectColourColumns}
                        hasBorder={group.row.border}
                        isLastGroupRow={
                          singleRowIndex === group.row.rows.length - 1
                        }
                      />
                    );
                  })}
                </>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
