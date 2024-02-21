import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TutorialVideoOutline from "./TutorialVideoOutline";
import { TutorialVideosContext } from "../../contexts/TutorialVideos";

jest.mock("axios");

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "1",
  }),
}));

describe("Tutorial video outline button", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when click on the button the getVideo method will be called", async () => {
    const getVideo = jest.fn();

    render(
      <TutorialVideosContext.Provider
        value={{
          getVideo,
        }}
      >
        <TutorialVideoOutline videoKey="financials" />
      </TutorialVideosContext.Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("TutorialVideoOutline_btn")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("TutorialVideoOutline_btn"));
    await waitFor(() => {
      expect(getVideo).toBeCalled();
    });
  });
});
