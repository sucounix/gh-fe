import { Alert } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";
import "./style/FemtoAlert.scss";

function FemtoAlert({
  headline,
  caption,
  children,
  icon,
  side,
  state,
  captionLinkLabel,
  captionLinkUrl,
  ...rest
}) {
  const stateClasses = {
    success: "femto__alert__wrapper--success",
    error: "femto__alert__wrapper--error",
    warning: "femto__alert__wrapper--warning",
    notification: "femto__alert__wrapper--notification",
  };

  return (
    <Alert className={`femto__alert__${state}`} {...rest}>
      <div className={`femto__alert__wrapper ${state && stateClasses[state]}`}>
        <div className="femto__alert__main">
          <div className="femto__alert__header">
            <div className="femto__alert__icon">{icon}</div>
            <span className="femto__alert__caption">{caption}</span>
            {captionLinkUrl && captionLinkLabel && (
              <Link to={captionLinkUrl} className="femto__alert__link">
                {captionLinkLabel}
              </Link>
            )}
          </div>
          <span className="femto__alert__title">{headline}</span>
          {children && (
            <div className="femto__alert__children">{children} </div>
          )}
        </div>
        {side && <div className="femto__alert__side">{side}</div>}
      </div>
    </Alert>
  );
}

export default FemtoAlert;
