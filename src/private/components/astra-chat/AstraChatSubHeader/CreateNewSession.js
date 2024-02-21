import React from "react";
import { motion } from "framer-motion";

const CreateNewSession = ({ handleCreateNewSession }) => {
  return (
    <div
      className="create__new__session"
      data-testid="create__new__session"
      onClick={handleCreateNewSession}
    >
      <motion.div
        whileTap={{
          scale: 0.95,
        }}
        className="new__session__button"
        data-testid="new__session__button"
      >
        <i className="fa-solid fa-plus"></i>
        Create new chat session
      </motion.div>
    </div>
  );
};

export default CreateNewSession;
