/* istanbul ignore file */
import React from "react";
import { Loader } from "@mantine/core";

function Loading() {
  return (
    <div className="loading__overlay">
      <Loader size="" color="teal.9" radius="xl" shadow="md" />
    </div>
  );
}

export default Loading;
