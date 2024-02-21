import { Button, Flex } from "@mantine/core";
import React from "react";
import "./style/CreateReport.scss";
const CreateReportStepOne = ({
  form,
  templateList,
  setStep,
  setCurrentTemplate,
  setShowCreatePopup,
}) => {
  return (
    <div data-testid="create_step_one">
      <div className="list">
        <div className="title">Choose your template</div>
        {templateList.length > 0 &&
          templateList.map((template, index) => {
            return (
              <div
                data-testid={`template_${index}`}
                className={"list__item"}
                onClick={() => {
                  form.setValues({
                    template_ref: template.ref,
                    templateName: template.name,
                  });
                  setStep(2);
                }}
              >
                <span data-testid={`template_name_${index}`}>
                  {template.name}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTemplate(template);
                  }}
                  data-testid={`view_template_image_btn_${index}`}
                >
                  <i className="fa fa-eye icon"></i>
                </span>
              </div>
            );
          })}
      </div>
      <Flex align={"center"} justify={"center"}>
        <Button
          w={"40%"}
          variant="outline"
          size="lg"
          className="cancel__btn"
          onClick={() => {
            setShowCreatePopup(false);
          }}
        >
          Cancel
        </Button>
      </Flex>
    </div>
  );
};
export default CreateReportStepOne;
