import React from "react";
import { Button } from "@mantine/core";

const BackButton = ({ setStep }) => {
  return (
    <Button variant="outline">
      <span
        onClick={() => {
          setStep(1);
        }}
        className="action__button"
        type="button"
        data-testid="back_kpi_btn"
      >
        Back
      </span>
    </Button>
  );
};

export default BackButton;
