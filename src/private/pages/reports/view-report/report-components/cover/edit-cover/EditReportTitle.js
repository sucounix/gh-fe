import React from "react";
import { ColorInput, TextInput } from "@mantine/core";
import "./style/EditCover.scss";

const EditReportTitle = ({ form }) => {
  return (
    <div className="edit__report__title">
      <TextInput
        label="Report Title"
        className="title__input"
        data-testid="report_title"
        {...form.getInputProps("report_title")}
      />
      <ColorInput
        label="Choose color"
        withEyeDropper={false}
        data-testid="font_color_picker"
        {...form.getInputProps("fore_color")}
      />
    </div>
  );
};
export default EditReportTitle;
