import React from "react";
import editLoader from "../../assets/images/reports-edit-loader.gif";
import { Flex } from "@mantine/core";
import "./style/FemtoDrawer.scss";

export default function FemtoDrawer({
  open,
  onClose,
  showOverlayLoader,
  children,
}) {
  return (
    open && (
      <div className="femto_drawer" data-testid="edit_drawer">
        <div className="content">
          <div className="overlay_part" onClick={() => onClose(false)}>
            {showOverlayLoader && (
              <Flex w="100%" h="100%" align={"center"} justify={"center"}>
                <img
                  src={editLoader}
                  alt="edit-loader"
                  className="edit_form_loader"
                />
              </Flex>
            )}
          </div>
          <div className="content_part">{children}</div>
        </div>
      </div>
    )
  );
}
