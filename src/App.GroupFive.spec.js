import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserContext } from "./contexts/UserContext";
import { TutorialVideosContext } from "./contexts/TutorialVideos";
import thumbnail from "./assets/images/Financial Statements Thumbnail.png";

jest.mock("axios");
const dummyUser = {
  uuid: "2e21a0b4-ad86-4947-81fc-bfbddcdf4bc8",
  email: "user@femto.com",
  register_type: "social",
  name: "User 1",
  phone_number: null,
  role: null,
};

describe("App", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("If there is a current video , then the tutorial video modal will appear", async () => {
    const setCurrentVideo = jest.fn();
    const currentVideo = {
      key: "upload_breakdown",
      videoLink:
        "https://www.youtube.com/watch?v=SDHJm5K5CVg&ab_channel=FemtoFP%26A",
      videoThumbnail: thumbnail,
      title: "upload_breakdown video",
      desc: "Upload your financial data after reading the guidelines which will help you in the upload process.",
    };
    render(
      <BrowserRouter>
        <TutorialVideosContext.Provider
          value={{ currentVideo, setCurrentVideo }}
        >
          <UserContext.Provider
            value={{
              user: dummyUser,
              logoutUser: jest.fn(),
            }}
          >
            <App />
          </UserContext.Provider>
        </TutorialVideosContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("tutorial_video_modal")).toBeInTheDocument();
    });
  });
  it("If there isn't a current video , then the tutorial video modal will disappear", async () => {
    const setCurrentVideo = jest.fn();

    render(
      <BrowserRouter>
        <TutorialVideosContext.Provider
          value={{ currentVideo: null, setCurrentVideo }}
        >
          <UserContext.Provider
            value={{
              user: dummyUser,
              logoutUser: jest.fn(),
            }}
          >
            <App />
          </UserContext.Provider>
        </TutorialVideosContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId("tutorial_video_modal")
      ).not.toBeInTheDocument();
    });
  });
});
