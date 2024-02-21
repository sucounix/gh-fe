import { Button } from "@mantine/core";
import React from "react";
import "./style/DeleteReportItemModal.scss";
import axios from "axios";
import { handleResponseError } from "../../../utils/errorHandling";

function DeleteReportItemModal({
  deleteHandlers,
  deletedItemInfo,
  setReportDetails,
}) {
  const remove = () => {
    if (deletedItemInfo?.isCoverSection) {
      axios
        .put(`/report/cover/${deletedItemInfo?.item.uuid}`, {
          section_body: "",
        })
        .then(() => {
          setReportDetails((prev) => {
            return {
              ...prev,
              cover: {
                ...prev.cover,
                section_body: "",
              },
            };
          });
        })
        .catch((err) => {
          handleResponseError(err);
        })
        .finally(() => {
          deleteHandlers.close();
        });
    } else {
      axios
        .delete(`report/item/${deletedItemInfo?.item.uuid}/`)
        .then(() => {
          setReportDetails((prev) => {
            return {
              ...prev,
              sections: prev.sections.map((sectionItem, index) => {
                if (index === deletedItemInfo?.sectionIndex) {
                  return {
                    ...sectionItem,
                    items: sectionItem.items.filter(
                      (entry) => entry.uuid !== deletedItemInfo?.item.uuid
                    ),
                  };
                } else {
                  return sectionItem;
                }
              }),
            };
          });
        })
        .catch((e) => {
          handleResponseError(e);
        })
        .finally(() => {
          deleteHandlers.close();
        });
    }
  };

  return (
    <div className="delete__item__modal" data-testid="delete-modal">
      <div className="delete__item__modal__header">
        <div className="delete__item__modal__title">
          <i class="fa-solid fa-exclamation-triangle"></i>
          <span data-testid="delete_title">
            Are you sure you want to delete this {deletedItemInfo?.type}
          </span>
        </div>

        <span className="consent__warning">
          By pressing{" "}
          <span
            style={{
              fontWeight: 500,
            }}
          >
            Yes, I am sure
          </span>
          you will delete{" "}
          {deletedItemInfo?.type === "text"
            ? "the whole text"
            : deletedItemInfo?.type}
        </span>
      </div>
      <span className="proceed__consent">Would you still like to proceed?</span>
      <div className="delete__btns">
        <Button
          className="delete__btn"
          size="lg"
          color="red"
          data-testid="delete-btn"
          onClick={remove}
        >
          Yes, I am sure
        </Button>
        <Button
          className="cancel__btn"
          size="lg"
          variant="outline"
          data-testid="cancel-btn"
          onClick={() => {
            deleteHandlers.close();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default DeleteReportItemModal;
