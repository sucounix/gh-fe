import { Affix, Popover, Skeleton, Transition } from "@mantine/core";
import React, { useState, useEffect } from "react";
import axios from "axios";
import astraButton from "../../../assets/images/astra-chat-button.svg";
import astraButtonClosed from "../../../assets/images/astra-button-closed.svg";
import AstraChatMessages from "./AstraChatMessages/AstraChatMessages";
import AstraChatSubHeader from "./AstraChatSubHeader/AstraChatSubHeader";
import AstraPredefinedQuestion from "./astra-predefined-questions/AstraPredefinedQuestion";
import AstraChatInput from "./AstraChatInput/AstraChatInput";
import AstraChatHeader from "./AstraChatHeader/AstraChatHeader";
import AstraChatHistory from "./AstraChatHistory/AstraChatHistory";
import { handleResponseError } from "../../../utils/errorHandling";
import {
  ASTRA_PREDEFINED_QUESTIONS,
  CHECK_MSG_STATUS_TIMER,
  ASTRA_MESSAGE_STATUS_COMPLETED,
  ASTRA_MESSAGE_STATUS_FAILED,
  ROLE_USER,
  ROLE_ASSISTANT,
  RESEND_LAST_MSG_STATUS,
  FAILED_LAST_MSG_STATUS,
} from "../../../constant/astraChat";
import "./AstraChatAffix.scss";
import { useLocalStorage } from "@mantine/hooks";

