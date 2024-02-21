import React from "react";
import { Button } from "@mantine/core";

const SaveButton = ({ submitLoading }) => {
  return (
    <Button loading={submitLoading} data-testid="save_kpi_btn" type="submit">
      <span className="action__button">Save</span>
    </Button>
  );
};

export default SaveButton;
