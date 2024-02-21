import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AstraChatAffix from "./AstraChatAffix";
import AstraChatMessages from "./AstraChatMessages/AstraChatMessages";
import AxiosMock from "axios";
import AstraPredefinedQuestion from "./astra-predefined-questions/AstraPredefinedQuestion";
import * as astraConstants from "../../../constant/astraChat";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
import { CompaniesContext } from "../../../contexts/CompaniesContext";

jest.mock("axios");
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

describe("AstraChatAffix", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetAllMocks();
    jest.clearAllMocks();
    window.localStorage.removeItem("current_astra_thread_id");
  });

  it("renders the AstraChatAffix component", () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );
    const astraChatAffix = screen.getByTestId("astra-chat-affix");
    expect(astraChatAffix).toBeInTheDocument();
  });

  it("opens and closes astra popup on click", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );

    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-header")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-subheader")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-message-view")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-messages")).toBeInTheDocument();
    });

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(
        screen.queryByTestId("astra-chat-dropdown")
      ).not.toBeInTheDocument();
    });
  });

  it("should get current conversation", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        messages: [
          {
            message: "Hello",
            role: "user",
          },
          {
            message: "Hello",
            role: "assistant",
          },
        ],
      },
    });
    window.localStorage.setItem("current_astra_thread_id", "123");
    render(<AstraChatAffix />);

    const astraButtonElement = screen.getByTestId("astra-chat-affix");
    fireEvent.click(astraButtonElement);

    const currentThreadID = localStorage.getItem("current_astra_thread_id");
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        `/astra/chat/messages?thread_id=${currentThreadID}`
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("message-body-0")).toBeInTheDocument();
    });
  });

  it("If the last msg in conv was a user msg, then should check the msg stauts", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        messages: [
          {
            message: "Hello",
            role: "user",
          },
        ],
      },
    });
    window.localStorage.setItem("current_astra_thread_id", "123");
    render(<AstraChatAffix />);

    const astraButtonElement = screen.getByTestId("astra-chat-affix");
    fireEvent.click(astraButtonElement);

    const currentThreadID = localStorage.getItem("current_astra_thread_id");
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        `/astra/chat/messages?thread_id=${currentThreadID}`
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("message-body-0")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    AxiosMock.get.mockResolvedValueOnce({
      data: {
        message: "Hello 2",
        role: "assistant",
      },
    });

    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        `/astra/chat/last_message?thread_id=${currentThreadID}`
      );
    });
  });

  it("should open history", async () => {
    AxiosMock.get.mockResolvedValueOnce({});

    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );
    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-header")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("historyButton"));

    await waitFor(() => {
      expect(screen.getByTestId("chatHistory")).toBeInTheDocument();
    });
  });

  it("should close history", async () => {
    AxiosMock.get.mockResolvedValueOnce({});

    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );
    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-header")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("historyButton"));
    const chatWithAstraButton = screen.getByTestId("chatWithAstraButton");
    await waitFor(() => {
      expect(chatWithAstraButton).toBeInTheDocument();
    });
    fireEvent.click(chatWithAstraButton);
    expect(screen.queryByTestId("chatHistory")).not.toBeInTheDocument();
  });

  it("when the user send msg , the message should send to the BE ", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );

    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    AxiosMock.post.mockResolvedValueOnce({ data: { message: "test" } });
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalled();
    });
    AxiosMock.get.mockResolvedValueOnce({ data: { message: "test" } });
    astraConstants.CHECK_MSG_STATUS_TIMER = 0;

    await waitFor(() => {
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
  });

  it("if the msg status checker was in_progress yet, the request should send again ", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );

    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    AxiosMock.post.mockResolvedValueOnce({ data: { message: "test" } });
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalled();
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: { status: "in_progress", message: "test" },
    });
    astraConstants.CHECK_MSG_STATUS_TIMER = 0;

    await waitFor(() => {
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    AxiosMock.get.mockResolvedValueOnce({ data: { message: "test" } });
    astraConstants.CHECK_MSG_STATUS_TIMER = 0;
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
  });

  it("if the msg status checker was compeleted yet, the assistant loader should be removed", async () => {
    astraConstants.CHECK_MSG_STATUS_TIMER = 0;
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );

    const astraButtonElement = screen.getByTestId("astra-chat-affix");
    fireEvent.click(astraButtonElement);
    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });

    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    AxiosMock.post.mockResolvedValueOnce({ data: { message: "test" } });
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
    await waitFor(() => {
      AxiosMock.get.mockResolvedValueOnce({
        data: { status: "completed", message: "test" },
      });
    });

    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  it("if the msg status checker was failed, the last msg should be failed", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );

    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    AxiosMock.post.mockResolvedValueOnce({ data: { message: "test" } });
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalled();
    });
    AxiosMock.get.mockResolvedValueOnce({
      data: { status: "failed", message: null },
    });
    astraConstants.CHECK_MSG_STATUS_TIMER = 0;

    await waitFor(() => {
      expect(screen.getByTestId("failed-message-body-0")).toBeInTheDocument();
    });
  });

  it("if the msg status checker failed, the failed msg should rendered", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );
    const astraButtonElement = screen.getByTestId("astra-chat-affix");
    fireEvent.click(astraButtonElement);
    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    AxiosMock.post.mockResolvedValueOnce({
      data: { message: "test", thread_id: "123" },
    });
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalled();
    });
    AxiosMock.get.mockRejectedValueOnce({});
    AxiosMock.get.mockRejectedValueOnce({});
    await waitFor(() => {
      expect(AxiosMock.get).toBeCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-messages")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("failed-message-body-0")).toBeInTheDocument();
    });
  });

  it("if their isn't a currentThreadID , then the chat is enabled ", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );

    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });
    AxiosMock.post.mockResolvedValueOnce({ data: { message: "test" } });

    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    expect(AxiosMock.post).toBeCalled();
  });

  it("if the send msg was failed , the status should change to failed ", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );

    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    AxiosMock.post.mockRejectedValueOnce({});
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("failed-message-body-0")).toBeInTheDocument();
    });
  });

  it("If the user doesn't have enought tokens, should render recharge tokens UI", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionIsLoading: false,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: { used: 50, balance: 1000 },
              },
            ],
          },
        }}
      >
        <CompaniesContext.Provider
          value={{ selectedCompany: { currency: "EGP" } }}
        >
          <AstraChatAffix />
        </CompaniesContext.Provider>
      </SubscriptionContext.Provider>
    );

    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    AxiosMock.post.mockRejectedValueOnce({
      response: { data: "Not enough tokens." },
    });
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    await waitFor(() => {
      expect(AxiosMock.post).toBeCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId("recharge_tokens")).toBeInTheDocument();
    });
  });

  it("when click on create new session , the thread id should be null", async () => {
    localStorage.setItem("current_astra_thread_id", "thread_123");
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        messages: [
          {
            message: "Hello",
            role: "user",
          },
        ],
      },
    });
    const fetchSubscriptionInfoFn = jest.fn();

    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: { used: 50, balance: 1000 },
              },
            ],
          },
        }}
      >
        <CompaniesContext.Provider
          value={{ selectedCompany: { currency: "EGP" } }}
        >
          <AstraChatAffix />
        </CompaniesContext.Provider>
      </SubscriptionContext.Provider>
    );
    const astraButtonElement = screen.getByTestId("astra-chat-affix");
    fireEvent.click(astraButtonElement);

    const currentThreadID = localStorage.getItem("current_astra_thread_id");
    await waitFor(() => {
      expect(AxiosMock.get).toHaveBeenCalledWith(
        `/astra/chat/messages?thread_id=${currentThreadID}`
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("create__new__session")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("create__new__session"));

    await waitFor(() => {
      expect(localStorage.getItem("current_astra_thread_id")).toBe("null");
    });
    await waitFor(() => {
      expect(fetchSubscriptionInfoFn).toBeCalled();
    });
  });
});

