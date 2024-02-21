import React from "react";
import { notifications } from "@mantine/notifications";
import verificationLoading from "../../../../assets/images/verificationFailed.gif";
import AuthPagesArt from "../../../components/auth-pages-art/AuthPagesArt";
import AuthFooter from "../../../components/auth-footer/AuthFooter";
import { Button } from "@mantine/core";
import ENFile from "./locales/en.json";
import { Auth } from "aws-amplify";
import "./index.scss";

export default function FailVerification({ email }) {
  const handleSendAgain = () => {
    Auth.resendSignUp(email)
      .then(() => {
        notifications.show({
          title: ENFile.success,
          message: ENFile.pleaseCheckMail,
          color: "green",
        });
      })
      .catch((err) =>
        notifications.show({
          title: ENFile.error,
          message: err?.message,
          color: "red",
        })
      );
  };

  return (
    <div className="container" data-testid="fail-verification-container">
      <AuthPagesArt />
      <AuthFooter />
      <div className="content">
        <img src={verificationLoading} width={200} alt="loading"></img>
        <h1 className="title">{ENFile.verificationExpired}</h1>
        <span className="desc">{ENFile.clickMessage}</span>

        <Button
          className="send__again__btn"
          size="md"
          radius="sm"
          onClick={handleSendAgain}
          data-testid="send-again-btn"
          style={{
            height: "3rem",
            padding: "0rem 4rem",
            marginTop: "1rem",
          }}
        >
          {ENFile.sendAgain}
        </Button>
      </div>
    </div>
  );
}
