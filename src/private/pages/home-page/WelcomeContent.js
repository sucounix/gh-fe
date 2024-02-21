import React, { useContext, useState } from "react";
import { Button } from "@mantine/core";
import { renderUI } from "../quickbooks/RenderUI";
import { useNavigate } from "react-router-dom";
import excelIcon from "../../../assets/images/excelIcon.svg";
import quickbooks from "../../../assets/images/quickbooks.svg";
import { UserContext } from "../../../contexts/UserContext";
import { QuickbooksDatePeriod } from "../../../components/modals/quickbooks-date-period/QuickbooksDatePeriod";
import "./style/HomePage.css";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
import { CompaniesContext } from "../../../contexts/CompaniesContext";

const WelcomeContent = ({ userHasCompanies }) => {
  const [quickbooksLoader, setQuickbooksLoader] = useState(false);
  // this state for Quickbooks date period modal
  // will take the date period interval (from -> to)
  const [showQDatePeriodModal, setShowQDatePeriodModal] = useState(false);
  const [qDatePeriod, setQDatePeriod] = useState({ from: null, to: null });
  const { user } = useContext(UserContext);
  const { isAllowedToAddNewCompany } = useContext(SubscriptionContext);
  const { companies } = useContext(CompaniesContext);
  const navigate = useNavigate();

  const handleQuickbooksIntegration = () => {
    setQuickbooksLoader(true);
    renderUI({ state: `from=${qDatePeriod.from},to=${qDatePeriod.to}` });
  };
  const handleHideQuickbooksModal = () => {
    setShowQDatePeriodModal(false);
  };

  return (
    <div className="mb__40" data-testid="welcome_content">
      {showQDatePeriodModal && (
        <QuickbooksDatePeriod
          showModal={showQDatePeriodModal}
          handleHideQuickbooksModal={handleHideQuickbooksModal}
          handleQuickbooksIntegration={handleQuickbooksIntegration}
          datePeriod={qDatePeriod}
          setPeriod={setQDatePeriod}
        />
      )}
      {user && (
        <h1 className="mainTitle">
          Welcome&nbsp;<span className="user__name">{user.name}</span>
        </h1>
      )}
      <p className="text1 ">
        You're just minutes away from insightful analysis tools and captivating
        reporting.
      </p>
      <div className="mt__24 company__text">
        {userHasCompanies ? (
          <h4 className="home_title2">Add New Company </h4>
        ) : (
          <h4 className="home_title2">Add your first company</h4>
        )}
        <p className="text2">Select the data source for this company</p>
      </div>
      <div className=" btn__group">
        <Button
          color={"primary"}
          size="lg"
          w="201px"
          className="mt__18 upload__btn"
          data-testid="excel_btn_homePG"
          rightIcon={<img src={excelIcon} width={15} alt="excel icon" />}
          onClick={(event) => {
            if (isAllowedToAddNewCompany(event, companies))
              navigate("/upload/excel");
          }}
        >
          Excel sheet
        </Button>

        <Button
          color={"primary"}
          size="lg"
          w="201px"
          className="ml__18 upload__btn"
          rightIcon={<img src={quickbooks} width={20} alt="quickbooks icon" />}
          onClick={(event) => {
            if (isAllowedToAddNewCompany(event, companies))
              setShowQDatePeriodModal(true);
          }}
          loading={quickbooksLoader}
          data-testid="quickbooks__btn"
        >
          Quickbooks
        </Button>
      </div>
    </div>
  );
};
export default WelcomeContent;
