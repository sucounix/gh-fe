import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/femtoLOGO.png";
import FreeCard from "./cards/FreeCard";
import ReportKitCard from "./cards/ReportKitCard";
import AstraCard from "./cards/AstraCard";
import SubscriptionToggle from "./SubscriptionToggle";
import plansStaticData from "./PlansData.json";
import loadingSpinner from "../../../assets/images/loadingkpis.gif";
import { initSubsbaseIntegration } from "./InitSubsbaseIntegration";
import { Flex } from "@mantine/core";
import "./SubscriptionPlan.scss";
import TOSModalConfirm from "../../../components/modals/terms-of-service-modal/TOSModalConfirm";

const SubscriptionPlan = () => {
  const { user } = useContext(UserContext);
  const [is_monthly, setIsMonthly] = useState(true);
  const [showToS, setShowToS] = useState(false);
  const [isInitSubsbaseIntegrationDone, setIsInitSubsbaseIntegrationDone] =
    useState(false);
  const { subscriptionInfo, subscriptionIsLoading, fetchSubscriptionInfo } =
    useContext(SubscriptionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!subscriptionInfo) fetchSubscriptionInfo();
  }, []);

  useEffect(() => {
    if (user && !user.is_terms_accepted) {
      setShowToS(true);
    }
  }, [user]);

  useEffect(() => {
    if (!subscriptionIsLoading && user && !isInitSubsbaseIntegrationDone) {
      setIsInitSubsbaseIntegrationDone(true);
      setTimeout(() => {
        initSubsbaseIntegration(user);
      }, 1000);
    }
  }, [subscriptionIsLoading, user]);

  useEffect(() => {
    if (subscriptionInfo) navigate("/");
  }, [subscriptionInfo]);

  const handleHideTOSModal = () => {
    setShowToS(false);
  };

  return (
    <>
      <TOSModalConfirm
        showToS={showToS}
        handleHideTOSModal={handleHideTOSModal}
      />
      {subscriptionIsLoading ? (
        <Flex
          align={"center"}
          justify={"center"}
          h="100vh"
          className="loading_div"
        >
          <div>
            <img
              src={loadingSpinner}
              alt="loadingSpinner"
              style={{ width: "200px" }}
            />
          </div>
        </Flex>
      ) : (
        <div
          className="subscription__plan"
          data-testid="subscription__plan__view"
        >
          <img src={logo} alt="logo" className="logo" />
          <h1 className="main__title">
            Get started now and scale your company with Femto
          </h1>
          <p className="sub__title">choose a plan tailored to your needs</p>

          <SubscriptionToggle
            data={plansStaticData}
            setIsMonthly={setIsMonthly}
            is_monthly={is_monthly}
          />

          <div className="cards__div">
            <FreeCard cardData={plansStaticData.plans[0]} />
            <ReportKitCard
              cardData={plansStaticData.plans[1]}
              is_monthly={is_monthly}
            />
            <AstraCard
              cardData={plansStaticData.plans[2]}
              is_monthly={is_monthly}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPlan;
