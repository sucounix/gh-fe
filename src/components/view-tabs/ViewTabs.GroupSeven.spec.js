import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ViewTabs from "./ViewTabs";

jest.mock("axios");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "1",
  }),
}));

describe("View tabs component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the tabs should be rendered", async () => {
    render(
      <ViewTabs
        view={true}
        smallText={true}
        setView={jest.fn()}
        options={[
          {
            label: "option 1",
            value: true,
          },
          {
            label: "option  2",
            value: false,
          },
        ]}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("viewTabs")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("tab_option 1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("tab_option 2")).toBeInTheDocument();
    });
  });

  it("when click on the tab , the setViewFn method should be called", async () => {
    const setViewFn = jest.fn();
    render(
      <ViewTabs
        view={true}
        smallText={true}
        setView={setViewFn}
        options={[
          {
            label: "option 1",
            value: true,
          },
          {
            label: "option  2",
            value: false,
          },
        ]}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("viewTabs")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("tab_option 1")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("tab_option 1"));
    await waitFor(() => {
      expect(setViewFn).toBeCalled();
    });
  });

  it("If the smallText = true, the text span should has small_text className", async () => {
    const setViewFn = jest.fn();
    render(
      <ViewTabs
        view={true}
        smallText={true}
        setView={setViewFn}
        options={[
          {
            label: "option 1",
            value: true,
          },
          {
            label: "option  2",
            value: false,
          },
        ]}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("viewTabs")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("tab_option 1")).toBeInTheDocument();
    });
    expect(screen.getByTestId("option_0_label")).toHaveClass("small_text");
  });

  it("If the smallText = false, the text span should has view__type__title className", async () => {
    const setViewFn = jest.fn();
    render(
      <ViewTabs
        view={true}
        smallText={false}
        setView={setViewFn}
        options={[
          {
            label: "option 1",
            value: true,
          },
          {
            label: "option  2",
            value: false,
          },
        ]}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("viewTabs")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("tab_option 1")).toBeInTheDocument();
    });
    expect(screen.getByTestId("option_0_label")).toHaveClass(
      "view__type__title"
    );
  });
});
