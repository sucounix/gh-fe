import { checkIfBreakevenExists } from "../../../helpers/BreakevenHelper";

export const isAstraButtonEnabled = (item) => {
  if (item?.type === "chart") {
    if (item?.chart_item?.is_valid === false) {
      return false;
    } else {
      if (item?.chart_item?.type === "breakeven") {
        const { isExist } = checkIfBreakevenExists(
          item?.chart_item?.value?.data
        );
        if (isExist) {
          return true;
        } else {
          return false;
        }
      } else if (item?.chart_item?.type === "waterfall") {
        if (item?.chart_item?.value?.data?.rows?.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  } else if (item?.type === "table") {
    if (item?.table_item?.is_valid === false) {
      return false;
    } else {
      if (item?.table_item?.value?.rows?.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true;
  }
};
