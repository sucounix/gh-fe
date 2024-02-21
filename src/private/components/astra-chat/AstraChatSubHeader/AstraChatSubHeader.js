import React from "react";
import InitialTokens from "./InitialTokens";
import CreateNewSession from "./CreateNewSession";
import RechargeTokens from "./RechargeTokens";
import "./AstraChatSubHeader.scss";

function AstraChatSubHeader({
  threadId,
  isAstraTokensEnough,
  handleCreateNewSession,
}) {
  return (
    <div
      id="sub-header"
      className="astra__chat__subheader"
      data-testid="astra-chat-subheader"
    >
      {!threadId && isAstraTokensEnough ? <InitialTokens /> : null}

      {threadId && isAstraTokensEnough ? (
        <CreateNewSession handleCreateNewSession={handleCreateNewSession} />
      ) : null}

      {!isAstraTokensEnough ? <RechargeTokens /> : null}
    </div>
  );
}

export default AstraChatSubHeader;
