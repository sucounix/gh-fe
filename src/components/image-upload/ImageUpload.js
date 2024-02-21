import { Avatar, FileButton, Input } from "@mantine/core";
import companyDefaultAvatar from "../../assets/images/company_avatar.png";
import React from "react";

function ImageUpload({
  form,
  field,
  update,
  updateRequest,
  imageLink,
  setImageLink,
  firstRender,
  testIdPrefix = "image",
  ...props
}) {
  const uploadRef = React.useRef(null);

  return (
    <>
      <Avatar
        src={imageLink ? imageLink : companyDefaultAvatar}
        size={150}
        data-testid={`${testIdPrefix}-avatar`}
        imageProps={{
          style: {
            objectFit: "contain",
          },
        }}
        {...props}
      />
      <div className="avatar__controls">
        <>
          <FileButton
            ref={uploadRef}
            onChange={(e) => {
              update(e);
              uploadRef.current.value = "";
            }}
            accept="image/png,image/jpeg"
            multiple={false}
          >
            {(props) => (
              <div
                {...props}
                data-testid={`${testIdPrefix}-upload-image`}
                className="avatar__control reupload__control"
              >
                <i className="fas fa-upload"></i>
                <span>Upload new {field}</span>
              </div>
            )}
          </FileButton>
          {imageLink ? (
            <div
              className="avatar__control delete__control"
              onClick={() => {
                setImageLink(undefined);
                form.clearFieldError(field);
                form.setFieldValue(field, null);
                updateRequest(null);
              }}
              data-testid={`${testIdPrefix}-delete`}
            >
              <i className="fas fa-trash"></i>
              <span data-testid={`delete_${field}_span`}>Delete {field}</span>
            </div>
          ) : null}

          {form.errors && form.errors.hasOwnProperty(field) ? (
            <Input.Error
              style={{ margin: "0.25rem 0" }}
              data-testid={`error_msg_${field}`}
            >
              {form.errors[field]}
            </Input.Error>
          ) : null}
        </>
      </div>
    </>
  );
}
export default ImageUpload;
