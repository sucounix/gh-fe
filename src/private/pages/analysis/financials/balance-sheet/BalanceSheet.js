import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { Flex, Loader } from "@mantine/core";
import BalanceSheetFilter from "./BalanceSheetFilter";
import axios from "axios";
import { TimeFrameContext } from "../../../../../contexts/TimeFrameContext";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import {
  handleCurrencyPrecision,
  handleCurrencySymbol,
} from "../../../../helpers/handleCurrency";
import { CompanyPreferencesApiContext } from "../../../../../contexts/CompanyPreferencesApi";
import { CompanyPreferencesFilterContext } from "../../../../../contexts/CompanyPreferencesFilter";
import FemtoAlert from "../../../../../components/femto-alert/FemtoAlert";
import { notifications } from "@mantine/notifications";
import { handleResponseError } from "../../../../../utils/errorHandling";
import TableComponent from "../../../../../components/table/Table";
import {
  currentEquityView,
  nonCurrentEquityView,
  nonCurrentLiabilitiesView,
  currentLiabilitiesView,
} from "../../../../../shared-files/BalanceSheetViews";
import CompanyLoading from "../../../../components/company-loading/CompanyLoading";
import "./style/BalanceSheet.scss";

const BalanceSheet = () => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(null);
  const [adjustedTableData, setAdjustedTableData] = useState(null);
  const [totalAssetsNumbers, setTotalAssetsNumber] = useState(0);
  const [totalEquPlusLibNumber, setTotalEquPlusLibNumber] = useState(0);
  // if the common size of total (equity and liabilties) not equal the common size of total assets
  const [wrongNumbersFlag, setWrongNumbersFlag] = useState(false);

  const { timeFrameResult } = useContext(TimeFrameContext);
  const {
    selectedCompany,
    isTimeframeReady,
    isAPIPreferencesReady,
    fetchSelectedCompany,
    isSelectedCompanyReady,
  } = useContext(CompaniesContext);
  const { companyPreferencesFilter } = useContext(
    CompanyPreferencesFilterContext
  );

  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    if (
      timeFrameResult &&
      selectedCompany &&
      isTimeframeReady &&
      isAPIPreferencesReady &&
      isSelectedCompanyReady
    ) {
      fetchBalanceSheet();
    }
  }, [
    timeFrameResult,
    companyPreferencesApi,
    isTimeframeReady,
    isAPIPreferencesReady,
    isSelectedCompanyReady,
  ]);

  useEffect(() => {
    if (tableData) {
      switch (true) {
        case companyPreferencesFilter.viewCurrentFirstBS &&
          companyPreferencesFilter.viewEquityPlusLiabilitiesBS:
          renderViews(currentEquityView);
          break;
        case !companyPreferencesFilter.viewCurrentFirstBS &&
          companyPreferencesFilter.viewEquityPlusLiabilitiesBS:
          renderViews(nonCurrentEquityView);
          break;
        case companyPreferencesFilter.viewCurrentFirstBS &&
          !companyPreferencesFilter.viewEquityPlusLiabilitiesBS:
          renderViews(currentLiabilitiesView);
          break;
        case !companyPreferencesFilter.viewCurrentFirstBS &&
          !companyPreferencesFilter.viewEquityPlusLiabilitiesBS:
          renderViews(nonCurrentLiabilitiesView);
          break;
        default:
          break;
      }
    }
  }, [tableData, companyPreferencesFilter]);

  useEffect(() => {
    setWrongNumbersFlag(
      Math.abs(totalAssetsNumbers - totalEquPlusLibNumber) > 0.01
    );
  }, [totalAssetsNumbers, totalEquPlusLibNumber]);

  const fetchBalanceSheet = () => {
    setLoading(true);

    axios
      .get(`/analysis/analysis_statement/${selectedCompany.uuid}/`, {
        params: {
          financial_year: timeFrameResult.actual_year,
          period:
            timeFrameResult.period &&
            timeFrameResult.frequency_period !== "annual"
              ? timeFrameResult.period
              : timeFrameResult.actual_year,
          is_hide: companyPreferencesApi?.hideYoYBS,
          analysis_statement: "Balance Sheet",
          view_name: null,
          view_type: companyPreferencesApi.viewBS?.value,
          is_summary: false,
        },
      })
      .then((res) => {
        setTableData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        handleResponseError(e);
        setLoading(false);
        notifications?.show({
          title: "Error",
          message: "An error occured while fetching data",
          color: "red",
        });
      });
  };

  const renderViews = (ViewsArr) => {
    const tempArrRows = [];
    if (companyPreferencesApi.viewBS?.value === "Summary") {
      if (tableData.rows.length > 0) {
        for (let i = 0; i < ViewsArr.length; i++) {
          let matchedGroup = tableData.rows[0].row.rows.find((group) => {
            if (group.row[0].col_data === ViewsArr[i]) {
              if (ViewsArr[i] === "Total Assets")
                setTotalAssetsNumber(group.row[1].col_data);
              if (ViewsArr[i] === "Equity & Liabilities")
                setTotalEquPlusLibNumber(group.row[1].col_data);
              return group;
            }
          });

          if (matchedGroup) tempArrRows.push(matchedGroup);
        }
      }
      setAdjustedTableData({
        rows: [
          {
            row: {
              border: false,
              columns: [],
              rows: tempArrRows,
            },
          },
        ],
        columns: tableData.columns,
        headers: tableData.headers,
      });
    } else {
      for (let i = 0; i < ViewsArr.length; i++) {
        let matchedGroup = tableData.rows.find((group) => {
          //normal group
          if (group.row.columns.length > 0) {
            if (group.row.columns[0].col_data === ViewsArr[i]) return group;
          } else {
            // total group
            if (group.row.rows[0].row[0].col_data === ViewsArr[i]) {
              if (ViewsArr[i] === "Total Assets")
                setTotalAssetsNumber(group.row.rows[0].row[1].col_data);
              if (ViewsArr[i] === "Equity & Liabilities")
                setTotalEquPlusLibNumber(group.row.rows[0].row[1].col_data);
              return group;
            }
          }
        });
        if (matchedGroup) tempArrRows.push(matchedGroup);
      }
      setAdjustedTableData({
        rows: tempArrRows,
        columns: tableData.columns,
        headers: tableData.headers,
      });
    }
  };

  const calculateTheDifference = () => {
    return (totalAssetsNumbers - totalEquPlusLibNumber).toFixed(
      handleCurrencyPrecision(selectedCompany.currency)
    );
  };

  const wrongNumbers = () => {
    return (
      wrongNumbersFlag && (
        <FemtoAlert
          data-testid="wrong__credentials"
          state="warning"
          icon={<i className="fa-solid fa-triangle-exclamation"></i>}
          caption={`The sum of the “Liabilities” and “Equity” is not equal to the “Assets”, and the difference is "${handleCurrencySymbol(
            selectedCompany.currency
          )} ${calculateTheDifference()}" `}
        ></FemtoAlert>
      )
    );
  };

  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="Balance sheet" />;
  }

  return (
    <div className="financial_BS">
      {companyPreferencesFilter && <BalanceSheetFilter />}
      <div>
        {loading ? (
          <Flex align={"center"} justify="center" h="100%" mt="10%">
            <Loader />
          </Flex>
        ) : (
          tableData !== null &&
          companyPreferencesFilter && (
            <>
              {wrongNumbers()}
              <div style={{ marginTop: "20px" }}>
                {adjustedTableData && (
                  <TableComponent
                    data={adjustedTableData}
                    testIdSuffix="BS"
                    headerTestId={`header_BS_${companyPreferencesApi.viewBS?.testId}`}
                  />
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default BalanceSheet;
