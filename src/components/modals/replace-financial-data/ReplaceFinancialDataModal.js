import { Button, Modal } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import React, { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import translation from "../../../locales/en.json";

function ReplaceFinancialDataModal({
  confirmReplaceFinancialDataModalopened,
  setConfirmReplaceFinancialDataModalopened,
  setOpenEditPeriodModal,
  editMode,
  setEditMode,
}) {
  const navigate = useNavigate();
  const params = useParams();
  const { width } = useViewportSize();
  const { selectedCompany } = useContext(CompaniesContext);

  return (
    <Modal
      radius={"lg"}
      size={
        width < 810
          ? "calc(100vw - 3rem)"
          : width < 1199
          ? "calc(70vw - 3rem)"
          : "calc(40vw - 3rem)"
      }
      opened={confirmReplaceFinancialDataModalopened}
      centered
      onClose={() => setConfirmReplaceFinancialDataModalopened(false)}
      data-testid="confirm_replace_data_modal"
    >
      <div className="replace__modal">
        <p className="replace__modal_title">
          <span>
            <i className="fa-solid fa-triangle-exclamation"></i>
          </span>
          {translation.analysis.settings.updatingDataWarningTitle}
        </p>
        <p className="replace__modal_text">
          {translation.analysis.settings.updatingDataWarningFirstPart}{" "}
          <Link
            to={`/company/${selectedCompany.uuid}/reports`}
            className="reports__hyperlink"
          >
            {translation.reports.title}
          </Link>{" "}
          {translation.analysis.settings.updatingDataWarningSecondPart}
        </p>
        <p className="replace__modal_text">
          {translation.analysis.settings.updatingDataWarningMessage}
        </p>
        <p className="replace__modal__question">
          {translation.analysis.settings.updatingDataWarningConfirmation}
        </p>
        <div className="btn__div">
          <Button
            size="lg"
            radius={"md"}
            fullWidth
            className="confirm__btn"
            data-testid="confirm_replace_btn"
            onClick={() => {
              if (editMode === "dataUpdate") {
                setOpenEditPeriodModal(true);
                setConfirmReplaceFinancialDataModalopened(false);
              } else if (editMode === "reupload") {
                navigate("/upload/excel", {
                  state: {
                    companyId: params.companyId,
                  },
                });
              }

              setEditMode("");
            }}
          >
            {translation.analysis.settings.continueUpdating}
          </Button>
          <Button
            size="lg"
            radius={"md"}
            className="cancel__btn"
            fullWidth
            variant="outline"
            onClick={() => setConfirmReplaceFinancialDataModalopened(false)}
          >
            {translation.analysis.settings.cancelUpdating}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ReplaceFinancialDataModal;
