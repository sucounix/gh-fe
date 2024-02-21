import React, { useState } from "react";
import { Popover, Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditSectionTitle from "./EditSectionTitle";
import "./style/SectionTitle.scss";
import axios from "axios";
import { handleResponseError } from "../../../../../../utils/errorHandling";

const SectionTitle = ({
  section,
  sectionIndex,
  reportDetails,
  setReportDetails,
}) => {
  const [openedEdit, editHandlers] = useDisclosure(false);
  const [openedDelete, deleteHandlers] = useDisclosure(false);
  const [openOptionsPopup, setOpenOptionsPopup] = useState(false);

  const deleteSection = () => {
    axios
      .delete(`report/section/${section.uuid}/`)
      .then((res) => {
        setReportDetails({
          ...reportDetails,
          sections: reportDetails.sections.filter(
            (item) => item.uuid !== section.uuid
          ),
        });
      })
      .catch((e) => {
        handleResponseError(e);
      });
  };

  return (
    <div className="section__div">
      <span>{section.title}</span>
      <Popover
        opened={openOptionsPopup}
        width={120}
        position="bottom"
        withArrow
        shadow="md"
      >
        <Popover.Target onClick={() => setOpenOptionsPopup(true)}>
          <span className="dot__icon" data-testid="edit-section-title">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </span>
        </Popover.Target>
        <Popover.Dropdown>
          <p
            className="sectio_title_edit_option"
            onClick={() => {
              setOpenOptionsPopup(false);
              editHandlers.open();
            }}
          >
            <span className="icon" data-testid="edit-btn">
              <i className="fa-solid fa-pen-to-square"></i>
            </span>
            <span>Edit</span>
          </p>
          <p
            className="sectio_title_delete_option"
            onClick={() => {
              setOpenOptionsPopup(false);
              deleteHandlers.open();
            }}
          >
            <span className="icon">
              <i class="fa-solid fa-trash-can"></i>
            </span>
            <span>Delete</span>
          </p>
        </Popover.Dropdown>
      </Popover>

      {/* edit title popup */}
      <Modal
        opened={openedEdit}
        withCloseButton={false}
        onClose={() => editHandlers.close()}
        centered
        size="lg"
        radius={"20px"}
      >
        <EditSectionTitle
          editHandlers={editHandlers}
          section={section}
          sectionIndex={sectionIndex}
          reportDetails={reportDetails}
          setReportDetails={setReportDetails}
        />
      </Modal>

      {/* delete section popup  */}
      <Modal
        opened={openedDelete}
        onClose={() => deleteHandlers.close()}
        withCloseButton={false}
        padding={0}
        centered
        radius={"20px"}
      >
        <div className="delete__section__modal">
          <div className="delete__section__modal__header">
            <div className="delete__section__modal__title">
              <i class="fa-solid fa-exclamation-triangle"></i>
              <span>Are you sure you want to delete this section</span>
            </div>
            <span className="consent__warning">
              By pressing{" "}
              <span
                style={{
                  fontWeight: 500,
                }}
              >
                Yes, I am sure
              </span>{" "}
              you will delete the whole section
            </span>
          </div>
          <span className="proceed__consent">
            Would you still like to proceed?
          </span>
          <div className="delete__btns">
            <Button
              className="delete__btn"
              size="lg"
              color="red"
              onClick={() => {
                deleteSection();
                deleteHandlers.close();
              }}
            >
              Yes, I am sure
            </Button>
            <Button
              className="cancel__btn"
              size="lg"
              variant="outline"
              onClick={() => {
                deleteHandlers.close();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SectionTitle;
