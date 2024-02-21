import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TutorialVideoModal from "./TutorialVideoModal";
import { TutorialVideosContext } from "../../../contexts/TutorialVideos";

describe("Tutorial video modal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should be rendered ", async () => {
    render(
      <BrowserRouter>
        <TutorialVideosContext.Provider
          value={{
            currentVideo: {
              title: "test title",
              desc: "test desc",
              videoLink: "test link",
            },
            clearCurrentVideo: jest.fn(),
          }}
        >
          <TutorialVideoModal />
        </TutorialVideosContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("tutorial_video_modal")).toBeInTheDocument();
    });
  });
  it("when click on close button , the clearCurrentVideo should be called ", async () => {
    const clearCurrentVideoFn = jest.fn();
    render(
      <BrowserRouter>
        <TutorialVideosContext.Provider
          value={{
            currentVideo: {
              title: "test title",
              desc: "test desc",
              videoLink: "test link",
            },
            clearCurrentVideo: clearCurrentVideoFn,
          }}
        >
          <TutorialVideoModal />
        </TutorialVideosContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("tutorial_video_modal")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("close__btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("close__btn"));
    await waitFor(() => {
      expect(clearCurrentVideoFn).toHaveBeenCalled();
    });
  });
});
