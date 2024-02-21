import React from "react";
import loadingSpinner from "../../../../../assets/images/astra-chat-message-loading.gif";

const AssistantLoadingMsg = () => {
  return (
    <div>
      <span className="astra__assistant__loader">
        <img
          src={loadingSpinner}
          alt="loading"
          width={40}
          data-testid="loading-spinner"
        />
      </span>
    </div>
  );
};

export default AssistantLoadingMsg;
