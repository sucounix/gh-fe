import React, { useState } from "react";
import { Flex } from "@mantine/core";
import "./AstraChatInput.scss";

const AstraChatInput = ({ handleSendMessage, disableConversation }) => {
  const [newMsg, setNewMsg] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!disableConversation && newMsg.length > 0) {
      handleSendMessage(newMsg);
      setNewMsg("");
    }
  };

  return (
    <Flex
      align={"center"}
      justify={"space-between"}
      id="input"
      className="astra__chat__input"
      data-testid="astra-chat-input-wrapper"
    >
      <input
        className="astra__chat__message__input"
        type="text"
        placeholder="Send a message"
        data-testid="astra-chat-input"
        value={newMsg}
        onChange={(e) => {
          setNewMsg(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <Flex
        align={"center"}
        justify={"center"}
        className={
          disableConversation ? "disable_send__icon send__icon" : "send__icon"
        }
        data-testid="send_msg_btn"
        onClick={handleSubmit}
      >
        <i className="fa-solid fa-paper-plane icon"></i>
      </Flex>
    </Flex>
  );
};

export default AstraChatInput;
