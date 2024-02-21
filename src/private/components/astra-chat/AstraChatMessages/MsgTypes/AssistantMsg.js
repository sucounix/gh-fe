import React from "react";
import { motion } from "framer-motion";
import Markdown from "react-markdown";

const AssistantMsg = ({ entry, index }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      key={index}
      className={`astra__chat__message__body  astra__chat__message astra__chat__message__astra
      `}
      data-testid={`message-body-${index}`}
    >
      <div className="message__content" data-testid="message-content">
        <span className="astra__chat__message">
          <span data-testid="message-text">
            {entry.message && <Markdown>{entry.message}</Markdown>}
          </span>
        </span>
      </div>
    </motion.div>
  );
};

export default AssistantMsg;
