import React, { useContext, useEffect, useRef, useState } from "react";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { Button, Grid, TextInput, Textarea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import currencies from "../../../../helpers/currencies.json";
import { useForm } from "@mantine/form";
import axios from "axios";
import { handleResponseError } from "../../../../../utils/errorHandling";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import "./style/EditCompany.scss";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../../../../components/image-upload/ImageUpload";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";
import { modals } from "@mantine/modals";

function EditCompany() {
  const navigate = useNavigate();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const primaryIndustryRef = useRef(null);
  const secondaryIndustryRef = useRef(null);
  const primaryMarketRef = useRef(null);
  const secondaryMarketRef = useRef(null);
  const desRef = useRef(null);
  const pitchRef = useRef(null);
  const foundingDateRef = useRef(null);

  const { selectedCompany, fetchCompanyList, setSelectedCompany } =
    useContext(CompaniesContext);

  const [imageLink, setImageLink] = useState(undefined);
  const [companyLoaded, setCompanyLoaded] = useState(false);

  const logoForm = useForm({
    initialValues: {
      logo: null,
    },
  });

  const companyEditForm = useForm({
    initialValues: {
      name: "",
      currency: "",
      first_month_of_financial_year: "",
      founding_date: "",
      primary_industry: "",
      secondary_industry: "",
      primary_market: "",
      secondary_market: "",
      description: "",
      pitch_line: "",
    },

    validate: (values) => {
      const errors = {};

      if (!values.name) {
        errors.name = "Company Name is required";
      }

      return errors;
    },
  });

  useEffect(() => {
    setImageLink(null);
    companyEditForm.reset();

    axios.get(`/company/${selectedCompany.uuid}/`).then((res) => {
      res.data.founding_date
        ? companyEditForm.setFieldValue(
            "founding_date",
            new Date(res.data.founding_date)
          )
        : companyEditForm.setFieldValue("founding_date", null);

      setImageLink(res.data.logo);

      companyEditForm.setValues({
        name: res.data.name,
        currency: res.data.currency ? res.data.currency : undefined,
        first_month_of_financial_year: res.data.first_month_of_financial_year,
        primary_industry: res.data.primary_industry
          ? res.data.primary_industry
          : null,
        secondary_industry: res.data.secondary_industry,
        primary_market: res.data.primary_market,
        secondary_market: res.data.secondary_market,
        description: res.data.description,
        pitch_line: res.data.pitch_line,
      });

      companyEditForm.resetDirty();
      companyEditForm.resetTouched();

      setFirstRender(false);
      setCompanyLoaded(true);
    });
  }, [selectedCompany]);

  const updateCompany = (values) => {
    let formValues = { ...values };
    setSubmitLoading(true);

    if (formValues.founding_date !== null) {
      formValues.founding_date = moment(formValues.founding_date).format(
        "YYYY-MM-DD"
      );
    }

    delete formValues.logo;

    updateRequest(formValues)
      .then(() => {
        setSubmitLoading(false);
        fetchCompanyList();

        notifications.show({
          title: "Company updated",
          message: "Company has been updated successfully",
        });
        navigate("/organisation-settings/company-profile");
      })
      .catch((e) => {
        handleResponseError(e, companyEditForm);
        setSubmitLoading(false);
      });
  };

  const handleImageUpload = (e) => {
    updateLogo(e);
  };

  const updateLogo = (imageUploaded = null) => {
    let formValues = new FormData();

    if (imageUploaded) {
      formValues.append("logo", imageUploaded);
    } else {
      formValues = {
        logo: null,
      };
    }

    updateRequest(formValues, imageUploaded)
      .then((res) => {
        setImageLink(res.data.logo);
        notifications.show({
          title: "Company logo updated",
          message: "Company logo has been updated successfully",
        });
        companyEditForm.clearFieldError("logo");

        setSelectedCompany(res.data);

        modals.closeAll();
      })
      .catch((e) => {
        if (e.response?.status === 413) {
          notifications.show({
            title: "Error",
            color: "red",
            message: "File is too large",
          });
        } else {
          notifications.show({
            title: "Error",
            color: "red",
            message: e.response?.data?.logo[0],
          });
        }
      })
      .finally(() => {
        setImageUploadLoading(false);
      });
  };

  const updateRequest = (values, image = false) => {
    return axios.patch(`/company/${selectedCompany.uuid}/`, values, {
      headers: {
        "Content-Type": image ? "multipart/form-data" : "application/json",
      },
    });
  };

  const renderImageLink = () => {
    if (imageLink && !imageLink.includes("https"))
      return imageLink.replace("http", "https");
    return imageLink;
  };

  return (
    <div className="company__profile__wrapper">
      <div className="company__profile__header">
        <span className="company__profile__header__title">Company Profile</span>
        <span className="company__profile__header__subtitle">
          Review your company profile
        </span>
      </div>
      <div className="company__edit__wrapper">
        <div className="company__edit__left">
          <span className="company__logo__title">Company logo</span>
          {companyLoaded ? (
            <ImageUpload
              form={logoForm}
              field="logo"
              update={handleImageUpload}
              updateRequest={updateLogo}
              firstRender={firstRender}
              imageLink={renderImageLink()}
              setImageLink={setImageLink}
              testIdPrefix="logo"
            />
          ) : null}
        </div>
        <div className="company__edit__right">
          <form
            onSubmit={companyEditForm.onSubmit((values) =>
              updateCompany(values)
            )}
          >
            <div className="company__edit__row">
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Company name"
                    className="form_input"
                    data-testid="company-name-input"
                    {...companyEditForm.getInputProps("name")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    disabled
                    className="form_input"
                    label="Fiscal Year start month"
                    data-testid="fiscal-year-start-month-input"
                    {...companyEditForm.getInputProps(
                      "first_month_of_financial_year"
                    )}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <SingleDropdown
                    data={currencies}
                    form={companyEditForm}
                    title={"Select a currency"}
                    field={"currency"}
                    data-testid="currency-input"
                    optionLabel={"name"}
                    optionValue={"code"}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DatePickerInput
                    className="form_input"
                    maxDate={new Date()}
                    valueFormat="YYYY-MM-DD"
                    ref={foundingDateRef}
                    label="Company founding date"
                    data-testid="founding-date-input"
                    {...companyEditForm.getInputProps("founding_date")}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    className="form_input"
                    ref={primaryIndustryRef}
                    label="Primary Industry"
                    data-testid="primary-industry-input"
                    {...companyEditForm.getInputProps("primary_industry")}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    className="form_input"
                    ref={secondaryIndustryRef}
                    label="Secondary Industry"
                    data-testid="secondary-industry-input"
                    {...companyEditForm.getInputProps("secondary_industry")}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    className="form_input"
                    ref={primaryMarketRef}
                    label="Primary Market"
                    data-testid="primary-market-input"
                    {...companyEditForm.getInputProps("primary_market")}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    className="form_input"
                    ref={secondaryMarketRef}
                    label="Secondary Market"
                    data-testid="secondary-market-input"
                    {...companyEditForm.getInputProps("secondary_market")}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <Textarea
                    className="form_input"
                    ref={desRef}
                    label="Company Description"
                    {...companyEditForm.getInputProps("description")}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <Textarea
                    ref={pitchRef}
                    className="form_input"
                    label="Company Pitch line"
                    {...companyEditForm.getInputProps("pitch_line")}
                  />
                </Grid.Col>
              </Grid>
            </div>

            <div className="company__edit__action__buttons">
              <Button
                variant="outline"
                type="button"
                size="lg"
                onClick={() => {
                  navigate("/organisation-settings/company-profile");
                }}
              >
                <span className="company__edit__action__button">Cancel</span>
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={!companyEditForm.isDirty()}
                loading={submitLoading}
                data-testid="submit-button"
              >
                <span className="company__edit__action__button">Save</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCompany;
