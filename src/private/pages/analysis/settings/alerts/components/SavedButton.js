import React, { useContext } from "react";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const SavedButton = ({ submitLoading, variableForm, fixedForm }) => {
  return (
    <Button
      className="save__changes__btn"
      style={{ marginTop: 10 }}
      data-testid="save-changes-btn"
      fullWidth
      type="submit"
      disabled={
        Object.keys(fixedForm.errors).length > 0 ||
        Object.keys(variableForm.errors).length > 0
      }
      loading={submitLoading}
    >
      <span>Save Changes</span>
    </Button>
  );
};

export default SavedButton;
