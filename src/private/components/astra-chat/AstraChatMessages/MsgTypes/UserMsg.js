import React from "react";
import { motion } from "framer-motion";

const UserMsg = ({ entry, index }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      key={index}
      className={`astra__chat__message__body astra__chat__message astra__chat__message__user`}
      data-testid={`message-body-${index}`}
    >
      <div className="message__content" data-testid="message-content">
        <span className="astra__chat__message">
          <span data-testid="message-text">
            {entry.message && entry.message}
          </span>
        </span>
      </div>
    </motion.div>
  );
};

export default UserMsg;
