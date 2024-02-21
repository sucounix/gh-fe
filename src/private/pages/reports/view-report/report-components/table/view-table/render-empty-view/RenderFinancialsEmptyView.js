import React, { useContext } from "react";
import { Table } from "@mantine/core";
import { CompanyPreferencesApiContext } from "../../../../../../../../contexts/CompanyPreferencesApi";
import "./style/RenderEmptyView.scss";

const RenderFinancialsEmptyView = ({ data }) => {
  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);

  return (
    <div>
      <Table className="empty__table__style">
        {data.headers && (
          <thead>
            <tr className="">
              {data.columns.map((header, headerIndex) => {
                return (
                  <td
                    className={
                      headerIndex === 0
                        ? "sticky__header__empty"
                        : "header__td__empty"
                    }
                    data-testid={
                      headerIndex === 0
                        ? `header_PL_${companyPreferencesApi.viewPL?.testId}`
                        : null
                    }
                  >
                    <div className={"header_style"}>{header.col_data}</div>
                  </td>
                );
              })}
            </tr>
          </thead>
        )}
      </Table>
      <div className="seg_empty_content">
        <p className="text">No Data to show</p>
      </div>
    </div>
  );
};

export default RenderFinancialsEmptyView;
