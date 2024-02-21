import React from "react";
import somethingwentwrong from "../../../assets/images/somethingwentwrong.png";
import { Button } from "@mantine/core";
import "./style/Error.scss";

function Error() {
  return (
    <div className="error_page__div" data-testid={"error-container"}>
      <div className="image__div">
        <img src={somethingwentwrong} alt="somethingwentwrong.png" />
      </div>
      <div>
        <h2 className="title">Sorry, Something went wrong</h2>
        <p className="text">Please go back and try again later</p>
        <Button
          className="btn"
          size="lg"
          fullWidth
          data-testid={"go-to-home"}
          onClick={() => {
            window.location.replace("/");
          }}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}

export default Error;
