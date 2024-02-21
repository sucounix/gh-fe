import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import DeleteReportItemModal from "./DeleteReportItemModal";

jest.mock("axios");

describe("DeleteReportItemModal", () => {
  const deleteHandlers = {
    close: jest.fn(),
  };
  const sectionIndex = 1;
  const item = {
    uuid: "123",
  };
  const setReportDetails = jest.fn();
  const reportDetails = {
    uuid: "123",
    cover: {
      section_body: "Cover section body",
    },
    sections: [
      {
        title: "Section 1",
        items: [
          {
            uuid: "123",
            title: "Item 1",
            body: "Item 1 body",
          },
          {
            uuid: "456",
            title: "Item 2",
            body: "Item 2 body",
          },
        ],
      },
      {
        title: "Section 2",
        items: [
          {
            uuid: "789",
            title: "Item 3",
            body: "Item 3 body",
          },
        ],
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal with the correct title and message", () => {
    render(
      <DeleteReportItemModal
        deleteHandlers={deleteHandlers}
        deletedItemInfo={{
          sectionIndex: sectionIndex,
          item: item,
          isCoverSection: false,
          type: "table",
        }}
        setReportDetails={setReportDetails}
      />
    );

    expect(screen.getByTestId("delete_title")).toBeInTheDocument();
    expect(
      screen.getByText("Would you still like to proceed?")
    ).toBeInTheDocument();
  });

  it("calls the correct API endpoint when deleting a cover section", async () => {
    axios.put.mockResolvedValueOnce({});

    render(
      <DeleteReportItemModal
        deleteHandlers={deleteHandlers}
        deletedItemInfo={{
          sectionIndex: sectionIndex,
          item: item,
          isCoverSection: true,
          type: "table",
        }}
        setReportDetails={setReportDetails}
      />
    );

    fireEvent.click(screen.getByTestId("delete-btn"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `/report/cover/${reportDetails.uuid}`,
        {
          section_body: "",
        }
      );
    });
    await waitFor(() => {
      expect(setReportDetails).toBeCalled();
    });
    await waitFor(() => {
      expect(deleteHandlers.close).toHaveBeenCalled();
    });
  });

  it("failed the deleting a cover section endpoint", async () => {
    axios.put.mockRejectedValueOnce({});

    render(
      <DeleteReportItemModal
        deleteHandlers={deleteHandlers}
        deletedItemInfo={{
          sectionIndex: sectionIndex,
          item: item,
          isCoverSection: true,
          type: "table",
        }}
        setReportDetails={setReportDetails}
      />
    );

    fireEvent.click(screen.getByTestId("delete-btn"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `/report/cover/${reportDetails.uuid}`,
        {
          section_body: "",
        }
      );
    });

    await waitFor(() => {
      expect(deleteHandlers.close).toHaveBeenCalled();
    });
  });

  it("calls the correct API endpoint when deleting an item from a section", async () => {
    axios.delete.mockResolvedValueOnce({});

    render(
      <DeleteReportItemModal
        deleteHandlers={deleteHandlers}
        deletedItemInfo={{
          sectionIndex: sectionIndex,
          item: item,
          isCoverSection: false,
          type: "table",
        }}
        setReportDetails={setReportDetails}
      />
    );

    fireEvent.click(screen.getByTestId("delete-btn"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("report/item/123/");
    });
    await waitFor(() => {
      expect(setReportDetails).toBeCalled();
    });
  });

  it("failed the deleting an item from a section endpoint", async () => {
    axios.delete.mockRejectedValueOnce({});

    render(
      <DeleteReportItemModal
        deleteHandlers={deleteHandlers}
        deletedItemInfo={{
          sectionIndex: sectionIndex,
          item: item,
          isCoverSection: false,
          type: "table",
        }}
        setReportDetails={setReportDetails}
      />
    );

    fireEvent.click(screen.getByTestId("delete-btn"));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith("report/item/123/");
    });
  });

  it("closes the modal when the Cancel button is clicked", () => {
    render(
      <DeleteReportItemModal
        deleteHandlers={deleteHandlers}
        deletedItemInfo={{
          sectionIndex: sectionIndex,
          item: item,
          isCoverSection: false,
          type: "table",
        }}
        setReportDetails={setReportDetails}
      />
    );

    fireEvent.click(screen.getByTestId("cancel-btn"));

    expect(deleteHandlers.close).toHaveBeenCalled();
  });
});
