import { Divider } from "@mantine/core";
import React from "react";
import emptySectionImage from "../../../../../../../assets/images/empty-section.svg";

function EmptyWaterfallView() {
  return (
    <div>
      <div
        className="empty__waterfall__section"
        data-testid="emptyWaterfallView"
      >
        <img src={emptySectionImage} alt="empty section" />
        <div className="empty__waterfall__text">
          <span>No data to show</span>
          <span>No data to be shown for the cashflow waterfall</span>
        </div>
      </div>
    </div>
  );
}

export default EmptyWaterfallView;
