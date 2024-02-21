import React, { useState } from "react";
import { Button, Flex, TextInput } from "@mantine/core";
import axios from "axios";
import { useForm } from "@mantine/form";
import { handleResponseError } from "../../../../../../utils/errorHandling";
import "./style/SectionTitle.scss";

const EditSectionTitle = ({
  editHandlers,
  section,
  sectionIndex,
  reportDetails,
  setReportDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      title: section?.title,
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) errors.title = "This field can't be empty";
      if (values.title.length > 50)
        errors.title = "The maximum title length is 50 characters";
      return errors;
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);
    axios
      .put(`/report/section/${section.uuid}`, values)
      .then((res) => {
        let reportDetailsCopy = { ...reportDetails };
        reportDetailsCopy.sections[sectionIndex].title = res.data.title;
        setReportDetails({ ...reportDetailsCopy });
      })
      .catch((err) => {
        handleResponseError(err);
      })
      .finally(() => {
        setLoading(false);
        editHandlers.close();
      });
  };
  return (
    <div className="edit_section_title_div" data-testid="edit-section">
      <p className="title">Edit section title</p>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          w={"80%"}
          label="Section Title"
          data-testid="section_title"
          {...form.getInputProps("title")}
        />
        <Flex mt="lg" align={"center"} justify={"space-between"}>
          <Button
            w="45%"
            size="lg"
            type="submit"
            className="action_btn"
            data-testid="save_btn"
            loading={loading}
          >
            Save
          </Button>
          <Button
            w="45%"
            size="lg"
            variant="outline"
            className="action_btn"
            disabled={loading}
            onClick={() => editHandlers.close()}
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default EditSectionTitle;
