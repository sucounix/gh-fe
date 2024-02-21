import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./style/EditReportText.scss";
import { handleResponseError } from "../../../../../../../utils/errorHandling";
import translation from "../../../../../../../locales/en.json";

import astraLogo from "../../../../../../../assets/images/astra-edit-text.png";
import astraLoader from "../../../../../../../assets/images/astra-loader.gif";

import { Box, Button, ColorPicker, Popover } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { RichTextEditor, Link } from "@mantine/tiptap";

import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import TextStyle from "@tiptap/extension-text-style";
import { FontColor } from "./extensions/FontColor";
import { SubscriptionContext } from "../../../../../../../contexts/SubscriptionContext";
import {
  ASTRA_PLAN_ANNUALLY,
  ASTRA_PLAN_MONTHLY,
} from "../../../../../../../constant/SubscriptionPlans";
import AstraTokensPopover from "../../../AstraTokensPopover";
import UpgradeSubscriptionForAstraKit from "../../../../../../../components/modals/upgrade-susbcription-for-astra-kit/UpgradeSubscriptionForAstraKit";
import { isAstraButtonEnabled } from "../../../../helper/Helper";

const MAX_TEXT_LENGTH = 396; // which is equal to 10.5cm in the PDF A4 page
const EditReportText = ({
  textContent,
  setOpenEditor,
  setReportDetails,
  item,
  isCoverSection,
  sectionIndex,
  generateOnRender = false,
  reportDetails,
  setGenerateOnRender,
  generateMode = null,
  setGenerateMode,
  nextItem,
}) => {
  const textEditorContentRef = useRef(null);
  const [isBeyondLimit, setIsBeyondLimit] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [editorRendered, setEditorRendered] = useState(false);
  const [showUpgradeSubscriptionPopup, setShowUpgradeSubscriptionPopup] =
    useState(false);
  const [showHoverPopup, setShowHoverPopup] = useState(true);
  const [showAstraPopover, setShowAstraPopover] = useState(false);
  const { subscriptionInfo, fetchSubscriptionInfo, isAllowedToUseAstra } =
    useContext(SubscriptionContext);

  const navigate = useNavigate();

  const handleAstraClick = () => {
    if (isAllowedToUseAstra()) {
      setShowHoverPopup(false);
      setShowAstraPopover(true);
    } else {
      setShowUpgradeSubscriptionPopup(true);
    }
  };

  const handleOptionClick = (mode) => {
    setShowAstraPopover(false);
    setGenerateMode(mode);
  };

  const handleAstraPopoverClose = () => {
    setShowHoverPopup(true);
  };

  const closeUpgradeSubscriptionPopup = () => {
    setShowUpgradeSubscriptionPopup(false);
  };

  const generateText = (approval_uuid = null) => {
    if (
      subscriptionInfo?.planCode !== ASTRA_PLAN_ANNUALLY &&
      subscriptionInfo?.planCode !== ASTRA_PLAN_MONTHLY
    ) {
      navigate(`/organisation-settings/subscription-settings`);
    } else {
      if (isAllowedToUseAstra()) {
        setIsGeneratingText(true);
        editor.setEditable(false);

        let path = approval_uuid
          ? `astra/ai/${nextItem?.uuid}?req_uuid=${approval_uuid}&request_type=${generateMode}`
          : `astra/ai/${nextItem?.uuid}?request_type=${generateMode}`;
        axios
          .get(path)
          .then((res) => {
            const waitTime = res?.data?.estimated_completion_time;
            if (waitTime) {
              const waitTimeInMs = waitTime * 1000;
              setTimeout(() => {
                generateText(res?.data?.approval_uuid);
              }, waitTimeInMs);
            } else {
              const replacedContent = res?.data?.data.replace(/\n/g, "<br/>");
              editor.commands.setContent(replacedContent);
              setIsGeneratingText(false);
              setGenerateOnRender(false);
              editor.setEditable(true);
              fetchSubscriptionInfo();
            }
          })
          .catch((e) => {
            handleResponseError(e);
            setIsGeneratingText(false);
            editor.setEditable(true);
          });
      } else {
        setShowUpgradeSubscriptionPopup(true);
      }
    }
  };

  const editor = useEditor({
    onUpdate: () => {
      setIsBeyondLimit(
        isCoverSection &&
          textEditorContentRef.current.clientHeight > MAX_TEXT_LENGTH
      );
    },
    onCreate: () => {
      setIsBeyondLimit(
        isCoverSection &&
          textEditorContentRef.current.clientHeight > MAX_TEXT_LENGTH
      );
      setEditorRendered(true);
    },
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      FontColor,
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: textContent,
  });

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);

      if (editorRendered && generateOnRender) {
        generateText();
      }
    } else if (generateMode && editor) {
      generateText();
      setGenerateMode(null);
      setShowAstraPopover(false);
    }
  }, [generateMode, editor, editorRendered, generateOnRender, firstRender]);

  const submit = () => {
    if (editor.getText().length > 0) {
      let content = editor
        .getHTML()
        .replace(new RegExp("<p></p>", "g"), "<p><br/></p>");

      let endpoint = "";
      let requestData = {};

      if (isCoverSection) {
        endpoint = `report/cover/${item.uuid}`;
        requestData.section_body = content;
      } else {
        endpoint = `report/text_item/${item.text_item.uuid}`;
        requestData.value = content;
      }

      axios
        .put(endpoint, requestData)
        .then(() => {
          if (isCoverSection) {
            setReportDetails((prev) => {
              return {
                ...prev,
                cover: {
                  ...prev.cover,
                  section_body: content,
                },
              };
            });
          } else {
            setReportDetails((prev) => {
              const newReportDetails = { ...prev };
              const targetSection = newReportDetails.sections[sectionIndex];
              const targetItem = targetSection.items.find(
                (i) => i.uuid === item.uuid
              );
              targetItem.text_item.value = content;
              return newReportDetails;
            });
          }
        })
        .catch((e) => {
          handleResponseError(e);
        });
    } else {
      showNotification({
        title: "Text editor cannot be empty. Please delete text instead.",
        color: "red",
      });
    }
  };
  return (
    <div className="edit_text_container">
      <Box pos="relative">
        <RichTextEditor
          styles={{
            root: {
              border: isCoverSection && isBeyondLimit && "1px solid #F03E3E",
            },
            toolbar: isCoverSection &&
              isBeyondLimit && { backgroundColor: "#FFF5F5" },
          }}
          editor={editor}
          data-testid="text_editor"
        >
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <button className="color_button">
                    <i className="fa-solid fa-palette"></i>{" "}
                  </button>
                </Popover.Target>
                <Popover.Dropdown>
                  <ColorPicker
                    onChange={(color) => {
                      editor.commands.setColor(color);
                    }}
                  ></ColorPicker>
                </Popover.Dropdown>
              </Popover>
            </RichTextEditor.ControlsGroup>
            {!isCoverSection && (
              <div className={`optionsTop`}>
                <span className="astra__action__wrapper">
                  <Popover
                    opened={showAstraPopover}
                    onChange={(opened) => setShowAstraPopover(opened)}
                    onClose={handleAstraPopoverClose}
                    position="bottom"
                    withArrow
                    keepMounted
                    width={200}
                    radius={10}
                  >
                    <Popover.Target>
                      <div data-testid="popover__target">
                        <div className="astra">
                          <button
                            className="astra__button"
                            data-testid="astra__button"
                            disabled={
                              !isAstraButtonEnabled(nextItem) ||
                              isGeneratingText
                            }
                            onClick={handleAstraClick}
                            style={{
                              cursor: `${
                                !isAstraButtonEnabled(nextItem)
                                  ? "not-allowed"
                                  : "pointer"
                              }`,
                            }}
                          >
                            <img src={astraLogo} alt="Astra" />
                          </button>
                        </div>
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
                        <span className="astra__popover__card__title">
                          Text View
                        </span>
                        <div className="astra__popover__card__options">
                          <span
                            className="astra__popover__card__option"
                            onClick={() => handleOptionClick("detailed")}
                            data-testid="detailed__option"
                          >
                            Detailed
                          </span>
                          <span
                            className="astra__popover__card__option"
                            onClick={() => handleOptionClick("summarised")}
                            data-testid="summarised__option"
                          >
                            Summarised
                          </span>
                        </div>
                      </div>
                    </Popover.Dropdown>
                  </Popover>
                </span>
              </div>
            )}

            <div className="save__container">
              <Button
                onClick={() => {
                  setOpenEditor(false);
                  submit();
                }}
                size="xs"
                data-testid="save_button"
                className="save_button"
                disabled={isBeyondLimit}
              >
                Save
              </Button>
            </div>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content
            data-testid="text_editor_wrapper"
            ref={textEditorContentRef}
          />
        </RichTextEditor>
        {isGeneratingText ? (
          <>
            <div className="overlay__wrapper">
              <img src={astraLoader} alt="Astra" />
            </div>
          </>
        ) : (
          <></>
        )}
      </Box>
      {isBeyondLimit && (
        <div className="error__wrapper">
          <span>{translation.reports.coverLimitError}</span>
        </div>
      )}
      {showUpgradeSubscriptionPopup && (
        <UpgradeSubscriptionForAstraKit
          pricePlan={"1,500"}
          showUpgradeSubscriptionPopup={showUpgradeSubscriptionPopup}
          closeUpgradeSubscriptionPopup={closeUpgradeSubscriptionPopup}
        />
      )}
    </div>
  );
};
export default EditReportText;
