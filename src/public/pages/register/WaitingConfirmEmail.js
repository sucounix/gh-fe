import React, { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { handleResponseError } from "../../../utils/errorHandling";
import "./index.scss";
import verificationLoading from "../../../assets/images/verification-loading.gif";
import { Auth } from "aws-amplify";

const WaitingConfirmEmail = ({
  email = "",
  resendCounter,
  setResendCounter,
  initCountingDown,
}) => {
  const [counter, setCounter] = useState(resendCounter);

  useEffect(() => {
    setCounter(resendCounter);
  }, [resendCounter]);

  /* 
  Resend verfication email
  */
  const handleResendVerifcation = () => {
    Auth.resendSignUp(email)
      .then(() => {
        setResendCounter(30);
        initCountingDown();
      })
      .catch((err) => handleResponseError(err));
  };

  return (
    <div className="waiting__confirm__mail__div">
      <img
        src={verificationLoading}
        width={200}
        alt="loading"
        className="loading__img"
      />
      <h1 className="email__verification__title">Verify your email address</h1>

      <span className="disc">
        we’ve sent you a verification link, please check your email inbox and
        click on the link to verify your account.
      </span>

      <span className="cant__find__link__span">
        <i
          className="fas fa-comment-exclamation"
          style={{
            color: "#086972",
            marginInlineEnd: "0.5rem",
          }}
        ></i>
        Can't find verification link ? Check your spam folder!
      </span>

      {counter > 0 && (
        <div>
          <span className="resend__in">Resend in: </span>
          <span className="counter">{`${counter} s`}</span>
        </div>
      )}

      <Button
        className="resend__btn"
        disabled={counter > 0 ? true : false}
        size="md"
        radius="sm"
        onClick={handleResendVerifcation}
        data-testid="resend-email-btn"
        style={{
          height: "3rem",
          padding: "0rem 4rem",
          marginTop: "1rem",
        }}
      >
        Send again
      </Button>
    </div>
  );
};

export default WaitingConfirmEmail;
