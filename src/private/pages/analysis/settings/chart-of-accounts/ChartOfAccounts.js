import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import guidelines from "../../../../../assets/documents/Financial Upload Guidelines.pdf";
import { Loader, Flex, Tabs } from "@mantine/core";
import TabContentChartOfAccounts from "./TabContent";
import { useParams } from "react-router-dom";
import "./style/ChartOfAccounts.scss";
import axios from "axios";
import { handleResponseError } from "../../../../../utils/errorHandling";
import { notifications } from "@mantine/notifications";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import CompanyLoading from "../../../../components/company-loading/CompanyLoading";
import ChartOfAccountAlreadyExists from "../../../../../components/modals/chart-of-account-already-exists/ChartOfAccountAlreadyExists";

const ChartOfAccounts = () => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("PL");

  const [classificationData, setClassificationData] = useState(null);
  const [classificationLoading, setClassificationLoading] = useState(true);

  // if the state {activeTab = PL} ,then {AccountsData} state will contain the PL data
  // same for the BS
  const [accountsData, setAccountsData] = useState([]);
  const [accountDataLoading, setAccountDataLoading] = useState(true);

  const [openAlreadyExistModal, setOpenAlreadyExistModal] = useState(false);
  const [accountNameAlreadyExist, setAccountNameAlreadyExist] = useState("");
  // when start drag or when click on re-classify button
  // will save the item info in the {currentItemChange} state
  const [currentItemChange, setCurrentItemChanged] = useState(null);
  const {
    selectedCompany,
    isTimeframeReady,
    isAPIPreferencesReady,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    if (isTimeframeReady && isAPIPreferencesReady && isSelectedCompanyReady) {
      fetchClassificationData(activeTab);
      fetchAccountData(activeTab);
    }
  }, [
    activeTab,
    selectedCompany,
    isTimeframeReady,
    isAPIPreferencesReady,
    isSelectedCompanyReady,
  ]);

  const fetchClassificationData = (type) => {
    //type = PL or BS
    setClassificationLoading(true);
    axios
      .get(
        type === "PL"
          ? `analysis/chart_of_accounts/pl_classifications/${params.companyId}/`
          : `analysis/chart_of_accounts/bs_classifications/${params.companyId}/`
      )
      .then((res) => {
        setClassificationData(
          type === "PL" ? res.data?.profit_and_loss : res.data?.balance_sheet
        );
        setClassificationLoading(false);
      })
      .catch((err) => {
        handleResponseError(err);
        setClassificationLoading(false);
      });
  };

  const fetchAccountData = (type) => {
    //type = PL or BS
    setAccountDataLoading(true);
    axios
      .get(
        type === "PL"
          ? `analysis/chart_of_accounts/pl/${params.companyId}/`
          : `analysis/chart_of_accounts/bs/${params.companyId}/`
      )
      .then((res) => {
        setAccountsData(res.data);
        setAccountDataLoading(false);
      })
      .catch((err) => {
        setAccountDataLoading(false);
        handleResponseError(err);
      });
  };

  const updateItemPriority = (uuid, priority) => {
    let obj = { priority };
    axios
      .put(`analysis/chart_of_accounts/update_priorty/${uuid}/`, obj)
      .then(() => {
        notifications.show({
          title: "Success",
          message: "KPI has been updated",
        });
      })
      .catch((err) => {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
        handleResponseError(err);
      });
  };

  const updateItemClassification = (uuid, classification) => {
    let obj = { classification };

    axios
      .put(`analysis/chart_of_accounts/update_classification/${uuid}/`, obj)
      .then((res) => {
        handleGroupChange(res.data);
        notifications.show({
          title: "Success",
          message: "KPI has been updated",
        });
      })
      .catch((err) => {
        if (err.response.data?.account_name) {
          setAccountNameAlreadyExist(err.response.data.account_name);
          setOpenAlreadyExistModal(true);
        }

        handleResponseError(err);
      });
  };

  const handleGroupChange = (changeClassificationRes) => {
    let AccountDataCopy = [...accountsData];
    // get the index of (old , new) groups in {AccountsData}
    // then replace their values with the new group items
    let fromGroupIndex = AccountDataCopy.findIndex(
      (group) => group.name === changeClassificationRes.from_group.name
    );
    let toGroupIndex = AccountDataCopy.findIndex(
      (group) => group.name === changeClassificationRes.to_group.name
    );

    AccountDataCopy[fromGroupIndex].accounts =
      changeClassificationRes.from_group.accounts;

    AccountDataCopy[toGroupIndex].accounts =
      changeClassificationRes.to_group.accounts;

    setAccountsData([...AccountDataCopy]);
  };

  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="Chart of Accounts" />;
  }

  return (
    <div className="Chart__Of__Accounts__page">
      <ChartOfAccountAlreadyExists
        openAlreadyExistModal={openAlreadyExistModal}
        setOpenAlreadyExistModal={setOpenAlreadyExistModal}
        accountNameAlreadyExist={accountNameAlreadyExist}
      />
      <p className="title__page">Chart of accounts</p>
      <p className="text__page">
        Classify, re-order and group accounts.
        <span
          className="guidelines__span"
          onClick={() => {
            window.open(guidelines, "_blank");
          }}
        >
          View classification guidelines
        </span>
      </p>
      {/*  tabs (p&L , balancesheet)  */}
      <Tabs color="#086972" defaultValue="PL">
        <Tabs.List data-testid="tabs">
          <Tabs.Tab
            value="PL"
            onClick={() => {
              setActiveTab("PL");
            }}
            data-testid="pl__tab__btn"
            className={activeTab === "PL" && "active__tab__account"}
          >
            Profit & loss
          </Tabs.Tab>
          <Tabs.Tab
            value="BS"
            onClick={() => {
              setActiveTab("BS");
            }}
            data-testid="bs__tab__btn"
            className={activeTab === "BS" && "active__tab__account"}
          >
            Balance sheet
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="PL" pt="xs">
          {accountDataLoading ? (
            <Flex align={"center"} justify="center" h="100%" mt="10%">
              <Loader />
            </Flex>
          ) : (
            <TabContentChartOfAccounts
              title="Profit & loss"
              dataTestId="tab__content__pl"
              data={accountsData}
              setAccountsData={setAccountsData}
              classificationData={classificationData}
              classificationLoading={classificationLoading}
              currentItemChange={currentItemChange}
              setCurrentItemChanged={setCurrentItemChanged}
              updateItemPriority={updateItemPriority}
              updateItemClassification={updateItemClassification}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="BS" pt="xs">
          {accountDataLoading ? (
            <Flex align={"center"} justify="center" h="100%" mt="10%">
              <Loader />
            </Flex>
          ) : (
            <TabContentChartOfAccounts
              title="Balance sheet"
              dataTestId="tab__content__bs"
              data={accountsData}
              setAccountsData={setAccountsData}
              classificationData={classificationData}
              classificationLoading={classificationLoading}
              currentItemChange={currentItemChange}
              setCurrentItemChanged={setCurrentItemChanged}
              updateItemPriority={updateItemPriority}
              updateItemClassification={updateItemClassification}
            />
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
export default ChartOfAccounts;
