import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AxiosMock from "axios";
import EditSectionTitle from "./EditSectionTitle";
jest.mock("axios");

describe("View Report details", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const editHandlers = {
    close: jest.fn(),
    open: jest.fn(),
  };

  let sectionData = { uuid: "123", title: "title 2" };
  let reportDetails = {
    uuid: "1111",
    cover: {},
    sections: [sectionData],
  };

  it("when change the title , should send the request with the new title", async () => {
    AxiosMock.put.mockResolvedValueOnce({
      data: {
        title: "title 2 edit",
      },
    });

    render(
      <BrowserRouter>
        <EditSectionTitle
          editHandlers={editHandlers}
          section={sectionData}
          sectionIndex={0}
          reportDetails={reportDetails}
          setReportDetails={() => jest.fn()}
        />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByTestId("section_title"), {
      target: { value: "title 2 edit" },
    });
    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(AxiosMock.put).toBeCalledTimes(1);
    });
  });

  it("If the user want to save an empty title , error msg should appear", async () => {
    AxiosMock.put.mockResolvedValueOnce({
      data: {
        title: "title 2 edit",
      },
    });

    render(
      <BrowserRouter>
        <EditSectionTitle
          editHandlers={editHandlers}
          section={sectionData}
          sectionIndex={0}
          reportDetails={reportDetails}
          setReportDetails={() => jest.fn()}
        />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByTestId("section_title"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(screen.getByText(`This field can't be empty`)).toBeInTheDocument();
    });
  });
  it("If the user want to save a title with length more than 50 characters , error msg should appear", async () => {
    AxiosMock.put.mockResolvedValueOnce({
      data: {
        title: "title 2 edit",
      },
    });

    render(
      <BrowserRouter>
        <EditSectionTitle
          editHandlers={editHandlers}
          section={sectionData}
          sectionIndex={0}
          reportDetails={reportDetails}
          setReportDetails={() => jest.fn()}
        />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByTestId("section_title"), {
      target: {
        value:
          "Long Text Long Text Long Text Long TextLong TextLong Text Long Text Long Text Long Text",
      },
    });
    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(
        screen.getByText(`The maximum title length is 50 characters`)
      ).toBeInTheDocument();
    });
  });
});
