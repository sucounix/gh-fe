import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AxiosMock from "axios";
import {
  data,
  validReportData,
} from "./../../../dummy-data/ViewReportDummyData";
import ViewReportText from "./ViewReportText";
import { BrowserRouter } from "react-router-dom";
import { SubscriptionContext } from "../../../../../../../contexts/SubscriptionContext";

jest.mock("axios");

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

describe("View Report Text", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when render the view report text the text passed should be displayed", async () => {
    const setReportDetailsFn = jest.fn();

    const dummyData = {
      ...data,
      cover: {
        ...data.cover,
        section_body: "Test Paragraph",
      },
    };
    window.ClipboardEvent = jest.fn();
    window.DragEvent = jest.fn();
    render(
      <ViewReportText
        textContent={dummyData.cover.section_body}
        section={"cover"}
        setReportDetails={setReportDetailsFn}
        item={dummyData}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Test Paragraph")).toBeInTheDocument();
    });
  });

  it("when render the view report text the edit text should be rendered", async () => {
    const setReportDetailsFn = jest.fn();

    const dummyData = {
      ...data,
      cover: {
        ...data.cover,
        section_body: "Test Paragraph",
      },
    };
    window.ClipboardEvent = jest.fn();
    window.DragEvent = jest.fn();
    render(
      <ViewReportText
        textContent={dummyData.cover.section_body}
        section={"cover"}
        setReportDetails={setReportDetailsFn}
        item={dummyData}
      />
    );

    fireEvent.click(screen.getByTestId("edit_text"));

    await waitFor(() => {
      expect(screen.getByTestId("text-editor")).toBeInTheDocument();
    });
  });

  it("when submitting empty string should raise error", async () => {
    AxiosMock.put.mockResolvedValueOnce({});

    const setReportDetailsFn = jest.fn();

    const dummyData = {
      ...data,
      cover: {
        ...data.cover,
        section_body: "",
      },
    };
    window.ClipboardEvent = jest.fn();
    window.DragEvent = jest.fn();
    render(
      <ViewReportText
        textContent={dummyData.cover.section_body}
        section={"cover"}
        setReportDetails={setReportDetailsFn}
        item={dummyData}
      />
    );

    fireEvent.click(screen.getByTestId("edit_text"));

    const spy = jest.spyOn(
      require("@mantine/notifications"),
      "showNotification"
    );

    await waitFor(() => {
      expect(screen.getByTestId("text-editor")).toBeInTheDocument();
    });

    // eslint-disable-next-line testing-library/no-node-access
    const editor = document.querySelector("[contenteditable]");
    fireEvent.input(editor, { target: { innerHTML: "" } });

    fireEvent.click(screen.getByTestId("save_button"));

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it("should open editor when click on astra logo and select detailed view", async () => {
    const setReportDetailsFn = jest.fn();
    const subscriptionInfoData = {
      planCode: "astra-monthly",
      addons: [
        {
          uid: 1,
          Code: "astra-token",
          Name: "Token",
          Quantity: 3,
          Status: "Active",
          astra_tokens: {
            uid: 1,
            balance: 330000,
            used: 12000,
          },
        },
      ],
    };

    const dummyData = {
      ...data,
      cover: {
        ...data.cover,
        section_body: "Test Paragraph",
      },
    };
    window.ClipboardEvent = jest.fn();
    window.DragEvent = jest.fn();
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        estimated_completion_time: 1000,
        approval_uuid: "123",
        data: "test",
      },
    });

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoData,
            isAllowedToUseAstra: jest.fn(() => {
              return true;
            }),
          }}
        >
          <ViewReportText
            textContent={dummyData.cover.section_body}
            section={"cover"}
            setReportDetails={setReportDetailsFn}
            item={dummyData}
            isCoverSection={false}
          />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("astra__button")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("astra__button"));

    await waitFor(() => {
      expect(screen.getByTestId("astra__popover__card")).toBeInTheDocument();
    });
    fireEvent.mouseLeave(screen.getByTestId("astra__button"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("astra__hover__card")
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("detailed__option")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("detailed__option"));

    await waitFor(() => {
      expect(screen.getByTestId("text-editor")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("astra__popover__card")).not.toBeVisible();
    });
  });

  it("should open editor when click on astra logo and select summary view", async () => {
    const setReportDetailsFn = jest.fn();
    const subscriptionInfoData = {
      planCode: "astra-monthly",
      addons: [
        {
          uid: 1,
          Code: "astra-token",
          Name: "Token",
          Quantity: 3,
          Status: "Active",
          astra_tokens: {
            uid: 1,
            balance: 330000,
            used: 12000,
          },
        },
      ],
    };

    const dummyData = {
      ...data,
      cover: {
        ...data.cover,
        section_body: "Test Paragraph",
      },
    };
    window.ClipboardEvent = jest.fn();
    window.DragEvent = jest.fn();
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        estimated_completion_time: 1000,
        approval_uuid: "123",
        data: "test",
      },
    });

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoData,
            isAllowedToUseAstra: jest.fn(() => {
              return true;
            }),
          }}
        >
          <ViewReportText
            textContent={dummyData.cover.section_body}
            section={"cover"}
            setReportDetails={setReportDetailsFn}
            item={dummyData}
            isCoverSection={false}
          />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("astra__button")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("astra__button"));

    await waitFor(() => {
      expect(screen.getByTestId("astra__popover__card")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("summarised__option")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("summarised__option"));

    await waitFor(() => {
      expect(screen.getByTestId("text-editor")).toBeInTheDocument();
    });
  });

  it("Astra button should be disabled", async () => {
    const setReportDetailsFn = jest.fn();
    const subscriptionInfoData = {
      planCode: "astra-monthly",
      addons: [
        {
          uid: 1,
          Code: "astra-token",
          Name: "Token",
          Quantity: 3,
          Status: "Active",
          astra_tokens: {
            uid: 1,
            balance: 330000,
            used: 12000,
          },
        },
      ],
    };

    const dummyData = {
      ...validReportData,
      cover: {
        ...data.cover,
        section_body: "Test Paragraph",
      },
    };

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoData,
            isAllowedToUseAstra: jest.fn(() => {
              return true;
            }),
          }}
        >
          <ViewReportText
            textContent={dummyData.cover.section_body}
            section={"cover"}
            setReportDetails={setReportDetailsFn}
            item={validReportData.sections[0].items[0]}
            isCoverSection={false}
            reportDetails={validReportData}
          />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("astra__button")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("astra__button")).toBeDisabled();
    });
  });
});
