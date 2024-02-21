import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleResponseError } from "../../../utils/errorHandling";
import { useNavigate } from "react-router";
import axios from "axios";
import loadingSpinner from "../../../assets/images/loadingkpis.gif";
import { Flex } from "@mantine/core";
import "./style/QRedirectURL.css";

const QRedirectURL = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    sendData();
  }, []);

  const sendData = () => {
    let data = {
      code: params.get("code"),
      state: params.get("state"),
      realm_id: params.get("realmId"),
    };

    axios
      .post("company/quickbooks/", data)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        navigate("/", { state: { quickbooks_error: error.response.data } });
      });
  };

  return (
    <Flex
      align={"center"}
      justify={"center"}
      mt="200px"
      className="q_redirect_Url"
    >
      <div>
        <Flex align={"center"} justify={"center"}>
          <img
            src={loadingSpinner}
            alt="loadingSpinner"
            style={{ width: "200px" }}
          />
        </Flex>
        <Flex align={"center"} justify={"center"}>
          <p className="main__title">Fetching Your Data...</p>
        </Flex>
        <Flex align={"center"} justify={"center"}>
          <p className="sub__title">
            We're working to fetch your data from QuickBooks
          </p>
        </Flex>
        <Flex align={"center"} justify={"center"}>
          <p className="sub__title2">Just a moment, please</p>
        </Flex>
      </div>
    </Flex>
  );
};

export default QRedirectURL;
