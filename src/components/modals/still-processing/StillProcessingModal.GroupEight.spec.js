import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import StillProcessingModal from "./StillProcessingModal";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

describe("Still Processing", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should render if the opened flag = true", async () => {
    const handleHideStillProcessing = jest.fn();
    render(
      <BrowserRouter>
        <StillProcessingModal
          opened={true}
          url={""}
          handleHideStillProcessing={handleHideStillProcessing}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Still_Processing_Modal")).toBeInTheDocument();
    });
  });
  it("when click on done button , the handleHideStillProcessing is called", async () => {
    const handleHideStillProcessing = jest.fn();
    render(
      <BrowserRouter>
        <StillProcessingModal
          opened={true}
          url={"/"}
          handleHideStillProcessing={handleHideStillProcessing}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Still_Processing_Modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("done_btn"));
    await waitFor(() => {
      expect(handleHideStillProcessing).toBeCalled();
    });
  });

  it("when click on done button , and thier is an URL it should navigate to it", async () => {
    const handleHideStillProcessing = jest.fn();
    render(
      <BrowserRouter>
        <StillProcessingModal
          opened={true}
          url={"/"}
          handleHideStillProcessing={handleHideStillProcessing}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("Still_Processing_Modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("done_btn"));
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(`/`);
    });
  });
});
