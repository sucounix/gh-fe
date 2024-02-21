import React from "react";

function AstraPredefinedQuestion({ question, sendMessage }) {
  return (
    <div
      className="question"
      data-testid="predefined-question"
      onClick={() => sendMessage(question)}
    >
      <span>{question}</span>
      <i
        className="fas fa-paper-plane"
        data-testid="predefined-question-icon"
      ></i>
    </div>
  );
}

export default AstraPredefinedQuestion;
