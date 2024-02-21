import React, { useContext } from "react";
import { Flex, NumberInput } from "@mantine/core";
import {
  handleCurrencyPrecision,
  handleCurrencySymbol,
} from "../../../../../../helpers/handleCurrency";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";
const FixedView = ({ form, kpiUnit, kpiName }) => {
  const { selectedCompany } = useContext(CompaniesContext);

  return (
    <Flex
      justify={"space-between"}
      className="fixed__values__wrapper__inner"
      align="center"
    >
      <span className="KPI__title">{kpiName}</span>
      <NumberInput
        data-testid="fixed_value"
        hideControls
        value={form?.values?.fixedValue}
        precision={handleCurrencyPrecision(selectedCompany.currency)}
        rightSection={
          kpiUnit === "Percentage" ? (
            <small>
              <span className="o__icon fa fa-percent"></span>
            </small>
          ) : kpiUnit === "Monetary" ? (
            <span style={{ fontSize: "0.8rem" }}>
              {handleCurrencySymbol(selectedCompany.currency)}
            </span>
          ) : null
        }
        onChange={(value) => {
          form.setFieldValue(`fixedValue`, value === "" ? 0 : value);
        }}
      />
    </Flex>
  );
};

export default FixedView;
