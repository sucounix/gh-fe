import React, { useContext, useEffect } from "react";
import EditReportText from "../edit-text/EditReportText";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Popover } from "@mantine/core";
import "./style/ViewReportText.scss";
import DeleteReportItemModal from "../../../../../../../components/modals/delete-report-item/DeleteReportItemModal";
import astraLogo from "../../../../../../../assets/images/astra-edit-text.png";
import AstraTokensPopover from "../../../AstraTokensPopover";
import { SubscriptionContext } from "../../../../../../../contexts/SubscriptionContext";
import {
  ASTRA_PLAN_ANNUALLY,
  ASTRA_PLAN_MONTHLY,
} from "../../../../../../../constant/SubscriptionPlans";
import { isAstraButtonEnabled } from "../../../../helper/Helper";

const ViewReportText = ({
  item,
  textContent,
  isCoverSection = false,
  sectionIndex,
  setReportDetails,
  reportDetails,
}) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [openedDelete, deleteHandlers] = useDisclosure(false);
  const [text, setText] = useState(textContent);
  const [deletedItemInfo, setDeletedItemInfo] = useState(null);
  const [generateOnRender, setGenerateOnRender] = useState(false);
  const [showHoverPopup, setShowHoverPopup] = useState(true);
  const [generateMode, setGenerateMode] = useState(null);
  const [showAstraPopover, setShowAstraPopover] = useState(false);
  const [nextItem, setNextItem] = useState(null);

  const { isAllowedToUseAstra, subscriptionInfo } =
    useContext(SubscriptionContext);

  const handleAstraClick = () => {
    if (isAllowedToUseAstra()) {
      setShowHoverPopup(false);
      setShowAstraPopover(true);
    } else {
      setShowAstraPopover(false);
    }
  };

  const handleAstraPopoverClose = () => {
    setShowHoverPopup(true);
    setShowAstraPopover(false);
  };

  const handleGenerate = () => {
    setShowAstraPopover(false);
    setGenerateOnRender(true);
    setOpenEditor(true);
    setShowHoverPopup(true);
  };

  useEffect(() => {
    if (generateMode) {
      handleGenerate();
    }
  }, [generateMode]);

  useEffect(() => {
    return () => {
      setGenerateOnRender(false);
    };
  }, []);

  useEffect(() => {
    if (
      subscriptionInfo?.planCode == ASTRA_PLAN_ANNUALLY ||
      subscriptionInfo?.planCode == ASTRA_PLAN_MONTHLY
    ) {
      const tempItems = [].concat.apply(
        [],
        reportDetails?.sections.map((section) => {
          return section.items.map((item) => {
            return item;
          });
        })
      );
      setNextItem(
        tempItems[tempItems.findIndex((i) => i.uuid === item.uuid) + 1]
      );
    }
  }, []);

  useEffect(() => {
    setText(textContent);
  }, [textContent]);

  return openEditor ? (
    <div data-testid="text-editor">
      <EditReportText
        textContent={textContent}
        setOpenEditor={setOpenEditor}
        setReportDetails={setReportDetails}
        item={item}
        isCoverSection={isCoverSection}
        sectionIndex={sectionIndex}
        generateOnRender={generateOnRender}
        setGenerateOnRender={setGenerateOnRender}
        reportDetails={reportDetails}
        generateMode={generateMode}
        setGenerateMode={setGenerateMode}
        nextItem={nextItem}
      />
    </div>
  ) : (
    <div className="view_text_container" data-testid={`view_text_${item.uuid}`}>
      <div
        className="text_content"
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      ></div>
      <div className="optionsTop">
        {isCoverSection ? null : (
          <span className="astra__action__wrapper">
            <Popover
              opened={showAstraPopover}
              onClose={handleAstraPopoverClose}
              position="bottom"
              withArrow
              width={200}
              radius={10}
            >
              <Popover.Target>
                <div>
                  <button
                    data-testid="astra__button"
                    className="astra__button"
                    onClick={handleAstraClick}
                    disabled={!isAstraButtonEnabled(nextItem)}
                    style={{
                      cursor: `${
                        !isAstraButtonEnabled(nextItem)
                          ? "not-allowed"
                          : "pointer"
                      }`,
                    }}
                  >
                    <img src={astraLogo} alt="astra" width="15" />
                  </button>

                  {showHoverPopup && (
                    <div className="astra__hover__card">
                      <AstraTokensPopover />
                    </div>
                  )}
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <div
                  className="astra__popover__card"
                  data-testid="astra__popover__card"
                >
                  <span className="astra__popover__card__title">Text View</span>
                  <div className="astra__popover__card__options">
                    <span
                      className="astra__popover__card__option"
                      data-testid="detailed__option"
                      onClick={() => setGenerateMode("detailed")}
                    >
                      Detailed
                    </span>
                    <span
                      className="astra__popover__card__option"
                      data-testid="summarised__option"
                      onClick={() => setGenerateMode("summarised")}
                    >
                      Summarised
                    </span>
                  </div>
                </div>
              </Popover.Dropdown>
            </Popover>
          </span>
        )}
        <span onClick={() => setOpenEditor(true)} data-testid="edit_text">
          <i className="fa-solid fa-pen-to-square icon"></i>
        </span>
        <span
          onClick={() => {
            setDeletedItemInfo({
              item: item,
              isCoverSection: isCoverSection,
              sectionIndex: sectionIndex,
              type: item.type,
            });
            deleteHandlers.open();
          }}
        >
          <i className="fa-solid fa-trash-can icon"></i>
        </span>
      </div>

      {/* delete section popup  */}
      <Modal
        withCloseButton={false}
        opened={openedDelete}
        onClose={() => deleteHandlers.close()}
        radius={20}
        padding={0}
      >
        <DeleteReportItemModal
          deleteHandlers={deleteHandlers}
          deletedItemInfo={deletedItemInfo}
          setReportDetails={setReportDetails}
        />
      </Modal>
    </div>
  );
};
export default ViewReportText;
