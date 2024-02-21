import React, { useEffect } from "react";
import EditBackground from "./EditBackground";
import EditLogo from "./EditLogo";
import EditReportTitle from "./EditReportTitle";
import { Grid, Button, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { handleResponseError } from "../../../../../../../utils/errorHandling";
import "./style/EditCover.scss";

const EditCover = ({
  data,
  drawerHandlers,
  showOverlayLoader,
  setShowOverlayLoader,
  setReportDetails,
}) => {
  const form = useForm({
    validate: (values) => {
      const errors = {};
      if (!values.report_title) {
        errors.report_title = `This field can't be empty`;
      }
      if (values.report_title.length > 50) {
        errors.report_title = `The max length for the title is 50 characters`;
      }
      return errors;
    },
  });

  useEffect(() => {
    initForm();
  }, [data]);

  const initForm = () => {
    const { background_color, show_logo, report_title, fore_color } = data;
    let initialValues = {
      background_color,
      show_logo,
      report_title,
      fore_color,
    };
    form.setValues(initialValues);
    form.setDirty(false);
    form.setTouched(false);
  };

  const handleSubmit = (values) => {
    setShowOverlayLoader(true);

    axios
      .put(`/report/cover/${data.uuid}`, values)
      .then((res) => {
        setReportDetails((prev) => {
          return {
            ...prev,
            cover: res.data,
          };
        });
      })
      .catch((err) => {
        handleResponseError(err);
      })
      .finally(() => {
        drawerHandlers.close();
        setShowOverlayLoader(false);
      });
  };

  return (
    <div className="edit_cover">
      <p className="page__title">Edit Header</p>{" "}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <EditBackground form={form} currentColorValue={data.background_color} />
        <EditLogo form={form} logo={data.logo} />
        <EditReportTitle form={form} />
        <Grid className="btns__div">
          <Grid.Col xs="12">
            <Flex align={"center"} justify={"center"}>
              <Button
                size="lg"
                radius={6}
                type="submit"
                w={"50%"}
                data-testid="save_btn"
                className="save_btn"
                disabled={showOverlayLoader}
              >
                Save changes
              </Button>
              <Button
                ml="lg"
                size="lg"
                radius={6}
                variant="outline"
                className="cancel_btn"
                disabled={showOverlayLoader}
                onClick={() => {
                  drawerHandlers.close();
                  setShowOverlayLoader(false);
                }}
              >
                Cancel
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </form>
    </div>
  );
};

export default EditCover;
