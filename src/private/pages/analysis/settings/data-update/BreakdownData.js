import React, { useContext } from "react";
import moment from "moment";
import { Button } from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import "./style/DataUpdate.scss";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";

const BreakdownData = ({ data }) => {
  const params = useParams();
  const { selectedCompany } = useContext(CompaniesContext);

  return (
    <div className="CardData">
      <div style={{ height: "100%" }}>
        <p className="title1">Breakdown</p>
        {Object.keys(data).length > 0 ? (
          <div>
            <div className="mb__10">
              <span className="span1">Source: </span>
              <span className="span2">
                <i class="fa-solid fa-file-excel fileIcon"></i>
                <span>Excel sheet</span>
              </span>
            </div>
            <div className="mb__10">
              <span className="span1">Last updated:</span>
              <span className="span3"> {moment(data.modified).fromNow()}</span>
              <span className="span4">
                ({moment(data.modified).format("DD MMMM YYYY HH:mm a")})
              </span>
            </div>
          </div>
        ) : (
          <p className="no__data">No breakdown sheet has been uploaded</p>
        )}
      </div>
      <div className="button__div__upload">
        <Button size="md" radius={"md"}>
          <Link
            to={`/company/${params.companyId}/analysis/segmentation-analysis`}
            state={{
              backToSettings: true,
            }}
            data-testid="breakdown_upload_link"
            className="link__reupload"
          >
            {Object.keys(data).length > 0
              ? "Reupload excel sheet"
              : "Upload excel sheet"}
            <i class="fa-solid fa-file-excel fileIcon"></i>
          </Link>
        </Button>
      </div>
    </div>
  );
};
export default BreakdownData;
