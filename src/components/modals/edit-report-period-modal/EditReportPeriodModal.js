import { Button, Modal } from "@mantine/core";
import React, { useState } from "react";
import "./style/EditReportPeriodModal.scss";
import EditReportGIF from "../../../assets/images/report-period-edit.gif";
import { useForm } from "@mantine/form";
import ReportTimeframeSelect from "../../report-timeframe-select/ReportTimeframeSelect";
import axios from "axios";
import { handleResponseError } from "../../../utils/errorHandling";

function EditReportPeriodModal({
  showEditReportPeriod,
  setShowEditReportPeriod,
  inEditReport,
  setInEditReport,
  setResponseData,
  setRecentReports,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editPeriodForm = useForm({
    validate: (values) => {
      const errors = {};
      if (!values.frequency_period) {
        errors.frequency_period = "Frequency period is required";
      }

      if (!values.period) {
        errors.period = "Period is required";
      }

      return errors;
    },
  });

  const updateReportPeriod = () => {
    setIsSubmitting(true);
    if (editPeriodForm.isValid()) {
      axios
        .put(`/report/reports/${inEditReport.uuid}`, editPeriodForm.values)
        .then((res) => {
          setResponseData((prev) => ({
            ...prev,
            items: prev.items.map((report) => {
              if (report.uuid === inEditReport.uuid) {
                return res.data;
              } else {
                return report;
              }
            }),
          }));
          setRecentReports((prev) =>
            prev.map((report) => {
              if (report.uuid === inEditReport.uuid) {
                return res.data;
              } else {
                return report;
              }
            })
          );

          setShowEditReportPeriod(false);
          setInEditReport(null);
        })
        .catch((e) => {
          handleResponseError(e, editPeriodForm);
        })
        .finally(() => setIsSubmitting(false));
    } else {
      setIsSubmitting(false);
    }
  };
  return (
    <Modal
      opened={showEditReportPeriod}
      onClose={() => setShowEditReportPeriod(false)}
      withCloseButton={false}
      radius={"20px"}
      size={"lg"}
      centered
      padding="0"
      className="edit__report__period__modal"
      data-testid="edit_report_period_modal"
    >
      <div className="modal__header">
        <img src={EditReportGIF} height="48" width="48" alt="edit report gif" />
        <div className="title">Edit report</div>
      </div>

      <div data-testid="modal-body" className="modal__body">
        <form
          onSubmit={editPeriodForm.onSubmit((values) =>
            updateReportPeriod(values)
          )}
        >
          <div className="modal__body__content">
            <ReportTimeframeSelect
              form={editPeriodForm}
              freqFormField={"frequency_period"}
              periodFormField="period"
            />
          </div>
        </form>
        <div data-testid="modal-footer" className="modal__footer">
          <Button
            data-testid="cancel-btn"
            className="cancel__btn"
            onClick={() => setShowEditReportPeriod(false)}
            w={"100%"}
            variant="outline"
            size="xl"
          >
            Back
          </Button>
          <Button
            className="cancel__btn"
            onClick={updateReportPeriod}
            w={"100%"}
            size="xl"
            disabled={!editPeriodForm.isValid()}
            loading={isSubmitting}
            data-testid="update_report_period_btn"
          >
            Update
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default EditReportPeriodModal;
