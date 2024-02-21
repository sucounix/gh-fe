import React, { useContext, useEffect, useRef } from "react";
import { TutorialVideosContext } from "../../../contexts/TutorialVideos";
import { CompaniesContext } from "../../../contexts/CompaniesContext";
import { useDisclosure } from "@mantine/hooks";
import { Popover, Flex } from "@mantine/core";
import { useLocation } from "react-router-dom";

const TutorialPopup = ({ isSideMenuOpen }) => {
  const { selectedCompany } = useContext(CompaniesContext);
  const { videosList, setTargetVideoKey, setCurrentVideo, targetVideoKey } =
    useContext(TutorialVideosContext);

  const [opened, { close, open }] = useDisclosure(false);

  const wrapperRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.includes(`/company/${selectedCompany?.uuid}/analysis`)
    ) {
      videosList?.map((video) => {
        if (
          location.pathname.includes(
            `/company/${selectedCompany?.uuid}/analysis/${video.pathKey}`
          )
        ) {
          setTargetVideoKey(video.key);
        }
      });
    } else if (location.pathname.includes(`/organisation-settings`)) {
      setTargetVideoKey("settings");
    } else {
      setTargetVideoKey(null);
    }
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setCurrentVideo(null);
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (opened && targetVideoKey) {
      scrollToElement(
        videosList.findIndex((object) => {
          return object.key === targetVideoKey;
        })
      );
    }
  }, [opened]);

  const scrollToElement = (index) => {
    setTimeout(() => {
      document
        .getElementsByClassName(`scrollToVideo_${index}`)[0]
        .scrollIntoView({
          behavior: `smooth`,
          block: "center",
        });
    }, 1);
  };

  return (
    targetVideoKey && (
      <Popover
        opened={opened}
        position="top-end"
        shadow="md"
        className={
          isSideMenuOpen
            ? "popover_videos_list_open"
            : "popover_videos_list_close"
        }
      >
        <Popover.Target>
          <div
            className={
              isSideMenuOpen
                ? "video_list_target_open"
                : "video_list_target_close"
            }
            onClick={() => {
              opened ? close() : open();
            }}
            data-testid="video_list_target"
          >
            <div>
              <i class="fa-solid fa-play video__icon"></i>
            </div>
            <div>
              <span className="chip__content">Tutorials</span>
            </div>
          </div>
        </Popover.Target>
        <Popover.Dropdown
          className={
            isSideMenuOpen
              ? "video__list__dropdown_open"
              : "video__list__dropdown_close"
          }
        >
          <div
            className="video__list__dropdown__wrapper"
            data-testid="video__list__dropdown"
            ref={wrapperRef}
          >
            <div className="video__list__dropdown_title">
              <Flex align={"center"} justify={"space-between"}>
                <p className="title">Watch tutorial videos</p>
                <span
                  className="close__icon"
                  data-testid="video_list_close__icon"
                  onClick={() => {
                    setCurrentVideo(null);
                    close();
                  }}
                >
                  <i class="fa-solid fa-xmark"></i>
                </span>
              </Flex>
            </div>

            <div className="videos__list__wrapper__affix">
              {videosList.map((video, videoIndex) => {
                return (
                  <div
                    className={`scrollToVideo_${videoIndex}`}
                    id={`single_video_${videoIndex}`}
                  >
                    <div
                      className={
                        targetVideoKey === video.key
                          ? "single__video__selected"
                          : "single__video"
                      }
                      data-testid={`video_${videoIndex}`}
                      onClick={() => {
                        setCurrentVideo(video);
                        close();
                      }}
                    >
                      <div className="video__thumbnail">
                        <img src={video.videoThumbnail} className="thumbnail" />
                        <i class="fa-solid fa-play playIcon"></i>
                      </div>
                      <div className="video__content">
                        <p className="title">{video.title}</p>
                        <p className="content">
                          {video.desc.length > 80
                            ? `${video.desc.substr(0, 80)} ......`
                            : video.desc}
                        </p>
                      </div>
                    </div>
                    {videoIndex !== videosList.length - 1 && (
                      <Flex align="center" justify="center">
                        <div
                          className="seperator"
                          data-testid="seperator"
                        ></div>
                      </Flex>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Popover.Dropdown>
      </Popover>
    )
  );
};

export default TutorialPopup;
