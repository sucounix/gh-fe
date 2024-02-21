import { Button, Modal, Flex } from "@mantine/core";
import React, { useContext } from "react";
import { TutorialVideosContext } from "../../../contexts/TutorialVideos";
import ReactPlayer from "react-player";
import "./style/TutorialVideoModal.scss";

const TutorialVideoModal = () => {
  const { currentVideo, clearCurrentVideo } = useContext(TutorialVideosContext);

  return (
    <Modal
      opened={true}
      size="xl "
      radius={20}
      withCloseButton={false}
      centered
      className="tutorial_video_modal"
      closeOnClickOutside
      onClose={clearCurrentVideo}
    >
      <div data-testid="tutorial_video_modal">
        <h2 className="title">{currentVideo.title}</h2>
        <p className="desc">{currentVideo.desc}</p>
        <Flex align="center" justify="center">
          <ReactPlayer
            controls
            playing={true}
            volume={1}
            muted={false}
            className="video"
            url={currentVideo.videoLink}
          />
        </Flex>
      </div>
      <Flex align={"center"} justify={"flex-end"}>
        <Button
          size="lg"
          className="close__btn"
          data-testid="close__btn"
          onClick={clearCurrentVideo}
        >
          Close
        </Button>
      </Flex>
    </Modal>
  );
};

export default TutorialVideoModal;
