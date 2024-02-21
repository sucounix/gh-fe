import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AxiosMock from "axios";
import AstraChatHistory from "./AstraChatHistory";

jest.mock("axios");

describe("Astra History", () => {
  beforeEach(() => {
    AxiosMock.get.mockResolvedValue({
      data: {
        threads: [
          { thread_id: 1, title: "Thread 1" },
          { thread_id: 2, title: "Thread 2" },
          { thread_id: 3, title: "Thread 3" },
        ],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading spinner while fetching threads", () => {
    render(<AstraChatHistory />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render threads after fetching threads", async () => {
    render(<AstraChatHistory />);

    await waitFor(() => {
      expect(screen.queryAllByTestId("thread")).toHaveLength(3);
    });
  });

  it("should render search input if there are threads", async () => {
    render(<AstraChatHistory />);

    await waitFor(() => {
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });
  });

  it("should filter threads based on search input", async () => {
    render(<AstraChatHistory />);
    const searchInput = await screen.findByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "Thread 1" } });

    await waitFor(() => {
      expect(screen.getByText("Q: Thread 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText("Q: Thread 2")).toBeNull();
    });

    await waitFor(() => {
      expect(screen.queryByText("Q: Thread 3")).toBeNull();
    });
  });

  it("should filter add all threads if search is empty", async () => {
    render(<AstraChatHistory />);
    const searchInput = await screen.findByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.getByText("Q: Thread 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Q: Thread 2")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Q: Thread 3")).toBeInTheDocument();
    });
  });

  it("should call setThreadId and setIsHistoryOpen when a thread is clicked", async () => {
    const setThreadId = jest.fn();
    const setIsHistoryOpen = jest.fn();

    render(
      <AstraChatHistory
        setThreadId={setThreadId}
        setIsHistoryOpen={setIsHistoryOpen}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });

    const threads = screen.getAllByTestId("thread");
    fireEvent.click(threads[0]);

    expect(setThreadId).toHaveBeenCalledWith(1);
    expect(setIsHistoryOpen).toHaveBeenCalledWith(false);
  });

  it("should render 'No history available' if there are no threads", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: {
        threads: [],
      },
    });
    render(<AstraChatHistory />);
    expect(await screen.findByTestId("no-history")).toBeInTheDocument();
  });
});
