import React, { useEffect } from "react";
import { Button, Flex, Grid, Modal } from "@mantine/core";

import "./style/QuickbooksErrors.css";
import { useState } from "react";

export const QuickbooksErrors = ({
  showModal,
  handleHideQuickbooksErrorModal,
  error = null,
}) => {
  // {
  //   title:'',
  //   text:'',
  // }
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (error) handleErrors();
  }, []);

  const handleErrors = () => {
    let errObj = {};
    if (error.detail) {
      if (error.detail === "Company with this name already exists.") {
        errObj.title = "Company already exists";
      } else if (error.detail === "Company with this ID already exists.") {
        errObj.title =
          "Sorry, This company is already associated with a different account";
      } else if (error?.detail === "Invalid period sequence.") {
        errObj.title = "Invalid Period";
        errObj.text =
          "Sorry, the data period is invalid check it and try again";
      } else if (
        [
          "Company has no data.",
          "Can't get company data.",
          "Can't get accounts detailed data.",
        ].includes(error.detail)
      ) {
        errObj.title = "Can't get data for this company";
        errObj.text =
          "Sorry there’s somthing wrong in company data check and try again";
      } else if (error?.detail === "Can't get tokens.") {
        errObj.title = "Something went wrong";
        errObj.text = "Please check your data and try again ";
      }
    } else {
      // this will appear in cases like:
      // --->   "state": [ "This field is required." ]
      // --->   "state": [ "Invalid state format." ]
      errObj.title = "Something went wrong";
      errObj.text = "Please check your data and try again ";
    }
    setContent(errObj);
  };

  return (
    <Modal
      opened={showModal}
      onClose={handleHideQuickbooksErrorModal}
      withCloseButton={false}
      centered
      radius={"20px"}
      size={"lg"}
    >
      <div className="Q_error" data-testid="Q_error__modal">
        <div>
          <p className="title1" data-testid="error_title">
            <i className="fa-solid fa-triangle-exclamation icon"></i>
            {content?.title}
          </p>
          <p className="title2" data-testid="error_text">
            {content?.text}
          </p>
        </div>
        <Flex align={"center"} justify={"center"} w="100%" mt="lg">
          <Button
            size="lg"
            radius={"md"}
            w={"200px"}
            className="confirm_btn "
            data-testid="confirm_btn "
            onClick={handleHideQuickbooksErrorModal}
          >
            Done
          </Button>
        </Flex>
      </div>
    </Modal>
  );
};
