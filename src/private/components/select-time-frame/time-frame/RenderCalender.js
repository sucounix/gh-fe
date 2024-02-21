import React from "react";
import { Grid, Flex } from "@mantine/core";

import "./TimeFrame.css";

const RenderCalender = ({
  calenderData, // months , quarters or semi_annuals
  frequency,
  selectedSecondPart,
  handleSelectedSecondPart,
}) => {
  return (
    <>
      <div className="date__title">
        {frequency === "month"
          ? "Select a month"
          : frequency === "quarter"
          ? "Select a quarter"
          : "Select a semi annual"}
      </div>
      <div className="option">
        <Grid px="md">
          {calenderData.map((item, item_index) => {
            return (
              <Grid.Col
                sm={frequency === "month" ? 4 : 12}
                key={item.name}
                onClick={() =>
                  item.status === "enabled" &&
                  handleSelectedSecondPart(item.name)
                }
                p={0}
                data-testid={`item_${item_index}`}
              >
                <Flex
                  align="center"
                  h="100%"
                  w="100%"
                  justify={frequency === "month" ? "center" : "flex-start"}
                  style={{
                    cursor: item.status === "disabled" && "not-allowed",
                  }}
                >
                  <div
                    className={
                      frequency === "month"
                        ? item.status === "disabled"
                          ? "disabled__item"
                          : selectedSecondPart &&
                            item.name === selectedSecondPart
                          ? " item selected__item"
                          : "item"
                        : item.status === "disabled"
                        ? "disabled__item2"
                        : selectedSecondPart && item.name === selectedSecondPart
                        ? "item2 selected__item2"
                        : "item2"
                    }
                  >
                    {item.name.substr(0, 3)}
                  </div>
                </Flex>
              </Grid.Col>
            );
          })}
        </Grid>
      </div>
    </>
  );
};

export default RenderCalender;
