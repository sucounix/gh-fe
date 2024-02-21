import React, { useContext, useEffect, useState } from "react";
import { Flex } from "@mantine/core";
import homeImg from "../../../assets/images/homeImg.png";
import axios from "axios";
import ListCompanies from "./ListCompanies";
import WelcomeContent from "./WelcomeContent";
import DeleteCompanyModal from "../../../components/modals/delete-company-modal/DeleteCompanyModal";
import { handleResponseError } from "../../../utils/errorHandling";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { TimeFrameContext } from "../../../contexts/TimeFrameContext";
import { useLocation } from "react-router-dom";
import StillProcessingModal from "../../../components/modals/still-processing/StillProcessingModal";
import "./style/HomePage.scss";
import { QuickbooksErrors } from "../../../components/modals/quickbooks-errors/QuickbooksErrors";
import { ReachedYourPlanMax } from "../../../components/modals/reached-your-plan-max/ReachedYourPlanMax";

const HomePage = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [showQErrorModal, setShowQErrorModal] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [showProcessingError, setShowProcessingError] = useState(false);

  const {
    companies,
    fetchCompanyList,
    selectedCompany,
    deleteCompanyPrefernces,
  } = useContext(CompaniesContext);
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);
  const { clearTimeFrameResult } = useContext(TimeFrameContext);
  const location = useLocation();

  useEffect(() => {
    clearTimeFrameResult();
    setBreadCrumbs([]);
    fetchCompanyList();
    // if there is an error from Quickbooks integration
    if (location.state && location.state.quickbooks_error) {
      setShowQErrorModal(true);
    }
    if (location.state && location.state.openReachMaxLimitModal) {
      ReachedYourPlanMax();
    }
  }, []);

  const deleteCompany = () => {
    setdeleteLoading(true);
    axios
      .delete(`/company/${currentCompany}/`)
      .then(() => {
        deleteCompanyPrefernces(currentCompany);
        setShowDeletePopup(false);
        setCurrentCompany(null);

        // if the deleted company
        // it is the current selectedCompany
        // so , I need to remove it from the localStorage
        if (selectedCompany && selectedCompany.uuid === currentCompany) {
          localStorage.removeItem(`${currentCompany}_companyFreq`);
          localStorage.removeItem(`selectedCompanyId`);
          fetchCompanyList(true, true); // if the current company is selected we need to delete it
        } else {
          fetchCompanyList(false, false); // keep the selected company as it is in the localStorage
        }
        setdeleteLoading(false);
      })
      .catch((error) => {
        setShowDeletePopup(false);
        setCurrentCompany(null);
        setdeleteLoading(false);

        if (error.response.status === 406) {
          setShowProcessingError(true);
        } else {
          setCurrentCompany(null);
          handleResponseError(error);
        }
      });
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setCurrentCompany(null);
  };

  const handleHideQuickbooksErrorModal = () => {
    setShowQErrorModal(false);
  };
  const handleHideStillProcessing = () => {
    setShowProcessingError(false);
  };
  return (
    <div className="home__page__screen">
      {showProcessingError && (
        <StillProcessingModal
          opened={showProcessingError}
          handleHideStillProcessing={handleHideStillProcessing}
        />
      )}
      {showQErrorModal && (
        <QuickbooksErrors
          showModal={showQErrorModal}
          handleHideQuickbooksErrorModal={handleHideQuickbooksErrorModal}
          error={location.state && location.state.quickbooks_error}
        />
      )}

      <div className="home__page__view">
        <div className="welcome__container">
          <div className="content_div">
            <Flex
              justify="flex-start"
              align={
                companies && companies.length > 0 ? "flex-start" : "center"
              }
              h="100%"
              w="100%"
            >
              <div>
                <WelcomeContent
                  userHasCompanies={companies && companies.length > 0}
                />
              </div>
            </Flex>
          </div>
          <div className="img_div">
            <Flex
              align={
                companies && companies.length > 0 ? "flex-start" : "center"
              }
              justify="flex-end"
              h="100%"
              w="100%"
            >
              <img src={homeImg} alt="Home" className="home__img" />
            </Flex>
          </div>
        </div>
        {companies && companies.length > 0 && (
          <div className="company_list_div">
            <ListCompanies
              setCurrentCompany={setCurrentCompany}
              setShowDeletePopup={setShowDeletePopup}
            />
          </div>
        )}
      </div>

      <DeleteCompanyModal
        showDeletePopup={showDeletePopup}
        onConfirm={deleteCompany}
        onCancel={cancelDelete}
        deleteLoading={deleteLoading}
      />
    </div>
  );
};

export default HomePage;
