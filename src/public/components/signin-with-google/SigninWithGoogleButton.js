import React, { useState } from "react";
import { Button } from "@mantine/core";
import "./style/signin-with-google.scss";
import googleLogo from "../../../assets/images/google-logo.svg";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

const SigninWithGoogleButton = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
  };

  return (
    <Button
      onClick={handleLogin}
      loading={loading}
      size="md"
      fullWidth
      className="google-btn"
      variant="white"
      mb="md"
      mt="md"
      data-testid="login_google_btn"
    >
      <img src={googleLogo} alt="logo" />
      <span className="social__login">Google</span>
    </Button>
  );
};

export default SigninWithGoogleButton;
