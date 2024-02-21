import React, { useEffect, useState } from "react";
import { Radio, Group, ColorInput } from "@mantine/core";
import "./style/EditCover.scss";

const EditBackground = ({ form, currentColorValue }) => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    if (["#fff", "#ffff", "#ffffff"].includes(currentColorValue)) {
      setValue("no-fill");
    } else {
      setValue("fill");
    }
  }, [currentColorValue]);
  return (
    <div className="edit_background">
      <p className="background_section">Background color</p>
      <Radio.Group
        name="favoriteFramework"
        data-testid="background_fill"
        className="radio_group_background"
        value={value}
        onChange={(e) => {
          setValue(e);
          if (e === "no-fill") {
            form.setValues({
              background_color: "#fff",
            });
          }
        }}
      >
        <Group mt="xs">
          <Radio value="no-fill" label="No Fill" data-testid="no_fill" />
          <Radio value="fill" label="Fill" data-testid="fill" />
        </Group>
      </Radio.Group>
      {value === "fill" && (
        <ColorInput
          label="Choose color"
          withEyeDropper={false}
          data-testid="color_picker"
          {...form.getInputProps("background_color")}
        />
      )}
    </div>
  );
};

export default EditBackground;
