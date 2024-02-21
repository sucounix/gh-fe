import React from "react";
import { Button, Flex, TextInput } from "@mantine/core";
import ReportTimeframeSelect from "../../../../components/report-timeframe-select/ReportTimeframeSelect";

const CreateReportSecondStep = ({
  form,
  setStep,
  createBtnLoading,
  handleCreateReport,
}) => {
  return (
    <div className="second__step__form" data-testid="create_step_two">
      <form onSubmit={form.onSubmit(handleCreateReport)}>
        <TextInput
          {...form.getInputProps("templateName")}
          disabled
          withAsterisk
          className="template__name"
          style={{ opacity: "1" }}
          data-testid="report_template_name"
        />
        <TextInput
          label="Report Title"
          placeholder="Enter the title"
          {...form.getInputProps("reportName")}
          className="input"
          data-testid="report_name"
        />
        <ReportTimeframeSelect
          form={form}
          freqFormField={"frequency_period"}
          periodFormField="period"
        />
        <Flex
          mt="lg"
          align={"center"}
          justify={"space-between"}
          className="btns_div"
        >
          <Button
            w={"48%"}
            variant="outline"
            size="lg"
            radius={6}
            onClick={() => {
              setStep(1);
            }}
          >
            Back
          </Button>
          <Button
            w={"48%"}
            size="lg"
            radius={6}
            type="submit"
            data-testid="submit_btn"
            loading={createBtnLoading}
          >
            Create
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default CreateReportSecondStep;
