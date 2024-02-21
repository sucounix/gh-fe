import { Button, Grid, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import AuthPagesArt from "../../components/auth-pages-art/AuthPagesArt";
import { handleResponseError } from "../../../utils/errorHandling";
import "./style/ForgetPassword.css";
import FemtoAlert from "../../../components/femto-alert/FemtoAlert";
import backgroundLogo from "../../../assets/images/small logo right.svg";
import AuthFooter from "../../components/auth-footer/AuthFooter";
import { Auth } from "aws-amplify";

function ForgetPassword() {
  /* 
        Stage 0: Form to enter email
        Stage 1: Email sent successfully
    */
  const [stage, setStage] = useState(0);
  const [loading, setLoading] = useState(false);

  const forgetPasswordForm = useForm({
    initialValues: {
      email: "",
    },

    validate: (values) => {
      const errors = {};

      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        values.email &&
        !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }

      return errors;
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);
    Auth.forgotPassword(values.email)
      .then(() => {
        setStage(1);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        handleResponseError(err, forgetPasswordForm, err.message);
      });
  };

  const handleReEnterEmail = () => {
    forgetPasswordForm.reset();
    setStage(0);
  };

  return (
    <form
      onSubmit={forgetPasswordForm.onSubmit((values) => handleSubmit(values))}
    >
      <img
        src={backgroundLogo}
        alt="background logo"
        className="background__logo"
      />
      <AuthFooter />
      {stage === 0 && (
        <div className="forgetpassword__page">
          <AuthPagesArt />

          <div className="forgetpassword__wrapper">
            <Grid
              justify="center"
              align="center"
              style={{
                height: "100%",
              }}
            >
              <Grid.Col span={4}>
                <h1 className="page__title">Reset Password</h1>
                <span className="text">
                  Enter your email address below and we'll send you a link to
                  reset your password.
                </span>

                <TextInput
                  placeholder="Your email"
                  label="Email"
                  size="md"
                  radius="md"
                  mb="md"
                  mt="md"
                  className="email__input"
                  data-testid="email_input"
                  errorProps={{
                    "data-testid": "email_input_error",
                  }}
                  {...forgetPasswordForm.getInputProps("email", {
                    required: true,
                  })}
                />

                <Button
                  type="submit"
                  variant="filled"
                  data-testid="reset-password-btn"
                  fullWidth
                  loading={loading}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: 400,
                    height: "3rem",
                  }}
                >
                  <span>Reset Password</span>
                </Button>
              </Grid.Col>
            </Grid>
          </div>
        </div>
      )}

      {stage === 1 && (
        <div className="forgetpassword__page">
          <AuthPagesArt />

          <div className="forgetpassword__wrapper">
            <Grid justify="center">
              <Grid.Col span={4}>
                <h1 className="page__title">Reset Password</h1>

                <FemtoAlert
                  data-testid="email_sent_alert"
                  caption={"Please check your mail"}
                  icon={<i className="fas fa-inbox"></i>}
                  state="notification"
                >
                  <span>
                    If email{" "}
                    <span style={{ textDecoration: "underline" }}>
                      {forgetPasswordForm.values.email}
                    </span>
                    , you will receive a password reset email
                  </span>
                </FemtoAlert>

                <span className="question">Wrong email address?</span>

                <div>
                  <Button
                    variant="outline"
                    onClick={handleReEnterEmail}
                    data-testid="re-enter-email-btn"
                    mt="sm"
                    style={{
                      height: "3rem",
                    }}
                    rightIcon={<i className="fas fa-envelope"></i>}
                  >
                    <span className="reenter__password">
                      Re enter your email address
                    </span>
                  </Button>
                </div>
              </Grid.Col>
            </Grid>
          </div>
        </div>
      )}
    </form>
  );
}

export default ForgetPassword;