describe("AstraChatMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.removeItem("current_astra_thread_id");
  });
  const dummyConversation = [
    {
      id: 1,
      role: "assistant",
      status: "success",
      message: "Hello!",
    },
    {
      id: 2,
      role: "assistant",
      status: "loading",
      message: "Please wait...",
    },
    {
      id: 3,
      role: "user",
      status: "failed",
      message: "Sorry, I didn't understand that.",
    },
  ];

  it("should render the messages correctly", () => {
    render(
      <AstraChatMessages
        isAssistantLoading={false}
        conversation={dummyConversation}
      />
    );

    expect(screen.getByTestId("message-body-0")).toBeInTheDocument();

    const messageTexts = screen.getAllByTestId("message-text");
    expect(messageTexts).toHaveLength(dummyConversation.length);
  });

  it("should render the failed message correctly", () => {
    render(
      <AstraChatMessages
        isAssistantLoading={false}
        conversation={dummyConversation}
      />
    );

    expect(screen.getByTestId("failed-message-body-2")).toBeInTheDocument();
  });

  it("should render the loading spinner correctly", () => {
    render(
      <AstraChatMessages
        isAssistantLoading={true}
        conversation={dummyConversation}
      />
    );

    const loadingSpinners = screen.getAllByTestId("loading-spinner");
    expect(loadingSpinners).toHaveLength(1);
  });

  it("should scroll to the bottom when new messages are added", () => {
    render(
      <AstraChatMessages
        isAssistantLoading={false}
        dummyConversation={dummyConversation}
      />
    );

    const messagesRef = screen.getByTestId("astra-chat-messages");
    expect(messagesRef.scrollTop).toBe(messagesRef.scrollHeight);
  });

  it("should add a new message to the conversation if predfined message is clicked", async () => {
    const fetchSubscriptionInfoFn = jest.fn();
    render(
      <SubscriptionContext.Provider
        value={{
          subscriptionIsLoading: false,
          fetchSubscriptionInfo: fetchSubscriptionInfoFn,
          subscriptionInfo: {
            addons: [
              {
                astra_tokens: {
                  used: 50,
                  balance: 1000,
                },
              },
            ],
          },
        }}
      >
        <AstraChatAffix />
      </SubscriptionContext.Provider>
    );

    const astraButtonElement = screen.getByTestId("astra-chat-affix");

    fireEvent.click(astraButtonElement);

    await waitFor(() => {
      expect(screen.getByTestId("astra-chat-dropdown")).toBeInTheDocument();
    });

    const predfinedTargetMessage = screen.getByText(
      "What are the financial statements"
    );

    await waitFor(() => {
      expect(predfinedTargetMessage).toBeInTheDocument();
    });

    AxiosMock.post.mockResolvedValueOnce({
      data: { message: "What are the financial statements" },
    });

    fireEvent.click(predfinedTargetMessage);

    await waitFor(() => {
      expect(
        screen.getByText("What are the financial statements")
      ).toBeInTheDocument();
    });
  });

  it("should call sendMessage function with the question when clicked", async () => {
    const question = "What are the financial statements";
    const sendMessage = jest.fn();
    render(
      <AstraPredefinedQuestion question={question} sendMessage={sendMessage} />
    );

    const predefinedQuestionElement = screen.getByTestId("predefined-question");

    fireEvent.click(predefinedQuestionElement);

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith(question);
    });
  });
});
