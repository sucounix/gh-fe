import React, { useEffect, useRef } from "react";
import {
  ASTRA_MESSAGE_STATUS_FAILED,
  ROLE_ASSISTANT,
  ROLE_USER,
} from "../../../../constant/astraChat";
import AssistantLoadingMsg from "./MsgTypes/AssistantLoadingMsg";
import UserMsg from "./MsgTypes/UserMsg";
import AssistantMsg from "./MsgTypes/AssistantMsg";
import FailedUserMsg from "./MsgTypes/FailedUserMsg";

function AstraChatMessages({ conversation, isAssistantLoading }) {
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messagesRef, conversation]);

  return (
    <div
      className="astra__chat__messages"
      data-testid="astra-chat-messages"
      ref={messagesRef}
    >
      {conversation?.length && conversation?.length > 0
        ? conversation.map((entry, index) => (
            <>
              {entry?.role === ROLE_USER ? (
                entry?.status === ASTRA_MESSAGE_STATUS_FAILED ? (
                  <FailedUserMsg entry={entry} index={index} />
                ) : (
                  <UserMsg entry={entry} index={index} />
                )
              ) : null}

              {entry?.role === ROLE_ASSISTANT ? (
                <AssistantMsg entry={entry} index={index} />
              ) : null}
            </>
          ))
        : null}

      {isAssistantLoading ? <AssistantLoadingMsg /> : null}
    </div>
  );
}

export default AstraChatMessages;
