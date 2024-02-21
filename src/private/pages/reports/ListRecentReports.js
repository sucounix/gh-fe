import React, { useContext, useRef } from "react";
import file from "../../../assets/images/file.svg";
import { Carousel } from "@mantine/carousel";
import moment from "moment";
import { Popover } from "@mantine/core";
import dummyCompnayLogo from "../../../assets/images/dummyCompnayLogo.png";
import { SubscriptionContext } from "../../../contexts/SubscriptionContext";
function ListRecentReports({
  reports,
  setEmblaInstance,
  confirmDeleteSingleReportModal,
  handleReportClick,
}) {
  const carouselRef = useRef(null);
  const { canCreateReport } = useContext(SubscriptionContext);
  return (
    <>
      <div className="recent__grid__items">
        <Carousel
          slideSize="25%"
          slideGap="xs"
          align="start"
          slidesToScroll={4}
          getEmblaApi={setEmblaInstance}
          withControls={false}
          withIndicators={false}
          ref={carouselRef}
          style={{ width: "100%" }}
          containScroll="trimSnaps"
          inViewThreshold={1}
        >
          {reports &&
            reports.length > 0 &&
            reports
              .filter((report, index) => {
                return index < 8;
              })
              .map((report, index) => (
                <Carousel.Slide>
                  <div
                    className="recents__grid__item"
                    data-testid={`grid_item_${index}`}
                  >
                    {!canCreateReport() && (
                      <div
                        className="lock_overlay"
                        data-testid="lock_overlay"
                      ></div>
                    )}
                    <div className="grid__item__header">
                      <div
                        className="grid__item__title"
                        data-testid={`grid_report_title_${report.title}`}
                        onClick={() => {
                          handleReportClick(report);
                        }}
                      >
                        <img src={file} alt="" />
                        <span>{report.title}</span>
                      </div>
                      {canCreateReport() ? (
                        <Popover position="bottom" withArrow shadow="md">
                          <Popover.Target>
                            <i
                              data-testid={`options_${index}`}
                              className="fa-solid fa-ellipsis"
                            ></i>
                          </Popover.Target>
                          <Popover.Dropdown>
                            <div
                              className="recent__popover"
                              data-testid="options_popover"
                            >
                              <span
                                className="menu__item"
                                onClick={() => {
                                  handleReportClick(report);
                                }}
                              >
                                <i className="fa-regular fa-edit"></i>
                                Edit
                              </span>
                              <div>
                                <span
                                  className="menu__item"
                                  data-testid="delete_recent_report"
                                  onClick={() => {
                                    confirmDeleteSingleReportModal(report.uuid);
                                  }}
                                >
                                  <i className="fa-regular fa-trash-can"></i>
                                  Delete
                                </span>
                              </div>
                            </div>
                          </Popover.Dropdown>
                        </Popover>
                      ) : (
                        <i
                          className="fa-solid fa-lock lock_icon_header"
                          data-testid="recent_lock_icon"
                        ></i>
                      )}
                    </div>

                    <div
                      onClick={() => {
                        handleReportClick(report);
                      }}
                      className="grid__item__cover"
                      style={{
                        background: report?.cover?.background_color,
                      }}
                    >
                      {!report.cover.logo && (
                        <div className="logo_div">
                          <img src={dummyCompnayLogo} alt="logo" />
                        </div>
                      )}
                      {report.cover && report.cover?.show_logo && (
                        <>
                          <img src={report?.cover?.logo?.url} alt="" />
                        </>
                      )}
                    </div>
                    <div
                      className="grid__item__footer"
                      onClick={() => {
                        handleReportClick(report);
                      }}
                    >
                      <span
                        className="grid__item__date"
                        data-testid={`grid__item__date_${report.period}`}
                      >
                        {report.period}
                      </span>
                      <div>
                        <span className="grid__item__last__update">
                          {report.created && moment(report.created).fromNow()}
                        </span>
                        {report.is_valid ? null : (
                          <span
                            className="disabled__flag"
                            data-testid={`invalid_report_${report.uuid}`}
                          >
                            Invalid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Carousel.Slide>
              ))}
        </Carousel>
      </div>
    </>
  );
}

export default ListRecentReports;
