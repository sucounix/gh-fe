import React, { useEffect } from "react";
import astraChatHeaderIcon from "../../../../assets/images/astraChatHeaderIcon.svg";
import "./AstraChatHeader.scss";

function AstraChatHeader({ isHistoryOpen, setIsHistoryOpen }) {
  useEffect(() => {
    return () => {
      setIsHistoryOpen(false);
    };
  }, []);

  return (
    <div className="headerContainer">
      <img className="logo" src={astraChatHeaderIcon} />
      <div className="title">
        {!isHistoryOpen ? (
          <span>
            Have any Financial questions or want to know meaning for any
            financial terms. <span className="highlighted">ASTRA</span> got you
          </span>
        ) : (
          <span className="history">History</span>
        )}
      </div>
      <div className="action">
        {!isHistoryOpen ? (
          <div
            className="historyButton"
            onClick={() => setIsHistoryOpen(true)}
            data-testid="historyButton"
          >
            <i className="fa-solid fa-clock-rotate-left" />
            <span>History</span>
          </div>
        ) : (
          <div
            className="chatWithAstraButton"
            onClick={() => setIsHistoryOpen(false)}
            data-testid="chatWithAstraButton"
          >
            <i className="fa-solid fa-comments"></i>
            <span>Chat with Astra</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AstraChatHeader;
