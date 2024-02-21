import React, { useState } from "react";
import {
  Button,
  PasswordInput,
  Checkbox,
  TextInput,
  Anchor,
} from "@mantine/core";
import FemtoAlert from "../../../components/femto-alert/FemtoAlert";
import { Link } from "react-router-dom";
import TOSModal from "../../../components/modals/terms-of-service-modal/TOSModal";
import PrivacyPolicyModal from "../../../components/modals/privacy-policy-modal/PrivacyPolicyModal";

const RegisterForm = ({ form, loading, showAlreadyExists }) => {
  const [showToS, setShowToS] = useState(false);
  const [showPP, setShowPP] = useState(false);

  const handleHidePrivacyPolicy = () => {
    setShowPP(false);
  };
  const handleHideTOSModal = () => {
    setShowToS(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TOSModal showToS={showToS} handleHideTOSModal={handleHideTOSModal} />
      <PrivacyPolicyModal
        showPP={showPP}
        handleHidePrivacyPolicy={handleHidePrivacyPolicy}
      />
      <div>
        <TextInput
          placeholder="Your email"
          label="Email"
          size="md"
          radius="md"
          mb="md"
          className="email__input__register"
          data-testid="email_input"
          errorProps={{
            "data-testid": "email_input_error",
          }}
          style={{
            marginBottom: 0,
          }}
          {...form.getInputProps("email", { required: true })}
        />
        {!form.errors.email && !showAlreadyExists && (
          <small className="input__description">
            We suggest using the email address you use at work.
          </small>
        )}
        {showAlreadyExists && (
          <FemtoAlert
            data-testid="already-associated"
            caption={
              <small className="already__exists__error">
                This account already exists on Femto,{" "}
                <Link to="/login" className="login__redirect">
                  Login
                </Link>
                .
              </small>
            }
            state="error"
            icon={<i className="fas fa-lock"></i>}
          />
        )}
      </div>

      <div>
        <TextInput
          placeholder="Your name"
          label="Full Name"
          size="md"
          radius="md"
          mb="md"
          data-testid="name-input"
          className="name__input__register"
          errorProps={{
            "data-testid": "name-error",
          }}
          style={{
            marginBottom: 0,
          }}
          {...form.getInputProps("name", { required: true })}
        />
      </div>
      <div>
        <PasswordInput
          placeholder="Your password"
          label="Password"
          size="md"
          radius="md"
          data-testid="password-input"
          className="password__input__register"
          errorProps={{
            "data-testid": "password-error",
          }}
          style={{
            marginBottom: 0,
          }}
          {...form.getInputProps("password", {
            required: true,
          })}
        />
        {!form.errors.password && (
          <small className="input__description">
            The Password should be at least 8 characters long.
          </small>
        )}
      </div>
      <div>
        <Checkbox
          radius="xs"
          mt="md"
          className="police__title"
          style={{
            marginBottom: 20,
            marginTop: 16,
          }}
          label={
            <span
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              I agree to Femto
              <span
                className="help__link"
                onClick={() => {
                  setShowToS(true);
                }}
                data-testid="tos_btn"
              >
                Terms of service
              </span>
              and{" "}
              <Anchor
                className="help__link"
                onClick={() => {
                  setShowPP(true);
                }}
                data-testid="pp_btn"
              >
                Privacy policy
              </Anchor>
            </span>
          }
          data-testid="userAgreement_input"
          error={form.errors.userAgreement}
          {...form.getInputProps("userAgreement", {
            type: "checkbox",
          })}
        />
      </div>
      <Button
        loading={loading}
        type="submit"
        size="md"
        fullWidth
        data-testid="submit_btn"
        style={{ height: "3rem", fontWeight: 400 }}
      >
        Create account
      </Button>
    </div>
  );
};

export default RegisterForm;
