import React, { useEffect, useState } from "react";
import { Drawer, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditCover from "../edit-cover/EditCover";
import moment from "moment";
import ViewReportText from "../../text/view-text/ViewReportText";
import reportsEditLoader from "../../../../../../../assets/images/reports-edit-loader.gif";
import dummyCompnayLogo from "../../../../../../../assets/images/dummyCompnayLogo.png";
import "./style/ViewCover.scss";

const ViewCover = ({ data, setReportDetails }) => {
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);
  const [coverData, setCoverDate] = useState(data);
  const [openedDrawer, drawerHandlers] = useDisclosure(false);

  useEffect(() => {
    setCoverDate(data);
  }, [data]);

  return (
    <div className="view_cover" data-testid="report_cover_section">
      <div
        className="cover_section"
        style={{
          background: coverData.background_color,
        }}
      >
        {!coverData.logo && (
          <div className="logo_div">
            <img src={dummyCompnayLogo} alt="logo" />
          </div>
        )}
        {coverData.logo?.url && coverData?.show_logo && (
          <div className="logo_div">
            <img src={coverData.logo?.url} alt="logo" />
          </div>
        )}
        <p
          className="report_name"
          style={{
            color: coverData.fore_color,
          }}
        >
          {coverData.report_title}
        </p>
        <p
          className="period_info"
          style={{
            color: coverData.fore_color,
          }}
        >
          <span>{coverData.company_name}</span>
          <span className="seperator">-</span>
          <span>{coverData.period}</span>
        </p>
        <span className="edit_chip" onClick={drawerHandlers.open}>
          <i className="fa-solid fa-pen-to-square icon"></i>
          Edit
        </span>
      </div>
      {coverData.section_body && (
        <div className="text_container">
          <ViewReportText
            textContent={coverData.section_body}
            sectionIndex={-1}
            isCoverSection={true}
            setReportDetails={setReportDetails}
            item={coverData}
          />
        </div>
      )}
      <div className="footer_section">
        <p>
          published on&nbsp;
          {moment(coverData.published_on).format("DD/MM/YYYY")}
        </p>
        <p>published by: {coverData.published_by}</p>
      </div>

      <Drawer.Root
        position="right"
        className="report__edit_form"
        opened={openedDrawer}
        onClose={drawerHandlers.close}
      >
        <Drawer.Overlay>
          {showOverlayLoader && (
            <Flex w="80%" h="100%" align={"center"} justify={"center"}>
              <img
                src={reportsEditLoader}
                alt="edit-loader"
                className="edit_form_loader"
              />
            </Flex>
          )}
        </Drawer.Overlay>
        <Drawer.Content>
          <Drawer.Body>
            <EditCover
              data={coverData}
              drawerHandlers={drawerHandlers}
              showOverlayLoader={showOverlayLoader}
              setShowOverlayLoader={setShowOverlayLoader}
              setReportDetails={setReportDetails}
            />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  );
};
export default ViewCover;
