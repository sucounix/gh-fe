import React, { useState, useEffect, useContext } from "react";
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
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import homeImg from "../../../../../assets/images/Online Searching.png";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "@mantine/form";
import axios from "axios";
import guidelines from "../../../../../assets/documents/Breakdowns Upload Guidelines.pdf";
import Example_month from "../../../../../assets/documents/Femto Breakdowns Example-monthly.xlsx";
import Example_quarter from "../../../../../assets/documents/Femto Breakdowns Example - quarter.xlsx";
import Example_semi_annaul from "../../../../../assets/documents/Femto Breakdowns Example - semi annual.xlsx";
import Example_annual from "../../../../../assets/documents/Femto Breakdowns Example - annual.xlsx";
import UploadErrorsModal from "../../../../../components/modals/upload-errors/UploadErrorsModal";
import { useViewportSize } from "@mantine/hooks";
import "./style/BreakdownUpload.scss";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import { handleResponseError } from "../../../../../utils/errorHandling";
import TutorialVideoOutline from "../../../../../components/tutorial-video/TutorialVideoOutline";

const BreakdownUpload = ({ renderSegmentationView }) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedCompany } = useContext(CompaniesContext);

  const [fileError, setFileError] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(1);
  const [showUploadProgress, setShowUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  // if the user came from the settings , should return to the settings after upload
  const [backToSettingsState, setBackToSettingsState] = useState(false);
  const [companyFreq, setcompanyFreq] = useState(null);
  const { width } = useViewportSize();

  /* 
    stages: upload, upload-failure
  */
  const [stage, setStage] = useState("upload");

  const uploadExcelForm = useForm({
    initialValues: {
      file: "",
    },
  });

  useEffect(() => {
    if (location && location.state && location.state.backToSettings) {
      setBackToSettingsState(location.state.backToSettings);
    }
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      setcompanyFreq(selectedCompany.period_frequency);
    }
  }, [selectedCompany]);

  const handleFileUpload = (file) => {
    if (file?.name) setFileName(file?.name);

    const formData = new FormData();
    formData.append("raw_breakdown_data", file);

    handleFormSubmit(formData);
  };

  const handleUploadAgain = () => {
    setShowUploadProgress(false);
    setFileError([]);
    setStage("upload");
  };

  const handleFormSubmit = (values) => {
    setUploading(true);
    setShowUploadProgress(true);
    // the user can add and update the breakdown from the same view
    axios
      .post(`/analysis/breakdown/${params.companyId}/`, values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setInterval(() => {
          uploadProgress < 100 && setUploadProgress((prev) => prev + 1);
        }, 50);

        setTimeout(() => {
          setUploading(false);

          backToSettingsState
            ? navigate(
                `/company/${params.companyId}/analysis/settings/data-update`
              )
            : renderSegmentationView();
        }, 4500);
      })
      .catch((e) => {
        handleResponseError(e);
        setFileError(e.response?.data);
        setShowUploadProgress(0);
        setStage("upload-failure");
        setUploading(false);
      });
  };

  const renderExample = () => {
    switch (companyFreq) {
      case "month":
        return Example_month;
      case "quarter":
        return Example_quarter;
      case "semi-annual":
        return Example_semi_annaul;
      case "annual":
        return Example_annual;
    }
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
          show={setShowErrorModal}
          errors={fileError}
          guidelines={guidelines}
        />
      </Modal>
      <Container
        fluid
        className=" breakdown_container px__70"
        data-testid="breakdown_wrapper"
      >
        <Grid columns={12} className="breakdown__grid">
          <Grid.Col span={8} className="content">
            <p className="import__excel__title">Import Excel sheet</p>
            <Grid columns={12} align="center">
              <div className="guide__wrapper">
                <span className="subtitle__icon">
                  <i className="fas fa-cloud-arrow-up"></i>
                </span>
                <span className="subtitle__text">
                  Upload your segmentation analysis data after reading the
                  guidelines which will help you in the upload process.
                </span>
              </div>
              <div className="guide__wrapper">
                <span className=" subtitle__icon">
                  <i className="fas fa-list-check"></i>
                </span>
                <span className="subtitle__text">
                  The guideline includes Femto segmentation analysis
                  classifications that should be mapped to the companies account
                  and the date formats that are acceptable to create you
                  segmentation analysis
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
                      fullWidth
                      className="guideline__btn"
                      variant="outline"
                      size="lg"
                      leftIcon={<i className="fas fa-list-check"></i>}
                      data-testid="view-guidelines"
                    >
                      View Guidelines
                    </Button>
                  </Flex>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Flex align="center" justify="center">
                    <a
                      href={renderExample()}
                      download="Femto Breakdowns Upload Example.xlsx"
                      style={{ color: "white" }}
                      className="download_link"
                    >
                      <Button
                        className="example__button"
                        fullWidth
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
                    <TutorialVideoOutline videoKey={"upload_breakdown"} />
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
                  <form
                    onSubmit={uploadExcelForm.onSubmit((values) =>
                      handleFormSubmit(values)
                    )}
                  >
                    <div className="upload__section__options">
                      <Grid columns={12}>
                        <Grid.Col span={12}>
                          <FileButton
                            className="upload__button"
                            size="lg"
                            fullWidth
                            data-testid="upload-button"
                            radius={"md"}
                            accept={
                              ".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            }
                            onChange={(files) => handleFileUpload(files)}
                            inputProps={{
                              "data-testid": "upload_button_input_breakdown",
                            }}
                          >
                            {(props) => (
                              <Button
                                className="upload__button"
                                size="lg"
                                fullWidth
                                disabled={uploading}
                                radius={"lg"}
                                {...props}
                                type="button"
                              >
                                <i className="fas fa-cloud-arrow-up"></i>
                                <span className="upload__button__inner">
                                  Upload Excel file
                                </span>
                              </Button>
                            )}
                          </FileButton>
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <Dropzone
                            multiple={false}
                            className="dropzone__container"
                            onDrop={(files) => {
                              handleFileUpload(files[0]);
                            }}
                            data-testid="dropzone"
                            disabled={uploading}
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
                              value={uploadProgress}
                              size={30}
                              label={`${uploadProgress} %`}
                              radius={"md"}
                            />
                          </Grid.Col>
                        ) : null}
                      </Grid>
                    </div>
                  </form>
                </>
              )}

              {stage === "upload-failure" && (
                <div
                  data-testid="failure-message"
                  className="upload__failure__message"
                >
                  <div className="upload__file__title__wrapper">
                    <div className="upload__message__icon__wrapper">
                      <i className="fas fa-file-excel"></i>
                      <i className="fas fa-times-circle check__icon"></i>
                    </div>

                    <span className="file__name file__name__fail">
                      {fileName && fileName}
                    </span>
                  </div>
                  <div className="error__message__wrapper">
                    <div>
                      <p className="upload__failure__title">
                        Invalid Sheet format
                      </p>
                      <p className="upload__failure__subtitle">
                        There's something wrong in the Excel sheet file (ex
                        classification, company name), please check your errors
                        and upload the correct classifications
                      </p>
                    </div>

                    <div className="error__message__actions">
                      <Button
                        onClick={() => {
                          setShowErrorModal(true);
                        }}
                        fullWidth
                        radius={"md"}
                        type="button"
                        className="errors__btn"
                        data-testid="show-error"
                      >
                        Show my errors
                      </Button>
                      <Button
                        fullWidth
                        radius={"md"}
                        variant="outline"
                        type="button"
                        className="upload__again__btn"
                        data-testid="try-upload-again"
                        onClick={handleUploadAgain}
                      >
                        Try upload again
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Grid.Col>
          <Grid.Col className="art__work" span={4}>
            <img src={homeImg} alt="Home" className="home__img" />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};
export default BreakdownUpload;
