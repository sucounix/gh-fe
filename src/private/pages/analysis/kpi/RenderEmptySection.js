import React, { useContext } from "react";
import { Flex } from "@mantine/core";
import emptysegmentationcontent from "../../../../assets/images/emptysegmentationcontent.png";
import { CompanyPreferencesApiContext } from "../../../../contexts/CompanyPreferencesApi";

const RenderEmptySection = () => {
  const { companyPreferencesApi } = useContext(CompanyPreferencesApiContext);

  return (
    companyPreferencesApi && (
      <Flex
        align={"center"}
        justify="space-evenly"
        w={"60vw"}
        style={{ margin: "50px auto" }}
      >
        <div>
          <img src={emptysegmentationcontent} alt="empty content" />
        </div>
        <div>
          <p className="title1">
            {companyPreferencesApi.KPIFilter === "on_track"
              ? "No on track KPIs available"
              : companyPreferencesApi.KPIFilter === "off_track"
              ? "No off track KPIs available"
              : companyPreferencesApi.KPIFilter === "alert"
              ? "No alerts KPIs available"
              : "No KPIs available"}
          </p>
          <p className="title2">
            {companyPreferencesApi.KPIFilter === "on_track"
              ? "If there are any KPIs on track they will be listed here"
              : companyPreferencesApi.KPIFilter === "off_track"
              ? "If there are any KPIs off track they will be listed here"
              : companyPreferencesApi.KPIFilter === "alert"
              ? "If there are any KPIs alerts they will be listed here"
              : "If there are any KPIs they will be listed here"}
          </p>
        </div>
      </Flex>
    )
  );
};

export default RenderEmptySection;
