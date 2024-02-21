import React, { useContext, useEffect } from "react";
import { Grid, Flex, Menu, Tooltip, Divider } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "./style/HomePage.css";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import excelIcon from "../../../assets/images/excelImg.png";
import quickbooksIcon from "../../../assets/images/quickbooksImg.png";

const ListCompanies = ({ setCurrentCompany, setShowDeletePopup }) => {
  const { width } = useViewportSize();
  const { companies, setSelectedCompany } = useContext(CompaniesContext);
  const navigate = useNavigate();

  const handleNavigation = (type, company) => {
    if (!company.is_enabled) return;
    setSelectedCompany(company);
    localStorage.setItem(
      `${company.uuid}_companyFreq`,
      company.period_frequency
    );
    localStorage.setItem(`selectedCompanyId`, JSON.stringify(company));
    if (type === "analysis") {
      navigate(`company/${company.uuid}/analysis/financials`);
    } else if (type === "reports") {
      navigate(`company/${company.uuid}/reports/`);
    }
  };

  return (
    companies &&
    companies.length > 0 && (
      <div className="companies" data-testid="list_companies">
        <Divider size="sm" />
        <h1 className="title3">Your Companies</h1>
        <p className="desc">Select one of your companies</p>
        <Grid columns={12} className="h__100 allCompanies">
          {companies.map((company, index) => {
            return (
              <Tooltip
                label="Please upgrade your plan to show this company"
                events={{
                  hover: !company.is_enabled,
                  focus: !company.is_enabled,
                  touch: !company.is_enabled,
                }}
                position="top-start"
                key={index}
              >
                <Grid.Col
                  className={"company__row"}
                  data-testid="company_row"
                  key={`company_${index}`}
                >
                  <Flex align="center" justify="space-between">
                    <Flex
                      align="center"
                      justify="space-between"
                      className={!company.is_enabled && "disabled"}
                    >
                      <div>
                        <img
                          src={
                            company.data_source === "Excel"
                              ? excelIcon
                              : quickbooksIcon
                          }
                          alt={
                            company.data_source === "Excel"
                              ? "excel"
                              : "quickbooks"
                          }
                        />
                      </div>
                      <div>
                        <span
                          className={
                            company.is_enabled
                              ? "company__name__link "
                              : "company__name__link disabled"
                          }
                          onClick={() => {
                            handleNavigation("analysis", company);
                          }}
                        >
                          <p className="company__name">{company.name}</p>
                        </span>

                        <p className="lastUpdate">
                          <span>Last Update : </span>
                          {moment(company.modified).fromNow()}
                        </p>
                      </div>
                    </Flex>
                    <Flex gap="xl">
                      {width > 810 && (
                        <span
                          className="module"
                          onClick={() => {
                            handleNavigation("analysis", company);
                          }}
                        >
                          <i class="fa-solid fa-chart-mixed"></i> Analysis
                        </span>
                      )}
                      {width > 810 && (
                        <span
                          className="module"
                          onClick={() => {
                            handleNavigation("reports", company);
                          }}
                        >
                          <i class="fa-regular fa-file-chart-column"></i>
                          Reports
                        </span>
                      )}
                      <Menu shadow="md" position="bottom-end">
                        <Menu.Target>
                          <div data-testid="company_options">
                            <i className="fas fa-ellipsis-vertical option__dot"></i>
                          </div>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {width <= 810 && (
                            <Menu.Item
                              className="menu_item"
                              icon={<i class="fa-solid fa-chart-mixed"></i>}
                            >
                              <span
                                onClick={() => {
                                  handleNavigation("analysis", company);
                                }}
                              >
                                Analysis
                              </span>
                            </Menu.Item>
                          )}
                          {width <= 810 && (
                            <Menu.Item
                              className="menu_item"
                              icon={
                                <i class="fa-regular fa-file-chart-column"></i>
                              }
                            >
                              <span
                                onClick={() => {
                                  handleNavigation("reports", company);
                                }}
                              >
                                Reports
                              </span>
                            </Menu.Item>
                          )}
                          <Menu.Item
                            icon={<i className="fa fa-trash"></i>}
                            color="red"
                            data-testid="delete_btn"
                            onClick={() => {
                              setCurrentCompany(company.uuid);
                              setShowDeletePopup(true);
                            }}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Flex>
                  </Flex>
                </Grid.Col>
              </Tooltip>
            );
          })}
        </Grid>
      </div>
    )
  );
};

export default ListCompanies;
