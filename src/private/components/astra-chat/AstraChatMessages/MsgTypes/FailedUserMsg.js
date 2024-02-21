import React from "react";
import { motion } from "framer-motion";

const FailedUserMsg = ({ entry, index }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      key={index}
      className={`astra__chat__message__body  astra__chat__message astra__chat__message__user
                  astra__chat__message astra__chat__message__failed`}
      data-testid={`failed-message-body-${index}`}
    >
      <div className="message__content" data-testid="message-content">
        <i
          className="error-icon fas fa-exclamation-circle"
          data-testid="failed-icon"
        />
        <span className="astra__chat__message">
          <span data-testid="message-text">
            {entry.message && entry.message}
          </span>
        </span>
      </div>

      <span className="message__footer">Sending failed.</span>
    </motion.div>
  );
};

export default FailedUserMsg;
