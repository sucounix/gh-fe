import React, { useContext } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  TutorialVideosProvider,
  TutorialVideosContext,
} from "./TutorialVideos";

const TestingComponent = () => {
  const {
    currentVideo,
    setCurrentVideo,
    videosList,
    targetVideoKey,
    setTargetVideoKey,
    getVideo,
    clearCurrentVideo,
  } = useContext(TutorialVideosContext);

  return (
    <div data-testid="children_component">
      <p data-testid="current_video_title">{currentVideo?.title}</p>
      <p data-testid="current_video_desc">{currentVideo?.desc}</p>
      <p data-testid="current_video_link">{currentVideo?.videoLink}</p>
      {targetVideoKey && <p data-testid="targetVideoKey">{targetVideoKey}</p>}
      {videosList?.map((video) => {
        return <p data-testid={`vide_key_${video.key}`}>{video.key}</p>;
      })}
      <button data-testid="clear_current_video" onClick={clearCurrentVideo}>
        clear current video
      </button>
      <button
        onClick={() => {
          setTargetVideoKey("upload_excel");
        }}
        data-testid="set_Target_Video_Key_btn"
      >
        set target video
      </button>
      <button
        onClick={() => {
          setCurrentVideo({
            key: "upload_excel",
            videoLink:
              "https://www.youtube.com/watch?v=SDHJm5K5CVg&ab_channel=FemtoFP%26A",
            videoThumbnail: "",
            title: "Learn More About Our Uploading Guidelines!",
            desc: `Femto acknowledges finance professionals' love for excel. Adjust your spreadsheets with our easy-to-use classification codes and unlock Femto's seamless and comprehensive financial analysis tool kit.`,
          });
        }}
        data-testid="set_current_video"
      >
        set current video
      </button>
      <button
        data-testid="get_Video_btn"
        onClick={() => {
          getVideo("upload_breakdown");
        }}
      >
        get video
      </button>
    </div>
  );
};

describe("Tutorial video Context", () => {
  it("If there is a current video , then the video title should render", async () => {
    render(
      <TutorialVideosProvider>
        <TestingComponent />
      </TutorialVideosProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("set_current_video")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("set_current_video"));
    await waitFor(() => {
      expect(screen.getByTestId("current_video_title")).toBeInTheDocument();
    });
  });

  it("If there is a target video , then the target video should render", async () => {
    render(
      <TutorialVideosProvider>
        <TestingComponent />
      </TutorialVideosProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("set_Target_Video_Key_btn")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("set_Target_Video_Key_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("targetVideoKey")).toBeInTheDocument();
    });
  });

  it("when click on clear current video button, the current video should be cleared", async () => {
    render(
      <TutorialVideosProvider>
        <TestingComponent />
      </TutorialVideosProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("set_current_video")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("set_current_video"));
    await waitFor(() => {
      expect(screen.getByTestId("current_video_title").textContent).toBe(
        "Learn More About Our Uploading Guidelines!"
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("clear_current_video")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("clear_current_video"));
    await waitFor(() => {
      expect(screen.getByTestId("current_video_title").textContent).toBe("");
    });
  });

  it("the video list should be rendered", async () => {
    render(
      <TutorialVideosProvider>
        <TestingComponent />
      </TutorialVideosProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("vide_key_upload_excel")).toBeInTheDocument();
    });
  });

  it("when click on get video button, the video should be rendered", async () => {
    render(
      <TutorialVideosProvider>
        <TestingComponent />
      </TutorialVideosProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("get_Video_btn")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("get_Video_btn"));
    await waitFor(() => {
      expect(
        screen.getByTestId("vide_key_upload_breakdown")
      ).toBeInTheDocument();
    });
  });
});
