import {
  Button,
  Container,
  FileButton,
  Grid,
  Group,
  Text,
  Modal,
  Progress,
  Flex,
} from "@mantine/core";
import React, { useEffect, useContext } from "react";
import homeImg from "../../../assets/images/homeImg.png";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useState } from "react";
import axios from "axios";
import guidelines from "../../../assets/documents/Financial Upload Guidelines.pdf";
import Example from "../../../assets/documents/Femto Upload Example.xlsx";
import UploadErrorsModal from "../../../components/modals/upload-errors/UploadErrorsModal";
import { BreadcrumbsContext } from "../../../contexts/BreadcrumbsContext";
import { handleResponseError } from "../../../utils/errorHandling";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { handleChangeCompanyPathIsDone } from "../../helpers/HandleChangeCompanyPath";
import { useInterval } from "@mantine/hooks";
import FemtoAlert from "../../../components/femto-alert/FemtoAlert";
import StillProcessingModal from "../../../components/modals/still-processing/StillProcessingModal";
import SingleDropdown from "../../../components/single-level-dropdown/SingleDropdown";
import TutorialVideoOutline from "../../../components/tutorial-video/TutorialVideoOutline";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
import "./style/UploadExcel.scss";

const UploadExcel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [fileError, setFileError] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(5);
  const [showUploadProgress, setShowUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [uploadedCompany, setUploadedCompany] = useState(null);
  const [stage, setStage] = useState("upload");
  const [showProcessingError, setShowProcessingError] = useState(false);
  const { setBreadCrumbs } = useContext(BreadcrumbsContext);
  const {
    selectedCompany,
    setSelectedCompany,
    deleteCompanyPrefernces,
    setCompanies,
    companies,
  } = useContext(CompaniesContext);
  const { isAllowedToAddNewCompany } = useContext(SubscriptionContext);

  const interval = useInterval(() => {
    setUploadProgress((prev) => {
      if (prev === 100) return 100;
      return prev + 1;
    });
  }, 140);

  useEffect(() => {
    if (showUploadProgress && uploadProgress === 100 && uploadedCompany) {
      let newPath = handleChangeCompanyPathIsDone({
        newCompany: uploadedCompany,
        location: {
          pathname: editMode
            ? `/company/${uploadedCompany.uuid}/analysis/settings/data-update`
            : "/",
        },
      });
      if (newPath) {
        if (editMode) {
          setTimeout(() => {
            navigate(newPath);
          }, 1000);
        } else {
          navigate(newPath);
        }
      }
    }
  }, [uploadProgress]);

  const uploadExcelForm = useForm({
    initialValues: {
      periodFrequency: "",
      fiscalYearStartMonth: "",
      file: "",
    },
  });

  useEffect(() => {
    if (companies?.length > 0) {
      if (isReachToMaxCompaniesLimit()) {
        navigate("/", {
          state: {
            openReachMaxLimitModal: true,
          },
        });
      }
    }
  }, [companies]);

  useEffect(() => {
    if (location?.state?.companyId) {
      setEditMode(true);
      setCompanyId(location.state.companyId);
    } else {
      setEditMode(false);
    }
  }, []);

  const isReachToMaxCompaniesLimit = () => {
    return (
      !location?.state?.companyId &&
      !isAllowedToAddNewCompany(null, companies, false) &&
      !uploadedCompany
    );
  };

  const periodFrequencyOptions = [
    { label: "Monthly", value: "month" },
    { label: "Quarterly", value: "quarter" },
    { label: "Semi-Annual", value: "semi-annual" },
    { label: "Annual", value: "annual" },
  ];

  const fiscalYearStartMonthOptions = [
    { label: "January", value: "January" },
    { label: "February", value: "February" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];

  useEffect(() => {
    setBreadCrumbs([]);

    interval.start();
    return interval.stop;
  }, []);

  const handleFileUpload = (file) => {
    if (file?.name) setFileName(file?.name);
    const formData = new FormData();
    formData.append("raw_company_data", file);
    formData.append("period_frequency", uploadExcelForm.values.periodFrequency);
    if (!editMode) {
      formData.append(
        "first_month_of_financial_year",
        uploadExcelForm.values.fiscalYearStartMonth
      );
    }

    handleFormSubmit(
      formData,
      editMode
        ? `/analysis/data_update/financial_data/${companyId}/`
        : "/company/excel/"
    );
  };

  const handleUploadAgain = () => {
    setShowUploadProgress(false);
    setFileError([]);
    setStage("upload");
  };

  const handleFormSubmit = (values, endPoint) => {
    setUploading(true);
    setUploadProgress(0);
    setShowUploadProgress(true);
    setUploadedCompany(null);

    axios
      .post(endPoint, values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        deleteCompanyPrefernces(selectedCompany?.uuid);
        if (editMode) {
          setCompanies((prev) =>
            prev.find((company) => company.uuid === res.data.uuid)
              ? prev.map((company) =>
                  company.uuid === res.data.uuid ? res.data : company
                )
              : prev.concat(res.data)
          );
        } else {
          setCompanies([...companies, res.data]);
        }
        setSelectedCompany(res.data);
        setUploadedCompany(res.data);
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 403) handleResponseError(e);
          else if (e.response.status === 406) {
            setShowProcessingError(true);
            setShowUploadProgress(0);
            setShowUploadProgress(false);
          } else {
            setFileError(e.response.data);
            setShowUploadProgress(0);
            setStage("upload-failure");
            setShowUploadProgress(false);
          }
          setUploading(false);
        }
      });
  };

  const isDisabled = () => {
    if (uploading) return true;
    if (editMode && !uploadExcelForm.values.periodFrequency) return true;
    if (
      !editMode &&
      (!uploadExcelForm.values.periodFrequency ||
        !uploadExcelForm.values.fiscalYearStartMonth)
    )
      return true;
    return false;
  };

  const handleHideStillProcessing = () => {
    setShowProcessingError(false);
  };
  const handleHideUploadError = () => {
    setShowErrorModal(false);
  };
  return (
    <>
      <Modal
        centered
        trapFocus={false}
        size={641}
        opened={showErrorModal}
        withCloseButton={false}
        onClose={() => {
          setShowErrorModal(false);
        }}
      >
        <UploadErrorsModal
          handleHideUploadError={handleHideUploadError}
          errors={fileError}
          guidelines={guidelines}
        />
      </Modal>
      <StillProcessingModal
        opened={showProcessingError}
        handleHideStillProcessing={handleHideStillProcessing}
        url={`/company/${selectedCompany?.uuid}/analysis/settings/data-update`}
      />
      <Container fluid className="h__100vh  normal__upload__screen">
        <Grid columns={12} mt={20}>
          <Grid.Col span={8}>
            <h1 className="import__excel__title">Import Excel sheet</h1>
            <Grid columns={12} align="center">
              <div className="guide__wrapper">
                <span className="subtitle__icon">
                  <i className="fas fa-cloud-arrow-up"></i>
                </span>
                <span className="subtitle__text">
                  Upload your financial data after reading the guidelines which
                  will help you in the upload process.
                </span>
              </div>
              <div className="guide__wrapper">
                <span className=" subtitle__icon">
                  <i className="fas fa-list-check"></i>
                </span>
                <span className="subtitle__text">
                  The guideline includes Femto accounts classifications that
                  should be mapped to the companies account and the date formats
                  that are acceptable depending on the period frequency
                </span>
              </div>
              <div className="guide__wrapper">
                <span className="subtitle__icon">
                  <i className="fas fa-file-check"></i>
                </span>
                <span className="subtitle__text">
                  Validate your data before upload in order for Femto to provide
                  you with accurate analysis
                </span>
              </div>
            </Grid>
            <div className="upload__action__buttons">
              <Grid>
                <Grid.Col span={3}>
                  <Flex align="center" justify="center">
                    <Button
                      onClick={() => {
                        window.open(guidelines, "_blank");
                      }}
                      className="guideline_btn"
                      variant="outline"
                      size="lg"
                      leftIcon={<i className="fas fa-list-check"></i>}
                    >
                      View Guidelines
                    </Button>
                  </Flex>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Flex align="center" justify="center">
                    <a href={Example} download="Femto Upload Example.xlsx">
                      <Button
                        className="example__button"
                        size="lg"
                        leftIcon={<i className="fas fa-file-excel"></i>}
                      >
                        Download Example
                      </Button>
                    </a>
                  </Flex>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Flex align="center" justify="center">
                    <TutorialVideoOutline videoKey={"upload_excel"} />
                  </Flex>
                </Grid.Col>
              </Grid>
            </div>

            <div className="upload__divider"></div>

            <div className="import__excel__section">
              <p className="import__excel__section__title">
                Import your financial data from Excel (.xlsx or .csv).
              </p>

              {stage === "upload" && (
                <>
                  <p className="import__excel__section__subtitle">
                    Providing following company details is mandatory to activate
                    the uploading option
                  </p>
                  <form
                    onSubmit={uploadExcelForm.onSubmit((values) =>
                      handleFormSubmit(values)
                    )}
                  >
                    <div className="upload__section__options">
                      <Grid columns={12}>
                        <Grid.Col span={6}>
                          <SingleDropdown
                            label="Period Frequency"
                            withAsterisk
                            data={periodFrequencyOptions}
                            disabled={uploading}
                            data-testid="period-frequency"
                            form={uploadExcelForm}
                            field={"periodFrequency"}
                            optionLabel={"label"}
                            optionValue={"value"}
                          />
                        </Grid.Col>
                        {!editMode && (
                          <Grid.Col span={6}>
                            <SingleDropdown
                              label="Fiscal Year start month"
                              withAsterisk
                              data={fiscalYearStartMonthOptions}
                              disabled={uploading}
                              form={uploadExcelForm}
                              field={"fiscalYearStartMonth"}
                              data-testid="fiscal-year-start-month"
                              optionLabel={"label"}
                              optionValue={"value"}
                            />
                          </Grid.Col>
                        )}
                        <Grid.Col>
                          <FileButton
                            className="upload__button"
                            size="lg"
                            style={{ fontWeight: "300" }}
                            fullWidth
                            data-testid="upload-button"
                            radius={"md"}
                            accept={
                              ".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            }
                            onChange={(files) => handleFileUpload(files)}
                            inputProps={{
                              "data-testid": "upload_button_input",
                            }}
                          >
                            {(props) => (
                              <Button
                                className="upload__button"
                                size="lg"
                                fullWidth
                                disabled={isDisabled()}
                                radius={"lg"}
                                {...props}
                                type="button"
                                data-testid="upload_file_input"
                              >
                                <i className="fas fa-cloud-arrow-up"></i>
                                <span className="upload__button__inner">
                                  Upload Excel file
                                </span>
                              </Button>
                            )}
                          </FileButton>
                        </Grid.Col>
                        <Grid.Col>
                          <Dropzone
                            multiple={false}
                            className="dropzone__container"
                            onDrop={(files) => {
                              handleFileUpload(files[0]);
                            }}
                            data-testid="dropzone"
                            disabled={
                              !uploadExcelForm.values.periodFrequency ||
                              !uploadExcelForm.values.fiscalYearStartMonth ||
                              uploading
                            }
                            accept={[MIME_TYPES.xlsx, MIME_TYPES.csv]}
                          >
                            <Group
                              position="center"
                              spacing="xl"
                              style={{
                                minHeight: 120,
                                pointerEvents: "none",
                              }}
                            >
                              <div>
                                <Text
                                  className="dropzone__container__title"
                                  color="dimmed"
                                >
                                  Or drag & drop the file here
                                </Text>
                              </div>
                            </Group>
                          </Dropzone>
                        </Grid.Col>
                        {showUploadProgress ? (
                          <Grid.Col span={12}>
                            <Progress
                              data-testid="upload_progress_id"
                              value={uploadProgress}
                              size={30}
                              label={`${uploadProgress} %`}
                              radius={"md"}
                            />
                          </Grid.Col>
                        ) : null}
                        <Grid.Col span={12}>
                          <div className="go__back__wrapper">
                            <span
                              onClick={() => {
                                navigate("/");
                              }}
                              className="go__back__text"
                            >
                              Choose another import method
                            </span>
                          </div>
                        </Grid.Col>
                      </Grid>
                    </div>
                  </form>
                </>
              )}

              {stage === "upload-failure" && (
                <>
                  <FemtoAlert
                    data-testid="failure-message"
                    headline="Invalid Sheet format"
                    caption={fileName && fileName}
                    state="error"
                    icon={
                      <div className="upload__message__icon__wrapper">
                        <i className="fas fa-file-excel"></i>
                        <i className="fas fa-times-circle check__icon"></i>
                      </div>
                    }
                    side={
                      <>
                        <Button
                          onClick={() => {
                            setShowErrorModal(true);
                          }}
                          fullWidth
                          radius={"md"}
                          type="button"
                          className="errors__btn"
                          data-testid="errors_upload_excel"
                        >
                          Show my errors
                        </Button>
                        <Button
                          fullWidth
                          radius={"md"}
                          variant="outline"
                          type="button"
                          data-testid="try-upload-again"
                          className="upload__again__btn"
                          onClick={handleUploadAgain}
                        >
                          Try upload again
                        </Button>
                      </>
                    }
                  >
                    There's something wrong in the Excel sheet file (ex
                    classification, company name), please check your errors and
                    upload the correct classifications
                  </FemtoAlert>
                </>
              )}
            </div>
          </Grid.Col>
          <Grid.Col span={4} className="upload__excel__art art__work">
            <img src={homeImg} alt="Home" className="home__img" />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};

export default UploadExcel;
