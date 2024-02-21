/* istanbul ignore file */
import axios from "axios";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import axiosRetry from "axios-retry";
import { Auth } from "aws-amplify";

axiosRetry(axios, { retries: 1 });

export const setupAxios = () => {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.interceptors.request.use(
    (request) => {
      return requestHandler(request);
    },
    (error) => {
      Promise.reject(error);
    }
  );
};

const requestHandler = async (request) => {
  const idToken = localStorage.getItem("id_token");
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
    tokenUse: "id",
    clientId: process.env.REACT_APP_AWS_USER_POOLS_CLIENT_ID,
  });

  if (idToken) {
    try {
      await verifier.verify(idToken);
      return {
        ...request,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${idToken}`,
        },
      };
    } catch {
      let currentSession = await Auth.currentSession();
      localStorage.setItem("id_token", currentSession.idToken.jwtToken);
      return {
        ...request,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${currentSession.idToken.jwtToken}`,
        },
      };
    }
  } else {
    return {
      ...request,
    };
  }
};
