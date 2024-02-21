import { Button, Modal } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/StillProcessingModal.scss";

function StillProcessingModal({ opened, handleHideStillProcessing, url }) {
  const navigate = useNavigate();

  const closeFn = () => {
    handleHideStillProcessing();
    if (url) navigate(url);
  };
  return (
    <Modal
      opened={opened}
      onClose={closeFn}
      centered
      size="lg"
      radius={"md"}
      data-testid="Still_Processing_Modal"
    >
      <div className="StillProcessingModal__div">
        <p className="title">
          <i class="fa-solid fa-triangle-exclamation"></i>&nbsp; Calculating
          your data
        </p>
        <p className="desc">
          Just a few more moments and try again later, Your analytics are being
          calculated
        </p>
        <div className="btn__div">
          <Button data-testid="done_btn" onClick={closeFn}>
            <span className="done__btn">Done</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default StillProcessingModal;
