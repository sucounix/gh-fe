import React, { useState } from "react";
import { Button } from "@mantine/core";
import { Auth } from "aws-amplify";
import "./style/signin-with-microsoft.scss";
import msLogo from "../../../assets/images/microsoft-logo.svg";

function SigninWithMicrosoftButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    Auth.federatedSignIn({
      provider: "Microsoft",
    });
  };

  return (
    <Button
      onClick={handleLogin}
      loading={loading}
      size="md"
      fullWidth
      mb="md"
      data-testid="login_microsoft_btn"
      className="microsoft-btn"
      variant="white"
    >
      <img src={msLogo} alt="logo" />
      <span className="social__login">Microsoft</span>
    </Button>
  );
}
export default SigninWithMicrosoftButton;
