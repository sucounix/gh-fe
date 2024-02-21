import React from "react";
import nonFinKPIIcon from "../../../../../../assets/images/finkpi.svg";
import { motion } from "framer-motion";
import { Grid, Radio } from "@mantine/core";

const RadioButton = ({ form }) => {
  return (
    <Radio.Group name="type" {...form.getInputProps("reference")}>
      <Grid>
        <Grid.Col span={6} className="grid__half">
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.4 }}
            data-testid="non_financial_kpi"
            onClick={() => {
              form.setFieldValue("reference", "Non-financial");
            }}
            className="kpi__toggle__option"
            style={{
              border:
                form.values.type === "non-fin" ? "1px solid #086972" : "none",
            }}
          >
            <Radio value="Non-financial" data-testid="non_fin_radio" />
            <img src={nonFinKPIIcon} alt="non financial kpi icon" />
            <div className="kpi__toggle__info">
              <span className="kpi__toggle__title">Non financial KPIs</span>
              <span className="kpi__toggle__subtitle">
                Create non-financial KPI and enter it’s data
              </span>
            </div>
          </motion.div>
        </Grid.Col>
        <Grid.Col span={6} className="grid__half">
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.4 }}
            data-testid="financial_kpi"
            onClick={() => {
              form.setFieldValue("reference", "Financial");
            }}
            className="kpi__toggle__option"
            style={{
              border: form.values.type === "fin" ? "1px solid #086972" : "none",
            }}
          >
            <Radio value="Financial" />
            <i
              className="fa-sharp fa-solid fa-calculator-simple"
              style={{ fontSize: "1.5rem", color: "#086972" }}
            ></i>
            <div className="kpi__toggle__info">
              <span className="kpi__toggle__title">Financial KPIs</span>
              <span className="kpi__toggle__subtitle">
                Create a financial KPI and define a formula for KPI calculation.
              </span>
            </div>
          </motion.div>
        </Grid.Col>
      </Grid>
    </Radio.Group>
  );
};

export default RadioButton;
