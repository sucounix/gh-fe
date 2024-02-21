import React from "react";
import "./style/CreateReport.scss";

const ViewTemplateImage = ({ currentTemplate, setCurrentTemplate }) => {
  return (
    <div className="view_template_image" data-testid="view_template_image_div">
      <div className="modal__header">
        <i
          class="fa-regular fa-chevron-left back_arrow"
          onClick={() => setCurrentTemplate(null)}
        ></i>
        <p className="template_name">{currentTemplate.name}</p>
      </div>
      <div className="img_container">
        <img src={currentTemplate?.image} alt="imageLink" />
      </div>
    </div>
  );
};

export default ViewTemplateImage;
