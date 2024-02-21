import React, { useState } from "react";
import RegisterForm from "./RegisterForm";
import { Link } from "react-router-dom";
import { handleResponseError } from "../../../utils/errorHandling";
import AuthPagesArt from "../../components/auth-pages-art/AuthPagesArt";
import SigninWithMicrosoftButton from "../../components/signin-with-microsoft/SigninWithMicrosoftButton";
import SigninWithGoogleButton from "../../components/signin-with-google/SigninWithGoogleButton";
import { Divider, Grid, UnstyledButton } from "@mantine/core";
import { useForm } from "@mantine/form";
import WaitingConfirmEmail from "./WaitingConfirmEmail";
import "./index.scss";
import backgroundLogo from "../../../assets/images/small logo right.svg";
import ContactUsModal from "../../../components/modals/contact-us-modal/ContactUsModal";
import ENFile from "./locales/en.json";
import { Auth } from "aws-amplify";

function Register() {
  /* 
    Stage 0: Sign up
    Stage 1: already sent verification email
  */
  const [stage, setStage] = useState(0);
  const [showAlreadyExists, setShowAlreadyExists] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);

  const [resendCounter, setResendCounter] = useState(30);

  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      userAgreement: false,
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Name is required";
      } else if (values.name && !/^[a-zA-Z0-9 ]+$/.test(values.name)) {
        errors.name = "Name must not contain special characters";
      } else if (values.name && values.name.length < 3) {
        errors.name = "Name must be at least 3 characters";
      } else if (values.name && !/^[A-Za-z\s]*$/.test(values.name)) {
        errors.name = "Name must not contain numbers";
      }

      // --------------------- //

      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        values.email &&
        !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }

      // --------------------- //

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      } else if (values.name && values.name === values.password) {
        errors.password = "Password must not be the same as name";
      }

      // --------------------- //

      if (values.userAgreement !== true) {
        errors.userAgreement =
          "Please agree to the privacy policy and user agreement";
      }
      return errors;
    },
  });

  const initCountingDown = () => {
    setInterval(() => {
      if (resendCounter > 0) {
        setResendCounter((prev) => prev - 1);
      }
    }, 1000);
  };
  /* 
    Register with email  
  */
  const handleSubmit = (values) => {
    setLoading(true);

    const { name, email, password } = values;
    Auth.signUp({
      username: email, // act as username
      password,
      attributes: {
        //optional fields in attribute
        email: email,
        name: name,
        "custom:is_terms_accepted": "true",
      },
    })
      .then(() => {
        setStage(1);
        setResendCounter(30);
        initCountingDown();
        setLoading(false);
      })
      .catch((err) => {
        if (
          err?.message === ENFile.accountAlreadyExist ||
          err?.message === ENFile.alreadyExistMessage
        ) {
          setShowAlreadyExists(true);
          setLoading(false);
        } else {
          handleResponseError(err, form);
        }
      });
  };

  const handlehideContactUsModal = () => {
    setShowContactUs(false);
  };

  return (
    <div className="register__page">
      <AuthPagesArt />
      <div className="contact__us__button">
        <ContactUsModal
          showContactUs={showContactUs}
          handlehideContactUsModal={handlehideContactUsModal}
        />
        <UnstyledButton
          variant={"white"}
          className="btn_auth_footer"
          onClick={() => {
            setShowContactUs(true);
          }}
        >
          Contact Us
        </UnstyledButton>
      </div>

      <div className="register__wrapper">
        <Grid justify="center" style={{ overflow: "hidden" }}>
          {stage === 0 && (
            <Grid.Col sm={6} md={6} lg={5}>
              {stage === 0 && (
                <div className="starter__intro">
                  <span className="create__account__title">
                    Create an account
                  </span>
                  <span className="start__for__free">Start for free</span>
                </div>
              )}
              {stage === 0 && (
                <div className="stage__0">
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
                  <div className="other__email__card">
                    <form
                      data-testid="register_form"
                      className="register__form"
                      onSubmit={form.onSubmit((values) => handleSubmit(values))}
                    >
                      <RegisterForm
                        form={form}
                        loading={loading}
                        showAlreadyExists={showAlreadyExists}
                      />
                    </form>
                  </div>

                  <div className="already__using__register">
                    <p className="text">Already using Femto?</p>
                    <Link
                      to="/login"
                      className="already__exist__link"
                      data-testid="to_login_page"
                    >
                      Login to your account
                    </Link>
                  </div>
                </div>
              )}
            </Grid.Col>
          )}

          {/* this stage will appear after the user send 
            his data successfully
            and now he is waiting for confirmation mail */}
          {stage === 1 && (
            <Grid.Col sm={8}>
              <WaitingConfirmEmail
                resendCounter={resendCounter}
                email={form?.values?.email}
                setResendCounter={setResendCounter}
                initCountingDown={initCountingDown}
              />
            </Grid.Col>
          )}
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

export default Register;
