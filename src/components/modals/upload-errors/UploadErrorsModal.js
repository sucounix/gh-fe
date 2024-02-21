import { Button, Divider } from "@mantine/core";
import React from "react";
import "./style/UploadErrorsModal.scss";

function UploadErrorsModal({ errors, handleHideUploadError, guidelines }) {
  const errorsList = [];

  Object.keys(errors).forEach((key) => {
    errorsList.push({
      cell: key,
      error: errors[key],
    });
  });

  return (
    <div className="errors__modal" data-testid="errors__modal">
      <span className="error__modal__title">Invalid Sheet format</span>
      <span className="error__modal__subtitle">
        There's something wrong in the Excel sheet file (ex classification,
        company name), please check your errors and upload the correct
        classifications
      </span>
      <Divider className="modal__divider" />
      <div className="error__modal__errors">
        {errorsList &&
          errorsList.length &&
          errorsList.map((error, index) => {
            return (
              <div
                className="error__modal__error__wrapper"
                data-testid={`error_modal_text_${index}`}
                key={index}
              >
                {error.cell && (
                  <span className="error__modal__error__cell">
                    {error?.cell}
                  </span>
                )}

                <span className="error__modal__error__text">
                  {error?.error}
                </span>
              </div>
            );
          })}
      </div>
      <div className="error__modal__actions">
        <Button
          size="lg"
          w="35%"
          radius="md"
          variant="outline"
          className="error__modal__action__button"
          data-testid="view_guidelines_btn"
          onClick={() => {
            window.open(guidelines, "_blank");
          }}
          rightIcon={<i className="fas fa-list-check"></i>}
        >
          View Guidelines
        </Button>
        <Button
          onClick={handleHideUploadError}
          data-testid="cancel_btn"
          size="lg"
          w="35%"
          radius="md"
          className="error__modal__action__button"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default UploadErrorsModal;
