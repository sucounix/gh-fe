import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Auth } from "aws-amplify";
import SuccessVerification from "./SuccessVerification";
import FailVerification from "./FailVerification";
import loadingSpinner from "../../../assets/images/loadingkpis.gif";
import "./index.scss";

function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCodeVerifiedSuccessfully, setIsCodeVerifiedSuccessfully] =
    useState(true);
  const params = useParams();

  useEffect(() => {
    Auth.confirmSignUp(params.user_name, params.verifyCode)
      .then(() => {
        setIsLoading(false);
        setIsCodeVerifiedSuccessfully(true);
      })
      .catch(() => {
        setIsLoading(false);
        setIsCodeVerifiedSuccessfully(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading__wrapper">
          <img
            className="loading__spinner"
            src={loadingSpinner}
            alt="loading"
          />
        </div>
      ) : isCodeVerifiedSuccessfully ? (
        <SuccessVerification />
      ) : (
        <FailVerification email={params.email} />
      )}
    </>
  );
}

export default VerifyEmail;
