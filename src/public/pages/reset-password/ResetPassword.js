import { Button, Grid, PasswordInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleResponseError } from "../../../utils/errorHandling";
import AuthPagesArt from "../../components/auth-pages-art/AuthPagesArt";
import { useForm } from "@mantine/form";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import "./style/ResetPassword.css";
import AuthFooter from "../../components/auth-footer/AuthFooter";
import { Auth } from "aws-amplify";

function ResetPassword() {
  const params = useParams();
  const navigate = useNavigate();

  const [resetLoading, setResetLoading] = useState(false);
  const { logoutUser } = useContext(UserContext);

  const resetPasswordForm = useForm({
    initialValues: {
      password: "",
    },

    validate: (values) => {
      const errors = {};

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      }
      return errors;
    },
  });

  const handleResetPassword = (values) => {
    setResetLoading(true);
    Auth.forgotPasswordSubmit(
      params.user_id,
      params.verifyCode,
      values.password
    )
      .then(() => {
        notifications.show({
          title: "Success",
          message: "Password has been reset successfully",
          color: "teal",
        });
        setResetLoading(false);
        logoutUser();
      })
      .catch((error) => {
        setResetLoading(false);
        handleResponseError(error, resetPasswordForm, error.message);
        navigate("/forget-password");
      });
  };

  return (
    <form
      onSubmit={resetPasswordForm.onSubmit((values) =>
        handleResetPassword(values)
      )}
    >
      <div className="resetpassword__page">
        <AuthPagesArt />
        <AuthFooter />

        <div className="resetpassword__wrapper">
          <Grid justify="center" align="center" style={{ height: "100%" }}>
            <Grid.Col span={5}>
              <h1 className="page__title">Reset Password</h1>
              <>
                <span className="text">
                  Please enter your new password below
                </span>

                <PasswordInput
                  placeholder="Your password"
                  label="Password"
                  size="md"
                  radius="md"
                  mt="md"
                  data-testid="password-input"
                  className="password__input"
                  errorProps={{
                    "data-testid": "password-error",
                  }}
                  {...resetPasswordForm.getInputProps("password", {
                    required: true,
                  })}
                />

                <Button
                  loading={resetLoading}
                  type="submit"
                  variant="filled"
                  fullWidth
                  mt="md"
                  data-testid="reset-password-btn"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    fontWeight: 400,
                    fontSize: 16,
                  }}
                >
                  <span>Set Password</span>
                </Button>
              </>
            </Grid.Col>
          </Grid>
        </div>
      </div>
    </form>
  );
}

export default ResetPassword;
