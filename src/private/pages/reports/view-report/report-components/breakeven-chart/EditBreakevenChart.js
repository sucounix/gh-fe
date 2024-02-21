import React, { useContext, useEffect, useState } from "react";
import "./style/BreakevenChart.scss";
import SingleDropdown from "../../../../../../components/single-level-dropdown/SingleDropdown";
import { Button, Divider, TextInput } from "@mantine/core";
import ReportTimeframeSelect from "../../../../../../components/report-timeframe-select/ReportTimeframeSelect";
import { useForm } from "@mantine/form";
import axios from "axios";
import { CompaniesContext } from "../../../../../../contexts/CompaniesContext";
import { handleResponseError } from "../../../../../../utils/errorHandling";

function EditBreakevenChart({
  chartItem,
  setOpenEditDrawer,
  loading,
  setLoading,
  handleNewItemInReportDetails,
}) {
  const [accounts, setAccounts] = useState([]);

  const editBreakevenForm = useForm({
    validate: (values) => {
      const errors = {};
      if (!values.title) {
        errors.title = "Title is required";
      }
      if (!values.account) {
        errors.account = "Account is required";
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

  const { selectedCompany } = useContext(CompaniesContext);

  useEffect(() => {
    axios
      .get(`/analysis/breakeven/${selectedCompany.uuid}/`)
      .then((res) => {
        const accounts = res.data.map((item) => ({ label: item, value: item }));
        setAccounts(accounts);
      })
      .catch((e) => {
        handleResponseError(e, editBreakevenForm);
      });
    if (chartItem) {
      const { title, params, frequency_period, period, is_valid } = chartItem;
      editBreakevenForm.setValues({
        title,
        account: params.account,
        frequency_period: is_valid ? frequency_period : "",
        period: is_valid ? period : "",
      });
      editBreakevenForm.setDirty(false);
      editBreakevenForm.setTouched(false);
    }
  }, [chartItem, selectedCompany.uuid]);

  const update = (values) => {
    setLoading(true);

    const updatedReq = {
      type: "breakeven",
      title: values.title,
      params: {
        account: values.account,
      },
      frequency_period: values.frequency_period,
      period: values.period,
    };

    axios
      .put(`/report/chart_item/${chartItem.uuid}`, updatedReq)
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
    <div className="edit__breakeven__drawer">
      <form onSubmit={editBreakevenForm.onSubmit(update)}>
        <div className="edit__breakeven__drawer">
          <div className="edit__wrapper">
            <div className="edit__breakeven__title">Edit Chart</div>
            <div className="chart__view__wrapper">
              <div className="chart__view__title">Chart View</div>
              <TextInput
                className="chart__view__input"
                label="Chart title"
                {...editBreakevenForm.getInputProps("title")}
                data-testid="title_input"
              />
              <SingleDropdown
                data={accounts}
                label={"Breakeven view"}
                form={editBreakevenForm}
                optionLabel="label"
                optionValue="value"
                field="account"
                data-testid="account_input"
                title="Breakeven view"
              />
            </div>
            <Divider />
            <div className="chart__time__wrapper">
              <div className="chart__time__title">Chart time period</div>
              <ReportTimeframeSelect
                form={editBreakevenForm}
                freqFormField={"frequency_period"}
                periodFormField={"period"}
              />
            </div>
          </div>

          <div className="edit__breakeven__buttons">
            <Button
              disabled={loading}
              data-testid="save_button"
              type="submit"
              size="lg"
              w={"45%"}
            >
              <span className="save__changes__button">Save Changes</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              size="lg"
              w={"30%"}
              onClick={() => {
                setOpenEditDrawer(false);
                editBreakevenForm.reset();
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

export default EditBreakevenChart;
