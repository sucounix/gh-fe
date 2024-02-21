import React from "react";
import "./ComingSoon.css";
import comingSoonImage from "../../../assets/images/coming__soon.png";
import rocketGIF from "../../../assets/images/rocket.gif";

function ComingSoon() {
  return (
    <div className="coming__soon__wrapper" data-testid="coming__soon__wrapper">
      <img src={comingSoonImage} alt="coming soon" />
      <span className="coming__soon__title">Coming Soon</span>
      <span className="coming__soon__subtitle">
        Stay tuned to uncover valuable insights through Femto{" "}
      </span>
      <img src={rocketGIF} alt="rocket" className="rocket__gif" />
    </div>
  );
}

export default ComingSoon;
