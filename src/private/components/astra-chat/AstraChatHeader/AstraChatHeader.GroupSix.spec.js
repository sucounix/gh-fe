import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AstraChatHeader from "./AstraChatHeader";

describe("Astra chat header", () => {
  it("should open conversation history", async () => {
    const setIsHistoryOpenMock = jest.fn();
    render(
      <AstraChatHeader
        isHistoryOpen={false}
        setIsHistoryOpen={setIsHistoryOpenMock}
      />
    );
    fireEvent.click(screen.getByTestId("historyButton"));
    expect(setIsHistoryOpenMock).toBeCalledWith(true);
  });

  it("should open conversation ", async () => {
    const setIsHistoryOpenMock = jest.fn();
    render(
      <AstraChatHeader
        isHistoryOpen={true}
        setIsHistoryOpen={setIsHistoryOpenMock}
      />
    );
    fireEvent.click(screen.getByTestId("chatWithAstraButton"));
    expect(setIsHistoryOpenMock).toBeCalledWith(false);
  });
});
