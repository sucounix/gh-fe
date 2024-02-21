import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import BreakdownUpload from "./BreakdownUpload";

jest.mock("axios");

describe("Break down", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render form", async () => {
    window.open = jest.fn();
    render(
      <BrowserRouter>
        <BreakdownUpload />
      </BrowserRouter>
    );

    expect(screen.getByTestId("breakdown_wrapper")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("view-guidelines"));
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it("the upload button should work when submitting", async () => {
    render(
      <BrowserRouter>
        <BreakdownUpload />
      </BrowserRouter>
    );

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    AxiosMock.post.mockResolvedValueOnce({
      data: {},
    });

    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      ],
    });

    expect(AxiosMock.post).toHaveBeenCalledTimes(1);
  });

  it("should submit file and display success", async () => {
    render(
      <BrowserRouter>
        <BreakdownUpload />
      </BrowserRouter>
    );

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    AxiosMock.post.mockResolvedValueOnce({
      data: {
        name: "tes",
      },
    });

    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      ],
    });

    expect(AxiosMock.post).toHaveBeenCalledTimes(1);
  });

  it("should submit file and display error", async () => {
    AxiosMock.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Error",
        },
      },
    });

    render(
      <BrowserRouter>
        <BreakdownUpload />
      </BrowserRouter>
    );

    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    // eslint-disable-next-line testing-library/no-node-access
    const uploadButtonPicker = document.querySelector('input[type="file"]');

    fireEvent.change(uploadButtonPicker, {
      files: [
        new File([""], "test.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      ],
    });

    expect(AxiosMock.post).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByTestId("failure-message")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("show-error"));
    expect(screen.getByTestId("errors__modal")).toBeInTheDocument();
  });
});
