import React from "react";
import { Grid, TextInput, Textarea } from "@mantine/core";
import {
  types,
  aggregationsOptions,
  definitions,
} from "../component/SelectOptions";
import "../style/CreateKPI.scss";
import SingleDropdown from "../../../../../../components/single-level-dropdown/SingleDropdown";

const StepOne = ({ StepOneForm, kpiCategories }) => {
  return (
    <>
      <Grid justify="center" className="grid__half">
        <Grid.Col md={8} sm={12} mt={15}>
          <Grid>
            <Grid.Col span={4}>
              <TextInput
                label="KPI Name"
                name="name"
                radius={"md"}
                data-testid="name_input"
                {...StepOneForm.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <SingleDropdown
                data={types}
                form={StepOneForm}
                label="Unit of measurement"
                title={"Select a unit of measurement"}
                field={"type"}
                data-testid="type-input"
                optionLabel={"label"}
                optionValue={"value"}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <SingleDropdown
                data={kpiCategories}
                withAsterisk
                form={StepOneForm}
                label="Category"
                title={"Select a group"}
                field={"group"}
                data-testid="group_input"
                optionLabel={"label"}
                optionValue={"value"}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Textarea
                label="KPI Description"
                radius={"md"}
                placeholder="KPI Description"
                data-testid="desc_input"
                {...StepOneForm.getInputProps("description")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <SingleDropdown
                data={aggregationsOptions}
                form={StepOneForm}
                title={"Select aggregation"}
                field={"aggregation"}
                data-testid="aggregation_input"
                optionLabel={"label"}
                optionValue={"value"}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <SingleDropdown
                data={definitions}
                form={StepOneForm}
                title={"Select aggregation"}
                field={"definition"}
                data-testid="definition_input"
                optionLabel={"label"}
                optionValue={"value"}
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </>
  );
};
export default StepOne;
