import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AstraChatInput from "./AstraChatInput";
import AxiosMock from "axios";

jest.mock("axios");

describe("Astra Chat Input", () => {
  it("renders the AstraChatInput component", () => {
    render(
      <AstraChatInput
        handleSendMessage={jest.fn()}
        disableConversation={false}
      />
    );
    expect(screen.getByTestId("astra-chat-input-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
  });

  it("User can send new msg", () => {
    const handleSendMessage = jest.fn();
    render(
      <AstraChatInput
        handleSendMessage={handleSendMessage}
        disableConversation={false}
      />
    );
    expect(screen.getByTestId("astra-chat-input-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    AxiosMock.post.mockResolvedValueOnce({ data: {} });
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    expect(handleSendMessage).toBeCalled();
  });

  it("If the disableConversation=true ,the User can't send new msg", () => {
    const handleSendMessage = jest.fn();
    render(
      <AstraChatInput
        handleSendMessage={handleSendMessage}
        disableConversation={true}
      />
    );
    expect(screen.getByTestId("astra-chat-input-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    expect(screen.getByTestId("send_msg_btn")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("send_msg_btn"));
    expect(handleSendMessage).not.toBeCalled();
  });
  it("User can send new msg on click enter", () => {
    const handleSendMessage = jest.fn();
    render(
      <AstraChatInput
        handleSendMessage={handleSendMessage}
        disableConversation={false}
      />
    );
    expect(screen.getByTestId("astra-chat-input-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("astra-chat-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("astra-chat-input"), {
      target: { value: "test" },
    });
    AxiosMock.post.mockResolvedValueOnce({ data: {} });
    fireEvent.keyDown(screen.getByTestId("astra-chat-input"), {
      key: "Enter",
    });
    expect(handleSendMessage).toBeCalled();
  });
});
