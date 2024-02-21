import { Button, Modal } from "@mantine/core";
import React from "react";
import "./style/ChartOfAccountAlreadyExists.scss";

function ChartOfAccountAlreadyExists({
  openAlreadyExistModal,
  setOpenAlreadyExistModal,
  accountNameAlreadyExist,
}) {
  return (
    <Modal radius={"lg"} opened={openAlreadyExistModal} centered>
      <div className="already__exist__modal">
        <p className="text1">
          <i class="fa-solid fa-triangle-exclamation"></i>&nbsp; Can’t move to
          other group
        </p>
        <p className="text2">
          {`Sorry There’s another account called "${accountNameAlreadyExist}" in this group`}
        </p>
        <div className="btn__div">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setOpenAlreadyExistModal(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ChartOfAccountAlreadyExists;