function AstraChatAffix() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [loader, setLoader] = useState(false);
  const [disableConversation, setDisableConversation] = useState(true);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [isAstraTokensEnough, setIsAstraTokensEnough] = useState(true);

  const [threadId, setThreadId] = useLocalStorage({
    key: "current_astra_thread_id",
    defaultValue: "",
  });

  useEffect(() => {
    if (isChatOpen) getCurrentConversation();
    return () => {
      setDisableConversation(false);
    };
  }, [isChatOpen, threadId]);

  useEffect(() => {
    let timeoutCheckLastMsg;

    if (isAssistantLoading) {
      timeoutCheckLastMsg = setTimeout(() => {
        checkLastMsgStatus();
      }, CHECK_MSG_STATUS_TIMER);
    }
    return () => {
      clearTimeout(timeoutCheckLastMsg);
    };
  }, [isAssistantLoading]);

  const getCurrentConversation = () => {
    if (threadId) {
      setDisableConversation(true);
      setLoader(true);

      axios
        .get(`/astra/chat/messages?thread_id=${threadId}`)
        .then((res) => {
          setConversation(res.data.messages);
          setLoader(false);
          if (res.data?.messages.at(-1).role === ROLE_USER) {
            setIsAssistantLoading(true);
            checkLastMsgStatus();
          } else {
            setDisableConversation(false);
          }
        })
        .catch((err) => {
          handleResponseError(err);
          setLoader(false);
        });
    } else {
      setDisableConversation(false);
    }
  };

  const handleSendMessage = (message) => {
    const endpoint = threadId
      ? `/astra/chat?thread_id=${threadId}`
      : `/astra/chat`;
    setDisableConversation(true);

    axios
      .post(endpoint, {
        message: message,
      })
      .then((res) => {
        const newMessage = {
          message: message,
          role: ROLE_USER,
        };
        setThreadId(res.data.thread_id);
        setConversation([...conversation, newMessage]);
        setIsAssistantLoading(true);
      })
      .catch((error) => {
        setIsAstraTokensEnough(error?.response?.data !== "Not enough tokens.");
        handleResponseError(error);

        const newMessage = {
          message: message,
          role: ROLE_USER,
          status: ASTRA_MESSAGE_STATUS_FAILED,
        };
        setConversation([...conversation, newMessage]);
        setDisableConversation(false);
      });
  };

  const checkLastMsgStatus = () => {
    axios
      .get(`/astra/chat/last_message?thread_id=${threadId}`)
      .then((res) => {
        if (RESEND_LAST_MSG_STATUS.includes(res.data.status)) {
          return setTimeout(() => {
            checkLastMsgStatus();
          }, CHECK_MSG_STATUS_TIMER);
        }
        setThreadId(res.data.thread_id);

        let newMessage = {};

        if (FAILED_LAST_MSG_STATUS.includes(res.data.status)) {
          let conversationCopy = [...conversation];
          conversationCopy.at(-1).status = ASTRA_MESSAGE_STATUS_FAILED;
          setConversation([...conversationCopy]);
        }
        if (res.data.status === ASTRA_MESSAGE_STATUS_COMPLETED) {
          newMessage = {
            message: res.data.message,
            role: ROLE_ASSISTANT,
          };
          setConversation([...conversation, newMessage]);
        }
        setIsAssistantLoading(false);
        setDisableConversation(false);
      })
      .catch((error) => {
        let conversationCopy = [...conversation];
        conversationCopy.at(-1).status = ASTRA_MESSAGE_STATUS_FAILED;
        setConversation([...conversationCopy]);
        setIsAssistantLoading(false);
        setDisableConversation(false);
        handleResponseError(error);
      });
  };

  const handleCreateNewSession = () => {
    setThreadId(null);
    setConversation([]);
  };

  return (
    <div className="astra-affix">
      <Transition transition="slide-up" mounted>
        {(transitionStyles) => (
          <Popover
            width={500}
            shadow="md"
            offset={20}
            position={"bottom-end"}
            styles={{
              dropdown: {
                height: "70vh",
                padding: 0,
                margin: 0,
                borderRadius: 20,
                border: "0.5px solid #771DFC",
              },
            }}
            onChange={(opened) => {
              setIsChatOpen(opened);
            }}
          >
            <Popover.Target>
              <img
                src={isChatOpen ? astraButtonClosed : astraButton}
                className="astra-button"
                alt="Astra Chat Button"
                style={transitionStyles}
                data-testid="astra-chat-affix"
              />
            </Popover.Target>
            <Popover.Dropdown>
              <div className="astra__chat" data-testid="astra-chat-dropdown">
                <div
                  id="header"
                  className={`${
                    isHistoryOpen
                      ? "astra__chat__header_history"
                      : "astra__chat__header_Conversation"
                  }`}
                  data-testid="astra-chat-header"
                >
                  <AstraChatHeader
                    setIsHistoryOpen={setIsHistoryOpen}
                    isHistoryOpen={isHistoryOpen}
                  />
                </div>
                {isHistoryOpen ? (
                  <AstraChatHistory
                    setThreadId={setThreadId}
                    setIsHistoryOpen={setIsHistoryOpen}
                    setIsChatOpen={setIsChatOpen}
                  />
                ) : (
                  <>
                    <div
                      id="message-view"
                      className="astra__chat__message__view"
                      data-testid="astra-chat-message-view"
                    >
                      <AstraChatSubHeader
                        threadId={threadId}
                        isAstraTokensEnough={isAstraTokensEnough}
                        handleCreateNewSession={handleCreateNewSession}
                      />

                      {loader ? (
                        <div className="astra_chat_loader">
                          <Skeleton className="astra__chat__message__user" />
                          <Skeleton className="astra__chat__message__astra" />
                          <Skeleton className="astra__chat__message__user" />
                          <Skeleton className="astra__chat__message__astra" />
                        </div>
                      ) : (
                        <AstraChatMessages
                          conversation={conversation}
                          isAssistantLoading={isAssistantLoading}
                        />
                      )}

                      {!conversation.length && !loader && (
                        <div
                          className="astra__chat__predfined__questions"
                          data-testid="astra-chat-predefined-questions"
                        >
                          {ASTRA_PREDEFINED_QUESTIONS.map((question, index) => (
                            <AstraPredefinedQuestion
                              key={index}
                              question={question}
                              sendMessage={handleSendMessage}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <AstraChatInput
                      handleSendMessage={handleSendMessage}
                      disableConversation={disableConversation}
                    />
                  </>
                )}
              </div>
            </Popover.Dropdown>
          </Popover>
        )}
      </Transition>
    </div>
  );
}

export default AstraChatAffix;
