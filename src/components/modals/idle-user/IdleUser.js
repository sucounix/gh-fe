import { modals } from "@mantine/modals";
import React from "react";
import "./IdleUser.css";
import { Button, Flex } from "@mantine/core";

export function IdleUser() {
  modals.openConfirmModal({
    centered: true,
    radius: 20,
    size: "lg",
    withCloseButton: false,
    className: "idle__user_modal",
    children: (
      <div className="idle__user_content">
        <div>
          <p className="title">
            <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;Automatic
            logout
          </p>
          <p className="text">
            To ensure the safety of your data, your session has expired. Please
            login again.{" "}
          </p>
        </div>
        <Flex align={"center"} justify={"center"}>
          <Button
            size="lg"
            w={"50%"}
            className="confirm__btn"
            data-testid="confirm__btn"
            onClick={() => {
              modals.closeAll();
            }}
          >
            Ok
          </Button>
        </Flex>
      </div>
    ),
  });
}
