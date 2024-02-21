import { Button, Grid, Group, Radio, TextInput } from "@mantine/core";
import React from "react";
import NoResultsImg from "../../../../../../../assets/images/NoResultsVariables.png";

const VariableEntry = ({ index, item, addVariable }) => {
  return (
    <Grid.Col span={4}>
      <div className="dynamic__value">
        <div data-testid={`variable_${index}`}>
          <span className="dynamic__value__title">{item.label}</span>
          <span className="dynamic__value__category">
            {item.category && item.category}
          </span>
        </div>
        <Button
          onClick={() => {
            addVariable({
              label: item.label,
            });
          }}
          data-testid={`add_variable_${index}`}
        >
          <i className="fas fa-plus"></i>
          <span style={{ marginInlineStart: "0.5rem" }}> Add</span>
        </Button>
      </div>
    </Grid.Col>
  );
};

function FormulaVariables({
  setSearchText,
  dynamicValues,
  addVariable,
  setSelectedAddType,
  selectedAddType,
  searchFilter,
  setSearchFilter,
  searchText,
}) {
  return (
    <div className="formula__dynamic__values">
      <div className="dynamic__values__header">
        <span className="dynamic__values__title">
          Select a variable to include in the formula:
        </span>

        <TextInput
          icon={<i className="fas fa-search"></i>}
          name="dynamic_value"
          placeholder="Search for a variable"
          radius={"md"}
          size="xs"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          onKeyDown={() => {
            return;
          }}
          onKeyUp={() => {
            return;
          }}
        />
      </div>
      <div className="dynamic__values__tabs__wrapper">
        <div className="tabs">
          <div
            onClick={() => {
              setSearchFilter("all");
            }}
            className={
              searchFilter === "all"
                ? "tab__item tab__item_active"
                : "tab__item"
            }
          >
            All
          </div>
          <div
            onClick={() => {
              setSearchFilter("Profit & Loss");
            }}
            className={
              searchFilter === "Profit & Loss"
                ? "tab__item tab__item_active"
                : "tab__item"
            }
          >
            Profit & Loss
          </div>
          <div
            onClick={() => {
              setSearchFilter("Balance Sheet");
            }}
            className={
              searchFilter === "Balance Sheet"
                ? "tab__item tab__item_active"
                : "tab__item"
            }
          >
            Balance Sheet
          </div>
          <div
            onClick={() => {
              setSearchFilter("Cash Flow");
            }}
            className={
              searchFilter === "Cash Flow"
                ? "tab__item tab__item_active"
                : "tab__item"
            }
          >
            Cashflow
          </div>
        </div>
        <div>
          <Radio.Group
            name="current_previous"
            withAsterisk
            buttonStyle="solid"
            defaultValue="current"
            value={selectedAddType}
            onChange={(e) => {
              setSelectedAddType(e);
            }}
          >
            <Group m={10}>
              <Radio value="current" label="Use current period" />
              <Radio value="previous" label="Use previous period" />
            </Group>
          </Radio.Group>
        </div>
      </div>
      <div className="dynamic__values__content">
        <Grid
          container
          spacing={2}
          style={{
            margin: "0.4rem",
          }}
        >
          {searchText.length > 0 ? (
            <>
              {dynamicValues.filter((item) => {
                return item.label
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
              }).length > 0 ? (
                dynamicValues
                  .filter((item) => {
                    return item.label
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                  })
                  .map((item, index) => {
                    return (
                      <VariableEntry
                        index={index}
                        item={item}
                        addVariable={addVariable}
                      />
                    );
                  })
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    margin: "2rem",
                  }}
                >
                  <img src={NoResultsImg} />
                </div>
              )}
            </>
          ) : (
            <>
              {dynamicValues.length > 0 ? (
                dynamicValues.map((item, index) => {
                  return (
                    <VariableEntry
                      item={item}
                      addVariable={addVariable}
                      index={index}
                    />
                  );
                })
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    margin: "2rem",
                  }}
                >
                  <img src={NoResultsImg} />
                </div>
              )}
            </>
          )}
        </Grid>
      </div>
    </div>
  );
}

export default FormulaVariables;
