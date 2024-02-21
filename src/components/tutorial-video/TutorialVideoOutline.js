import React, { useContext } from "react";
import { Button } from "@mantine/core";
import { TutorialVideosContext } from "../../contexts/TutorialVideos";
import "./style/TutorialVideo.scss";

const TutorialVideoOutline = ({ videoKey }) => {
  const { getVideo } = useContext(TutorialVideosContext);
  return (
    <Button
      variant="outline"
      size="lg"
      className="download__video__outline"
      data-testId="TutorialVideoOutline_btn"
      leftIcon={<i class="fa-solid fa-play"></i>}
      onClick={() => {
        getVideo(videoKey);
      }}
    >
      Watch tutorial videos
    </Button>
  );
};
export default TutorialVideoOutline;
