import React from "react";
import { Link } from "react-router-dom";
import { SegmentedControl } from "@mantine/core";

import "./style/EditCover.scss";

// we have 2 Cases:
// 1) compnay hasn't logo --> will render Upload view
// 2) company has logo
//  will check if the props {logo} in params object
//   {logo:null}--> the toggle will be Hide
//   {logo:"https://..."}--> the toggle will be Show

const EditLogo = ({ form, logo }) => {
  const segmentedOptions = ["Show", "Hide"];

  return (
    <div className="edit__logo">
      <p className="section__title">Logo</p>
      {/*CASE 1 :  company hasn't a logo  */}
      {!logo && (
        <div className="company_not_has_logo">
          <p className="text">
            You can upload you company logo from the company profile in the
            setting page
          </p>
          <Link
            to={"/organisation-settings/company-profile/edit"}
            className="link"
            data-testid="go_to_company_profile"
          >
            Go to company Profile page
            <span className="icon">
              <i class="fa-solid fa-arrow-right"></i>
            </span>
          </Link>
        </div>
      )}

      {/*CASE 2 :  company has a logo  */}
      {logo && (
        <div className="company_has_logo">
          <span className="title">Company logo</span>
          <SegmentedControl
            data-testid="show_hide_logo_toggle"
            name="logo"
            onChange={(e) => {
              form.setValues({
                show_logo: e === "Show",
              });
            }}
            data={segmentedOptions}
            defaultValue={
              form.getInputProps("show_logo").value ? "Show" : "Hide"
            }
            value={form.getInputProps("show_logo").value ? "Show" : "Hide"}
          />
        </div>
      )}
    </div>
  );
};

export default EditLogo;
