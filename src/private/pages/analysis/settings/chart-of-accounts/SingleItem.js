import React from "react";
import { createStyles, rem, Text, Button, Tooltip } from "@mantine/core";
import drag from "../../../../../assets/images/drag.png";
import DropdownTwoColumns from "../../../../components/dropdown-two-columns/DropdownTwoColumns";
import "./style/ChartOfAccounts.scss";

const useStyles = createStyles((theme) => ({
  item: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: `${rem(1)} solid ${theme.colors.gray[2]}`,
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    paddingLeft: `calc(${theme.spacing.xl} - ${theme.spacing.md})`, // to offset drag handle
    backgroundColor: theme.white,
    "&:hover": {
      background: "#F3F8F8",
    },
  },
  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
}));

const SingleItem = ({
  provided,
  snapshot,
  item,
  index,
  classificationData,
  classificationLoading,
  setCurrentItemChanged,
  handleNewClassifySelected,
  disabled,
}) => {
  const { classes, cx } = useStyles();

  return (
    <div
      className={cx(
        classes.item,
        disabled ? "disabled__section" : "single__item__account",
        {
          [classes.itemDragging]: snapshot.isDragging,
        }
      )}
      data-testid={`${item.name}_${index}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div {...provided.dragHandleProps} className={classes.dragHandle}>
        <img src={drag} alt="drag icon" />
      </div>
      <div className={"card"}>
        <div className="account__text__div">
          <Text className={"text"}>{item.name}</Text>
          {item.has_message && (
            <Tooltip
              label={`Please note, This account was originally classified as "${item.has_message}"`}
            >
              <div>
                <i className="fa-solid fa-triangle-exclamation icon__alert"></i>
              </div>
            </Tooltip>
          )}
        </div>
        <Text className={"classification"}>{item.classification}</Text>
      </div>
      <div className="buttonReclasifiy">
        <div className="add__metric__div">
          <DropdownTwoColumns
            classificationLoading={classificationLoading}
            handleNewClassifySelected={handleNewClassifySelected}
            labelComponent={
              <Button
                size="xs"
                radius="md"
                data-testid="reclassify__btn"
                onClick={() => {
                  setCurrentItemChanged(item);
                }}
              >
                Reclassify
              </Button>
            }
            data={classificationData}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
