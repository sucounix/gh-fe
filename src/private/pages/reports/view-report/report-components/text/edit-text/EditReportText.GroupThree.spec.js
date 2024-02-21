import React from "react";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMock from "axios";
import EditReportText from "./EditReportText";
import {
  data,
  inValidReportData,
} from "./../../../dummy-data/ViewReportDummyData";
import { SubscriptionContext } from "../../../../../../../contexts/SubscriptionContext";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

jest.mock("axios");

describe("View Report Text", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call API when click on Astra button for detailed option", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {},
    });

    const setOpenEditorMock = jest.fn();
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

    AxiosMock.get.mockResolvedValueOnce({
      data: {
        approval_uuid: "123",
        estimated_completion_time: "50",
      },
    });

    window.ClipboardEvent = jest.fn();
    window.DragEvent = jest.fn();
    let generateMode = "detailed";

    const setGenerateMode = jest.fn().mockImplementation(() => {
      generateMode = "detailed";
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
          <EditReportText
            textContent={dummyData.cover.section_body}
            item={data.sections[0].items[0]}
            isCoverSection={false}
            generateOnRender={false}
            setOpenEditor={setOpenEditorMock}
            reportDetails={data}
            generateMode={generateMode}
            setGenerateMode={setGenerateMode}
            nextItem={data.sections[0].items[1]}
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
      expect(AxiosMock.get).toHaveBeenCalledWith(
        `astra/ai/${data.sections[0].items[1].uuid}?request_type=detailed`
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("astra__popover__card")).not.toBeVisible();
    });
  });

  it("should call API when click on Astra button for summerised option", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {},
    });
    const setOpenEditorMock = jest.fn();
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

    AxiosMock.get.mockResolvedValueOnce({
      data: {
        approval_uuid: "123",
        estimated_completion_time: "50",
      },
    });

    window.ClipboardEvent = jest.fn();
    window.DragEvent = jest.fn();
    let generateMode = "summarised";

    const setGenerateMode = jest.fn().mockImplementation(() => {
      generateMode = "summarised";
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
          <EditReportText
            textContent={dummyData.cover.section_body}
            item={data.sections[0].items[0]}
            isCoverSection={false}
            generateOnRender={false}
            setOpenEditor={setOpenEditorMock}
            reportDetails={data}
            generateMode={generateMode}
            setGenerateMode={setGenerateMode}
            nextItem={data.sections[0].items[1]}
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
      expect(AxiosMock.get).toHaveBeenCalledWith(
        `astra/ai/${data.sections[0].items[1].uuid}?request_type=summarised`
      );
    });
  });

  it("should open subscription settings page when click on Astra button", async () => {
    const subscriptionInfoData = {
      planCode: "starter",
    };

    const dummyData = {
      ...data,
      cover: {
        ...data.cover,
        section_body: "Test Paragraph",
      },
    };

    AxiosMock.get.mockResolvedValueOnce({
      data: [],
    });
    window.ClipboardEvent = jest.fn();
    window.DragEvent = jest.fn();

    const generateMode = "summarised";
    const setGenerateMode = jest.fn();

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoData,
            isAllowedToUseAstra: jest.fn(),
          }}
        >
          <EditReportText
            textContent={dummyData.cover.section_body}
            item={dummyData}
            isCoverSection={false}
            generateOnRender={false}
            reportDetails={null}
            setOpenEditor={jest.fn()}
            setReportDetails={jest.fn()}
            sectionIndex={0}
            generateMode={generateMode}
            setGenerateMode={setGenerateMode}
            nextItem={data.sections[0].items[1]}
          />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("astra__button"));
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `/organisation-settings/subscription-settings`
      );
    });
  });

  it("should go to subscription settings to recharge", async () => {
    const setOpenEditorMock = jest.fn();
    const subscriptionInfoData = {
      planCode: "astra-monthly",
      addons: [
        {
          uid: 1,
          Code: "astra-token",
          Name: "Token",
          Quantity: 3,
          Status: "Active",
          astra_tokens: null,
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

    AxiosMock.get.mockResolvedValueOnce({
      data: {
        approval_uuid: "123",
        estimated_completion_time: "50",
      },
    });

    const generateMode = "summarised";
    const setGenerateMode = jest.fn();

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoData,
            isAllowedToUseAstra: jest.fn(),
          }}
        >
          <EditReportText
            textContent={dummyData.cover.section_body}
            item={data.sections[0].items[0]}
            isCoverSection={false}
            generateOnRender={false}
            setOpenEditor={setOpenEditorMock}
            reportDetails={data}
            generateMode={generateMode}
            setGenerateMode={setGenerateMode}
            nextItem={data.sections[0].items[1]}
          />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    userEvent.hover(screen.getByTestId("astra__button"));
    await waitFor(() => {
      expect(screen.getByTestId("astra__popover")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("upgrade__button"));
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `/organisation-settings/subscription-settings`
      );
    });
  });

  it("should go to subscription settings page when not astra plan", async () => {
    const setOpenEditorMock = jest.fn();
    const subscriptionInfoData = {
      planCode: "free",
      addons: [],
    };

    const dummyData = {
      ...data,
      cover: {
        ...data.cover,
        section_body: "Test Paragraph",
      },
    };

    AxiosMock.get.mockResolvedValueOnce({
      data: {
        approval_uuid: "123",
        estimated_completion_time: "50",
      },
    });

    const generateMode = "summarised";
    const setGenerateMode = jest.fn();

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoData,
            isAllowedToUseAstra: jest.fn(),
          }}
        >
          <EditReportText
            textContent={dummyData.cover.section_body}
            item={data.sections[0].items[0]}
            isCoverSection={false}
            generateOnRender={false}
            setOpenEditor={setOpenEditorMock}
            reportDetails={data}
            generateMode={generateMode}
            setGenerateMode={setGenerateMode}
            nextItem={data.sections[0].items[1]}
          />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );
    userEvent.hover(screen.getByTestId("astra__button"));
    await waitFor(() => {
      expect(screen.getByTestId("astra__popover")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("upgrade__button"));
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `/organisation-settings/subscription-settings`
      );
    });
  });

  it("should render upgrade subscription popup", async () => {
    const setOpenEditorMock = jest.fn();
    const subscriptionInfoData = {
      planCode: "astra-monthly",
      addons: [
        {
          uid: 1,
          Code: "astra-token",
          Name: "Token",
          Quantity: 3,
          Status: "Activating",
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

    const generateMode = "summarised";
    const setGenerateMode = jest.fn();

    render(
      <BrowserRouter>
        <SubscriptionContext.Provider
          value={{
            subscriptionInfo: subscriptionInfoData,
            isAllowedToUseAstra: jest.fn(),
          }}
        >
          <EditReportText
            textContent={dummyData.cover.section_body}
            item={data.sections[0].items[0]}
            isCoverSection={false}
            generateOnRender={false}
            setOpenEditor={setOpenEditorMock}
            reportDetails={data}
            generateMode={generateMode}
            setGenerateMode={setGenerateMode}
            nextItem={data.sections[0].items[1]}
          />
        </SubscriptionContext.Provider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("astra__button"));
    await waitFor(() => {
      expect(
        screen.getByTestId("upgrade_subscription_for_astra_kit")
      ).toBeInTheDocument();
    });
  });

  it("Astra button should be disabled", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {},
    });
    const setOpenEditorMock = jest.fn();
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

    AxiosMock.get.mockResolvedValueOnce({
      data: {
        approval_uuid: "123",
        estimated_completion_time: "50",
      },
    });

    window.ClipboardEvent = jest.fn();
    window.DragEvent = jest.fn();
    let generateMode = "detailed";

    const setGenerateMode = jest.fn().mockImplementation(() => {
      generateMode = "detailed";
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
          <EditReportText
            textContent={dummyData.cover.section_body}
            item={data.sections[0].items[0]}
            isCoverSection={false}
            generateOnRender={false}
            setOpenEditor={setOpenEditorMock}
            reportDetails={data}
            generateMode={generateMode}
            setGenerateMode={setGenerateMode}
            nextItem={inValidReportData.sections[0].items[0]}
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
