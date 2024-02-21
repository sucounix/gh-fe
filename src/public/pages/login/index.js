import React, { useState, useEffect, useContext } from "react";
import { Button, TextInput, PasswordInput, Grid, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { handleResponseError } from "../../../utils/errorHandling";
import AuthPagesArt from "../../components/auth-pages-art/AuthPagesArt";
import SigninWithMicrosoftButton from "../../components/signin-with-microsoft/SigninWithMicrosoftButton";
import SigninWithGoogleButton from "../../components/signin-with-google/SigninWithGoogleButton";
import { UserContext } from "../../../contexts/UserContext";
import { notifications } from "@mantine/notifications";
import FemtoAlert from "../../../components/femto-alert/FemtoAlert";
import "./style/Login.scss";
import backgroundLogo from "../../../assets/images/small logo right.svg";
import AuthFooter from "../../components/auth-footer/AuthFooter";
import ENFile from "./locales/en.json";
import { Auth } from "aws-amplify";

function Login() {
  const [loading, setLoading] = useState(false);
  const [wrongCredentialsFlag, setWrongCredentialsFlag] = useState(false);
  const { fetchUser } = useContext(UserContext);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: (values) => {
      const errors = {};

      if (!values.email) {
        errors.email = "Email is required";
      }

      if (!values.password) {
        errors.password = "Password is required";
      }

      return errors;
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);
    setWrongCredentialsFlag(false);
    values = { ...values, email: values.email.toLowerCase() };
    Auth.signIn(values.email, values.password)
      .then(async (result) => {
        localStorage.setItem(
          "id_token",
          result.signInUserSession.idToken.jwtToken
        );
        await fetchUser();
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        if (error.message === ENFile.IncorrectUerOrPassword)
          setWrongCredentialsFlag(true);
        else {
          handleResponseError(error, form, error.message);
        }
      });
  };

  const wrongCredentials = () => {
    return (
      wrongCredentialsFlag && (
        <FemtoAlert
          data-testid="wrong__credentials"
          state="error"
          caption="  The email address or password is incorrect"
          icon={<i className="fa-solid fa-circle-exclamation"></i>}
        />
      )
    );
  };

  return (
    <div className="login__page">
      <AuthPagesArt />
      <AuthFooter />

      <div className="login__wrapper">
        <Grid justify="center">
          <Grid.Col sm={5}>
            <span className="login__title">Login</span>
            <p className="welcome__back__title">Welcome Back</p>
            <p className="continue__with">Continue With</p>

            <div className="social__login__btns">
              <SigninWithGoogleButton />
              <SigninWithMicrosoftButton />
            </div>

            <Divider
              style={{ margin: "1rem 0rem" }}
              label={
                <>
                  <span className="or__text">or</span>
                </>
              }
              labelPosition="center"
            />

            <form
              onSubmit={form.onSubmit((values) => handleSubmit(values))}
              className="login_form"
            >
              <TextInput
                placeholder="Your email"
                label="Email"
                className="email__input__login"
                size="md"
                radius="md"
                data-testid="email_input"
                errorProps={{
                  "data-testid": "email_input_error",
                }}
                {...form.getInputProps("email", { required: true })}
              />

              <PasswordInput
                placeholder="Your password"
                label="Password"
                size="md"
                radius="md"
                className="password_input"
                data-testid="password_input"
                errorProps={{
                  "data-testid": "password-error",
                }}
                {...form.getInputProps("password", {
                  required: true,
                })}
              />
              {wrongCredentials()}
              <Link to="/forget-password" className="forget__password">
                Forget password
              </Link>

              <Button
                loading={loading}
                data-testid="submit__btn__login"
                type="submit"
                size="md"
                className="submit__btn__login"
                style={{
                  height: "3rem",
                }}
              >
                Sign In
              </Button>
            </form>

            <div className="already__using">
              <span>New to Femto?</span>
              <Link to="/register" className="forget__password">
                Create new account
              </Link>
            </div>
          </Grid.Col>
        </Grid>
        <img
          src={backgroundLogo}
          alt="background logo"
          className="background__logo"
        />
      </div>
    </div>
  );
}

export default Login;
