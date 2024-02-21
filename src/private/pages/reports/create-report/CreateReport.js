import React, { useState, useEffect, useContext } from "react";
import { Modal } from "@mantine/core";
import axios from "axios";
import CreateReportStepOne from "./CreateReportStepOne";
import CreateReportSecondStep from "./CreateReportSecondStep";
import ViewTemplateImage from "./ViewTemplateImage";
import Stepper from "../../../../components/stepper/Stepper";
import reportIcon from "../../../../assets/images/report.gif";
import { useForm } from "@mantine/form";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import "./style/CreateReport.scss";
import { handleResponseError } from "../../../../utils/errorHandling";

const CreateReport = ({
  showCreatePopup,
  setShowCreatePopup,
  createBtnLoading,
  handleCreateReport,
}) => {
  const [step, setStep] = useState(1);
  const [templateList, setTemplateList] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const { selectedCompany } = useContext(CompaniesContext);

  const form = useForm({
    initialValues: {
      template_ref: "",
      templateName: "",
      reportName: "",
      frequency_period: "",
      period: "",
    },

    validate: (values) => {
      const errors = {};
      if (values.reportName === "") {
        errors.reportName = "Report name cannot be empty";
      }
      if (!values.frequency_period) {
        errors.frequency_period = "Time Period cannot be empty";
      }
      if (!values.period) {
        errors.period = "Time frame cannot be empty";
      }
      return errors;
    },
  });

  useEffect(() => {
    fetchReortsTemplates();
  }, []);

  useEffect(() => {
    if (!showCreatePopup) {
      setStep(1);
      form.reset();
    }
  }, [showCreatePopup]);

  const fetchReortsTemplates = () => {
    axios
      .get("report/reports/template", {
        params: {
          company_uuid: selectedCompany?.uuid,
        },
      })
      .then((res) => {
        setTemplateList(res.data);
      })
      .catch((err) => {
        handleResponseError(err);
      });
  };

  return (
    <Modal
      opened={showCreatePopup}
      onClose={() => setShowCreatePopup(false)}
      radius={"lg"}
      size="40%"
      withCloseButton={false}
      padding={0}
    >
      {currentTemplate === null && (
        <div className="create__report__div" data-testid="create_modal">
          <div className="header">
            <img src={reportIcon} alt="reportIcon" className="reportIcon" />
            <p className="title">Create your report</p>
          </div>
          <div className="steps">
            <div className="stepper__div">
              <Stepper
                step={step}
                data={["Choose a template", "Report details"]}
              />
            </div>
            {step === 1 && (
              <CreateReportStepOne
                form={form}
                templateList={templateList}
                setStep={setStep}
                setCurrentTemplate={setCurrentTemplate}
                setShowCreatePopup={setShowCreatePopup}
              />
            )}
            {step === 2 && (
              <CreateReportSecondStep
                form={form}
                setStep={setStep}
                handleCreateReport={handleCreateReport}
                createBtnLoading={createBtnLoading}
              />
            )}
          </div>
        </div>
      )}
      {currentTemplate && (
        <ViewTemplateImage
          currentTemplate={currentTemplate}
          setCurrentTemplate={setCurrentTemplate}
        />
      )}
    </Modal>
  );
};
export default CreateReport;
