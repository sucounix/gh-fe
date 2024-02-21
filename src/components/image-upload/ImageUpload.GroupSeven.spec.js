import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ImageUpload from "./ImageUpload";
import companyDefaultAvatar from "../../assets/images/company_avatar.png";

describe("Image upload", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the avatar should be rendered", async () => {
    render(
      <BrowserRouter>
        <ImageUpload
          form={{
            clearFieldError: jest.fn(),
            setFieldValue: jest.fn(),
            errors: null,
          }}
          field="image_field"
          update={jest.fn()}
          updateRequest={jest.fn()}
          imageLink={null}
          setImageLink={jest.fn()}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("image-avatar")).toBeInTheDocument();
    });
  });

  it("can upload png image", async () => {
    render(
      <BrowserRouter>
        <ImageUpload
          form={{
            clearFieldError: jest.fn(),
            setFieldValue: jest.fn(),
            errors: null,
          }}
          field="image_field"
          update={jest.fn()}
          updateRequest={jest.fn()}
          imageLink={null}
          setImageLink={jest.fn()}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("image-avatar")).toBeInTheDocument();
    });
    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.png", {
          type: "application/png",
        }),
      ],
    });
  });

  it("Can delete the uploaded image", async () => {
    const clearFn = jest.fn(),
      setValueFn = jest.fn(),
      setImageLinkFn = jest.fn(),
      updateFn = jest.fn(),
      updateRequestFn = jest.fn();
    render(
      <BrowserRouter>
        <ImageUpload
          form={{
            clearFieldError: clearFn,
            setFieldValue: setValueFn,
            errors: null,
          }}
          field="image_field"
          update={updateFn}
          updateRequest={updateRequestFn}
          imageLink={"http://test-image"}
          setImageLink={setImageLinkFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("image-avatar")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("image-delete")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("delete_image_field_span")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("image-delete"));
    await waitFor(() => {
      expect(setImageLinkFn).toBeCalled();
    });
    await waitFor(() => {
      expect(clearFn).toBeCalled();
    });
    await waitFor(() => {
      expect(setValueFn).toBeCalled();
    });
    await waitFor(() => {
      expect(updateRequestFn).toBeCalled();
    });
  });

  it("if the imageLink = null , can't find delete button", async () => {
    const clearFn = jest.fn(),
      setValueFn = jest.fn(),
      setImageLinkFn = jest.fn(),
      updateFn = jest.fn(),
      updateRequestFn = jest.fn();
    render(
      <BrowserRouter>
        <ImageUpload
          form={{
            clearFieldError: clearFn,
            setFieldValue: setValueFn,
            errors: null,
          }}
          field="image_field"
          update={updateFn}
          updateRequest={updateRequestFn}
          imageLink={null}
          setImageLink={setImageLinkFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("image-avatar")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId("image-delete")).not.toBeInTheDocument();
    });
  });

  it("if their is an error , it should rendered", async () => {
    const clearFn = jest.fn(),
      setValueFn = jest.fn(),
      setImageLinkFn = jest.fn(),
      updateFn = jest.fn(),
      updateRequestFn = jest.fn();
    render(
      <BrowserRouter>
        <ImageUpload
          form={{
            clearFieldError: clearFn,
            setFieldValue: setValueFn,
            errors: { image_field: "error" },
          }}
          field="image_field"
          update={updateFn}
          updateRequest={updateRequestFn}
          imageLink={null}
          setImageLink={setImageLinkFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("image-avatar")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("error_msg_image_field")).toBeInTheDocument();
    });
  });

  it("if their isn't an error , it shouldn't rendered", async () => {
    const clearFn = jest.fn(),
      setValueFn = jest.fn(),
      setImageLinkFn = jest.fn(),
      updateFn = jest.fn(),
      updateRequestFn = jest.fn();
    render(
      <BrowserRouter>
        <ImageUpload
          form={{
            clearFieldError: clearFn,
            setFieldValue: setValueFn,
            errors: null,
          }}
          field="image_field"
          update={updateFn}
          updateRequest={updateRequestFn}
          imageLink={null}
          setImageLink={setImageLinkFn}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("image-avatar")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId("error_msg_image_field")
      ).not.toBeInTheDocument();
    });
  });
});
