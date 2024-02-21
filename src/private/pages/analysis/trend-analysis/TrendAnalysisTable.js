import React, { useContext, useEffect, useState } from "react";
import { Table, Flex } from "@mantine/core";
import { formatNumber } from "../../../helpers/NumberFormat";
import { formatPercentage } from "../../../helpers/PercentageFormat";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { CompanyPreferencesFilterContext } from "../../../../contexts/CompanyPreferencesFilter";
import CurrencyFlag from "react-currency-flags";
import {
  SOLVENCY,
  LIQUIDITY,
  CASH_CONVERSION_CYCLE,
} from "../../../../constant/TrendAnalysis";
import "./TrendAnalysisTable.scss";

const TrendAnalysisTable = ({ data, selectedPredefinedChartName = null }) => {
  const [tableHeader, setTableHeader] = useState([]);

  const { selectedCompany } = useContext(CompaniesContext);
  const { companyPreferencesFilter } = useContext(
    CompanyPreferencesFilterContext
  );

  useEffect(() => {
    handleDataHeader();
  }, [data]);

  const handleDataHeader = () => {
    if (data.length > 0) {
      // handle table headers
      let HeaderObj = Object.keys(data[0]);
      HeaderObj = HeaderObj.filter((header) => {
        if (header !== "name" && !header.includes("moving avg")) return header;
      });
      setTableHeader(HeaderObj);
    }
  };

  const rows = data.map((element) => (
    <tr key={element.name}>
      <td className="first__td" data-testid={`td_${element.name}`}>
        {element.name}
      </td>
      {tableHeader.length > 0 &&
        tableHeader.map((header) => {
          return (
            element[header] && (
              <td>
                <div className="td__style">
                  {element[header].type === "Number"
                    ? formatNumber(
                        element[header].value,
                        selectedCompany?.currency
                      )
                    : element[header].type === "Monetary"
                    ? formatNumber(
                        element[header].value,
                        selectedCompany.currency
                      )
                    : element[header].type === "Percentage"
                    ? formatPercentage(element[header].value)
                    : null}
                </div>
              </td>
            )
          );
        })}
    </tr>
  ));

  const checkIfContainsCurrency = () => {
    if (
      selectedPredefinedChartName &&
      [SOLVENCY, LIQUIDITY, CASH_CONVERSION_CYCLE].includes(
        selectedPredefinedChartName
      )
    ) {
      return false;
    }
    return true;
  };

  return (
    <Table data-testid="table_view" className="table__view">
      <thead>
        <tr>
          <th className="first__column">
            <Flex align={"center"} justify={"space-between"} w="100">
              <span>All periods</span>
              {checkIfContainsCurrency() && (
                <Flex
                  align={"center"}
                  justify={"center"}
                  className="currency__div"
                  data-testid={`currency__div_${selectedCompany?.currency}`}
                >
                  <CurrencyFlag
                    currency={selectedCompany?.currency}
                    size="md"
                  />
                  <span className="currency__unit">
                    {selectedCompany?.currency}
                  </span>
                </Flex>
              )}
            </Flex>
          </th>
          {tableHeader.length > 0 &&
            tableHeader.map((header) => {
              return (
                <th>
                  <div className="th__style" data-testid={`header_${header}`}>
                    {header}
                  </div>
                </th>
              );
            })}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default TrendAnalysisTable;
