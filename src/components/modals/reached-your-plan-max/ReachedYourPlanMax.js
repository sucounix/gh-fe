import React from "react";
import { modals } from "@mantine/modals";
import { Button, Flex } from "@mantine/core";

import "./style/ReachedYourPlanMax.css";

export function ReachedYourPlanMax() {
  modals.open({
    centered: true,
    radius: 20,
    size: "lg",
    withCloseButton: false,
    children: (
      <div className="reach_max" data-testid="reach__max__modal">
        <p className="title1">
          <span>
            <i class="fa-solid fa-triangle-exclamation"></i>
          </span>
          You have reached your max number of companies
        </p>
        <p className="title2">
          Sorry, You have reached your maximum number of companies. If you want
          to add more companies please upgrade your plan
        </p>
        <p className="title3">Would you like to upgrade your plan?</p>
        <Flex align={"center"} justify={"center"} w="100%">
          <Button
            size="lg"
            className="confirm_btn"
            onClick={() => {
              window.location.replace(
                "/organisation-settings/subscription-settings"
              );
            }}
          >
            Yes
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="cancel_btn"
            onClick={modals.closeAll}
          >
            Cancel
          </Button>
        </Flex>
      </div>
    ),
  });
}
