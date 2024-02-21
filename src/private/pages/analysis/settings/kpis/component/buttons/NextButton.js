import React from "react";
import { Button } from "@mantine/core";

const NextButton = () => {
  return (
    <Button type="submit" data-testid="next_btn">
      <span className="action__button">Next</span>
    </Button>
  );
};
export default NextButton;
