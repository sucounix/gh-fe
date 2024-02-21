import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Forecast from "./Forecast";

describe("Forecast", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the coming soon component should be rendered", async () => {
    render(
      <BrowserRouter>
        <Forecast />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("coming__soon__wrapper")).toBeInTheDocument();
    });
  });
});
