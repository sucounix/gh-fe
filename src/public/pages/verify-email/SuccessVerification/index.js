import React from "react";
import { useNavigate } from "react-router-dom";
import verificationLoading from "../../../../assets/images/verification-loading.gif";
import AuthPagesArt from "../../../components/auth-pages-art/AuthPagesArt";
import AuthFooter from "../../../components/auth-footer/AuthFooter";
import "./index.scss";
import { Button } from "@mantine/core";
import ENFile from "./locales/en.json";

function SuccessVerification() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <AuthPagesArt />
      <AuthFooter />
      <div className="content">
        <img src={verificationLoading} width={200} alt="loading" />
        <h1 className="title">{ENFile.verificationSuccessfully}</h1>

        <span className="disc">{ENFile.verificationDisc}</span>

        <Button
          className="go__login__btn"
          size="md"
          radius="sm"
          onClick={handleGoToLogin}
          data-testid="go-login-btn"
          style={{
            height: "3rem",
            padding: "0rem 4rem",
            marginTop: "1rem",
          }}
        >
          {ENFile.goToLogin}
        </Button>
      </div>
    </div>
  );
}

export default SuccessVerification;
