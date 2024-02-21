import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { PlFormConfig } from "./form-config/PlFormConfig";
import { BsFormConfig } from "./form-config/BsFormConfig";
import { CFFormConfig } from "./form-config/CFFormConfig";
import { KPIFormConfig } from "./form-config/KPIFormConfig";
import { SegFormConfig } from "./form-config/SegFormConfig";
import { Checkbox, Grid, Button } from "@mantine/core";
import SingleDropdown from "../../../../../../../components/single-level-dropdown/SingleDropdown";
import InputTabsForm from "../../../../../../../components/input-tabs-form/InputTabsForm";
import ReportTimeframeSelect from "../../../../../../../components/report-timeframe-select/ReportTimeframeSelect";
import axios from "axios";
import "./style/EditReportTable.scss";
import { handleResponseError } from "../../../../../../../utils/errorHandling";

const EditReportTable = ({
  data,
  setOpenEditDrawer,
  setShowOverlayLoader,
  handleNewItemInReportDetails,
}) => {
  const [pageTitle, setPageTitle] = useState("");
  const [formConfig, setFormConfig] = useState([]);
  const form = useForm({
    validate: (values) => {
      let errors = {};

      if (!values.frequency_period) {
        errors.frequency_period = "Time Period is required";
      }

      return errors;
    },
  });

  useEffect(() => {
    handleFormConfig();
    handleInitialFormValues();
  }, [data]);

  const handleFormConfig = () => {
    switch (data.table_item.type) {
      case "Profit & Loss":
        setPageTitle("Edit profit & loss table");
        setFormConfig(PlFormConfig);
        break;
      case "Balance Sheet":
        setPageTitle("Edit Balance Sheet table");
        setFormConfig(BsFormConfig);
        break;
      case "Cash Flow":
        setPageTitle("Edit Cash Flow table");
        setFormConfig(CFFormConfig);
        break;
      case "KPIs":
        setPageTitle("Edit KPI table");
        setFormConfig(KPIFormConfig);
        break;
      case "Segmentation Analysis":
        setPageTitle(`Edit ${data.table_item.params.view_name} table`);
        setFormConfig(SegFormConfig);
        break;
      default:
        break;
    }
  };

  const handleInitialFormValues = () => {
    let initialValues = {
      type: data.table_item.type,
      frequency_period: data.table_item?.is_valid
        ? data.table_item.frequency_period
        : "",
      period: data.table_item?.is_valid ? data.table_item.period : "",
    };
    Object.assign(initialValues, data.table_item.params);
    form.setValues(initialValues);
    form.setDirty(false);
    form.setTouched(false);
  };

  const handleSubmit = (values) => {
    setShowOverlayLoader(true);
    const { type, frequency_period, period, ...params } = values;
    const dataReq = { type, frequency_period, period, params };

    axios
      .put(`/report/table_item/${data.table_item.uuid}`, dataReq)
      .then((res) => {
        handleNewItemInReportDetails(res.data);
        form.reset();
      })
      .catch((err) => {
        handleResponseError(err);
      })
      .finally(() => {
        setOpenEditDrawer(false);
        setShowOverlayLoader(false);
      });
  };
  const showInputsSection = (sectionIndex) => {
    // in case the table is segementation analysis
    // if the {is_hide = null} the input section shouldn't appear
    // because the input section has {is_hide} checkbox only
    if (
      data.table_item.type === "Segmentation Analysis" &&
      sectionIndex === 0 &&
      formConfig &&
      formConfig.length > 0
    ) {
      return form.getInputProps("is_hide").value !== null;
    }
    return true;
  };

  return (
    <div className="edit_table_container" data-testid="edit_table_container">
      <p className="page__title">{pageTitle}</p>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {formConfig &&
          formConfig.length > 0 &&
          formConfig.map((section, sectionIndex) => {
            return (
              showInputsSection(sectionIndex) && (
                <Grid
                  className={
                    sectionIndex === formConfig.length - 1 ? "last_section" : ""
                  }
                >
                  <p className="section__title">{section.title}</p>
                  {section.inputs.length > 0 &&
                    section.inputs.map((input, inputIndex) => {
                      return (
                        <Grid.Col xs="11">
                          {input.type === "dropdown_single_level" && (
                            <SingleDropdown
                              data={input.options}
                              form={form}
                              label={input.label}
                              title={"Select a unit of measurement"}
                              field={input.name}
                              data-testid={`${input.name}_dropdown`}
                              optionLabel={"label"}
                              optionValue={"value"}
                            />
                          )}
                          {input.type === "toggle" && (
                            <InputTabsForm
                              form={form}
                              inputName={input.name}
                              options={input.options}
                              smallText={input.smallText}
                            />
                          )}
                          {input.type === "checkbox" &&
                            form.getInputProps(input.name).value !== null && (
                              <Checkbox
                                radius="xs"
                                label={<span>{input.label}</span>}
                                data-testid={`${input.name}_checkbox`}
                                error={form.errors[input.name]}
                                {...form.getInputProps(input.name, {
                                  type: "checkbox",
                                })}
                              />
                            )}
                          {input.type === "timeframe" && (
                            <ReportTimeframeSelect
                              form={form}
                              freqFormField={input.freqFormFieldName}
                              periodFormField={input.periodFormFieldName}
                            />
                          )}
                        </Grid.Col>
                      );
                    })}
                  {sectionIndex != formConfig.length - 1 && (
                    <div className="section_seperator"></div>
                  )}
                </Grid>
              )
            );
          })}

        <div className="btns__div">
          <div className="btns__content">
            <Button
              size="lg"
              radius={6}
              type="submit"
              w={"45%"}
              data-testid="save_btn"
              className="save_btn"
            >
              Save changes
            </Button>
            <Button
              ml="lg"
              size="lg"
              radius={6}
              w={"30%"}
              variant="outline"
              className="cancel_btn"
              onClick={() => {
                setOpenEditDrawer(false);
                setShowOverlayLoader(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default EditReportTable;
