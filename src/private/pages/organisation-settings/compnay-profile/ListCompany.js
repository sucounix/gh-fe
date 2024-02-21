import React, { useContext } from "react";
import { CompaniesContext } from "../../../../contexts/CompaniesContext";
import { Avatar, Button } from "@mantine/core";
import companyDefaultAvatar from "../../../../assets/images/company_avatar.png";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import emptyImage from "../../../../assets/images/no-companies.svg";
import "./style/CompanyProfile.scss";

function ListCompany() {
  const { companies, setSelectedCompany, selectedCompany } =
    useContext(CompaniesContext);
  const navigate = useNavigate();

  const handleEdit = (uuid) => {
    setSelectedCompany(companies?.find((company) => company.uuid === uuid));
    navigate(`/organisation-settings/company-profile/edit`);
  };
  const renderImageLink = () => {
    if (!selectedCompany?.logo) return companyDefaultAvatar;
    if (!selectedCompany?.logo.includes("https"))
      return selectedCompany?.logo.replace("http", "https");
    return selectedCompany?.logo;
  };
  return (
    <div>
      {selectedCompany && (
        <div className="company__entry">
          <Avatar
            src={renderImageLink()}
            size={120}
            imageProps={{
              style: {
                objectFit: "contain",
              },
            }}
          ></Avatar>
          <div className="company__meta">
            <div className="company__meta__row">
              <div className="company__meta__left">
                <span className="company__name">
                  {selectedCompany.name && selectedCompany.name}
                </span>
              </div>
              <div className="company__meta__right">
                {selectedCompany.founding_date && (
                  <>
                    <span className="company__profile__key">Founded</span>
                    <span className="company__profile__value">
                      {moment(selectedCompany.founding_date).format("YYYY")}
                    </span>
                  </>
                )}
              </div>
            </div>
            {selectedCompany.pitch_line && (
              <div className="company__meta__row">
                <span className="company__pitchline">
                  {selectedCompany.pitch_line}
                </span>
              </div>
            )}
            {selectedCompany.description && (
              <div className="company__meta__row">
                <span className="company__description">
                  {selectedCompany.description}
                </span>
              </div>
            )}
            <div className="company__meta__row">
              <div className="company__meta__left">
                {selectedCompany.currency && (
                  <>
                    <span className="company__profile__key">Currency</span>
                    <span className="company__profile__value">
                      {selectedCompany.currency}
                    </span>
                  </>
                )}
              </div>
              <div className="company__meta__right">
                {selectedCompany.first_month_of_financial_year && (
                  <>
                    <span className="company__profile__key">
                      Fiscal Year start month
                    </span>
                    <span className="company__profile__value">
                      {selectedCompany.first_month_of_financial_year}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="company__meta__row">
              <div className="company__meta__left">
                {selectedCompany.primary_industry ||
                selectedCompany.secondary_industry ? (
                  <>
                    <span className="company__profile__key">Industry</span>
                    <span className="company__profile__value">
                      {selectedCompany.primary_industry}
                      {selectedCompany.secondary_industry &&
                        selectedCompany.primary_industry &&
                        ", "}
                      {selectedCompany.secondary_industry}
                    </span>
                  </>
                ) : null}
              </div>
              <div className="company__meta__right">
                {selectedCompany.primary_market ||
                selectedCompany.secondary_market ? (
                  <>
                    <span className="company__profile__key">Market</span>
                    <span className="company__profile__value">
                      {selectedCompany.primary_market}
                      {selectedCompany.secondary_market &&
                        selectedCompany.primary_market &&
                        ", "}
                      {selectedCompany.secondary_market}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div>
            <div
              className="company__edit"
              onClick={() => {
                handleEdit(selectedCompany.uuid);
              }}
            >
              <i className="fas fa-edit"></i>
              <span style={{ textDecoration: "underline" }}>Edit</span>
            </div>
          </div>
        </div>
      )}

      {!selectedCompany && (
        <div className="no_company_selected_container">
          <img src={emptyImage} alt="No Companies exist" />
          <div className="no_company_selected_div">
            <div>
              <span className="no__companies__title">No companies to show</span>
              <br />
              <span className="no__companies__subtitle">
                Create a new company and upload new company data
              </span>
            </div>
            <Button
              className="btn"
              onClick={() => {
                navigate("/upload/excel");
              }}
            >
              <span>Create new company</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListCompany;
