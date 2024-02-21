import React, { useContext } from "react";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { Flex } from "@mantine/core";
import CurrencyFlag from "react-currency-flags";
import "../style/Table.scss";

const RenderHeaders = ({ columns, headerTestId, showCurrencyFlag }) => {
  const { selectedCompany } = useContext(CompaniesContext);

  return (
    <thead className="sticky_thead">
      <tr>
        {columns.map((header, headerIndex) => {
          return (
            <td
              className={headerIndex === 0 ? "stickyHeader" : "header__td"}
              data-testid={headerIndex === 0 ? headerTestId : null}
            >
              <div className={"header_style"}>
                <Flex align={"center"} justify={"space-between"} w="100">
                  <span>{header.col_data}</span>
                  {showCurrencyFlag && headerIndex === 0 && (
                    <Flex
                      align={"center"}
                      justify={"center"}
                      className="currency__div"
                      data-testid={`currency_div_${selectedCompany?.currency}`}
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
              </div>
            </td>
          );
        })}
      </tr>
    </thead>
  );
};
export default RenderHeaders;
