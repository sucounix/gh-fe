import { Button, Divider, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import SingleDropdown from "../../../../../../components/single-level-dropdown/SingleDropdown";
import { useForm } from "@mantine/form";
import ReportTimeframeSelect from "../../../../../../components/report-timeframe-select/ReportTimeframeSelect";
import "./style/WaterfallReport.scss";
import axios from "axios";
import { handleResponseError } from "../../../../../../utils/errorHandling";

function EditWaterfallReport({
  setOpenEditDrawer,
  loading,
  item,
  setLoading,
  handleNewItemInReportDetails = { handleNewItemInReportDetails },
}) {
  const editwaterfallForm = useForm({
    validate: (values) => {
      const errors = {};

      if (!values.title) {
        errors.title = "Title is required";
      }

      if (values.title && values.title.length > 50) {
        errors.title = "Title must be less than 50 characters";
      }
      if (!values.frequency_period) {
        errors.frequency_period = "Time Period is required";
      }
      return errors;
    },
  });

  const waterfallViews = [
    {
      label: "Cash Flow (CFO - CFI - CFF)",
      value: "Cash Flow (CFO - CFI - CFF)",
    },
    {
      label: "Uses & Sources of Cash Flow",
      value: "Uses & Sources of Cash Flow",
    },
    {
      label: "Net free cash flow",
      value: "Net free cash flow",
    },
  ];

  useEffect(() => {
    const { view_name } = item.chart_item.params;
    const { title, period, frequency_period, is_valid } = item.chart_item;

    editwaterfallForm.setValues({
      title,
      period: is_valid ? period : "",
      frequency_period: is_valid ? frequency_period : "",
      view_name,
    });
    editwaterfallForm.setDirty(false);
    editwaterfallForm.setTouched(false);
  }, [item]);

  const update = (values) => {
    setLoading(true);

    const updatedReq = {
      type: "waterfall",
      frequency_period: values.frequency_period,
      period: values.period,
      title: values.title,
      params: {
        is_hide: "false",
        view_name: values.view_name,
      },
    };

    axios
      .put(`/report/chart_item/${item.chart_item.uuid}`, updatedReq)
      .then((res) => {
        handleNewItemInReportDetails(res.data);
      })
      .catch((e) => {
        handleResponseError(e);
      })
      .finally(() => {
        setLoading(false);
        setOpenEditDrawer(false);
      });
  };

  return (
    <div className="edit__waterfall__drawer">
      <form onSubmit={editwaterfallForm.onSubmit(update)}>
        <div className="edit__waterfall__drawer">
          <div className="edit__wrapper">
            <div className="edit__waterfall__title">
              <span>Edit Cash Flow Waterfall</span>
            </div>
            <div className="chart__view__wrapper">
              <div className="chart__view__title">Chart View</div>
              <TextInput
                className="chart__view__input"
                label="Chart title"
                {...editwaterfallForm.getInputProps("title")}
                data-testid="title_input"
              />
              <SingleDropdown
                data={waterfallViews}
                label={"Chart view"}
                form={editwaterfallForm}
                optionLabel="label"
                optionValue="value"
                field="view_name"
                data-testid="view_input"
                title="Chart view"
              />
            </div>
            <Divider />
            <div className="chart__time__wrapper">
              <div className="chart__time__title">Chart time period</div>
              <ReportTimeframeSelect
                form={editwaterfallForm}
                freqFormField={"frequency_period"}
                periodFormField={"period"}
              />
            </div>
          </div>

          <div className="edit__waterfall__buttons">
            <Button
              disabled={loading}
              data-testid="save_button"
              type="submit"
              size="lg"
              className="save__button"
              w="45%"
            >
              <span className="save__changes__button">Save Changes</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              size="lg"
              w="30%"
              onClick={() => {
                setOpenEditDrawer(false);
                editwaterfallForm.reset();
              }}
              disabled={loading}
            >
              <span className="cancel__btn">Cancel</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditWaterfallReport;
