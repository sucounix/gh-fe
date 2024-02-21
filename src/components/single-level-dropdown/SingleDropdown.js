import { Divider, Input, Popover } from "@mantine/core";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import "./style/singledropdown.scss";

function SingleDropdown({
  form,
  field,
  title,
  data,
  label,
  optionLabel,
  optionValue,
  onChange,
  value,
  placeholder = null,
  showLabel = true,
  ...rest
}) {
  const [opened, { close, open }] = useDisclosure(false);
  const [loaded, setLoaded] = useState(false);
  const [labelSelected, setLabelSelected] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef?.current && !wrapperRef?.current.contains(event.target)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useLayoutEffect(() => {
    if (form && form.values.hasOwnProperty(field) && data) {
      let selected = data.find(
        (item) => item[optionValue] === form.values[field]
      );
      if (selected) {
        setLabelSelected(selected[optionLabel]);
      }
    }
    setLoaded(true);
  }, [data]);

  useEffect(() => {
    if (value) setLabelSelected(value.label);
  }, [value]);

  return (
    <Popover
      opened={opened}
      position="bottom"
      width="target"
      transitionProps={{ transition: "pop" }}
      styles={{
        wrapper: {
          padding: 0,
        },
      }}
    >
      <Popover.Target>
        <div>
          {loaded && (
            <React.Fragment>
              {showLabel && label && (
                <Input.Label className="form_input">{label}</Input.Label>
              )}
              <>
                {showLabel && !label && field && (
                  <>
                    <Input.Label className="form_input">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Input.Label>
                  </>
                )}
              </>

              {form ? (
                <Input
                  {...rest}
                  component="span"
                  {...form.getInputProps(field)}
                  onClick={() => {
                    open();
                  }}
                  rightSection={
                    <i
                      onClick={() => {
                        open();
                      }}
                      className="fas fa-chevron-down"
                    ></i>
                  }
                >
                  <Input.Placeholder>
                    {placeholder && !labelSelected && !form.values[field] && (
                      <span>{placeholder}</span>
                    )}
                    <span style={{ color: "black" }}>
                      {labelSelected
                        ? labelSelected
                        : form.values[field]
                        ? form.values[field]
                        : null}
                    </span>
                  </Input.Placeholder>
                </Input>
              ) : (
                <Input
                  {...rest}
                  component="span"
                  defaultValue={value}
                  onClick={() => {
                    open();
                  }}
                  styles={{
                    input: {
                      minWidth: 250,
                    },
                  }}
                  rightSection={
                    <i
                      onClick={() => {
                        open();
                      }}
                      className="fas fa-chevron-down"
                    ></i>
                  }
                >
                  <Input.Placeholder>
                    <span
                      style={{ color: "black" }}
                      data-testid="dropdown_label"
                      className="dropdown_label"
                    >
                      {labelSelected ? labelSelected : null}
                    </span>
                  </Input.Placeholder>
                </Input>
              )}
              {form?.errors[field] ? (
                <Input.Error style={{ margin: "0.25rem 0" }}>
                  {form.errors[field]}
                </Input.Error>
              ) : null}
            </React.Fragment>
          )}
        </div>
      </Popover.Target>
      <Popover.Dropdown className="popover__dropdown_single_level">
        <div
          className="single__dropdown__menu"
          ref={wrapperRef}
          data-testid="target_dropdown"
        >
          {title && (
            <>
              <div className="single__dropdown__menu__header">
                <span>{title}</span>
              </div>
              <Divider style={{ marginBottom: "1rem" }} />
            </>
          )}

          {data &&
            data.map((item, index) => {
              return (
                <span
                  data-testid={`dropdown_option_${item.label}`}
                  onClick={() => {
                    if (!item?.disabled) {
                      if (onChange) {
                        onChange(item);
                        close();

                        return;
                      } else {
                        form && form.setFieldValue(field, item[optionValue]);
                        setLabelSelected(item[optionLabel]);
                        onChange && onChange(item);
                        close();
                      }
                    }
                  }}
                  className={
                    item?.disabled
                      ? "single__dropdown__menu__item__option disabled_item"
                      : (form && form.values[field] === item[optionValue]) ||
                        labelSelected === item[optionLabel]
                      ? "single__dropdown__menu__item__option single__dropdown__menu__item__option__active"
                      : "single__dropdown__menu__item__option"
                  }
                  key={item.code}
                >
                  {item.code && item.code + " - "} {item[optionLabel]}
                </span>
              );
            })}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

export default SingleDropdown;
