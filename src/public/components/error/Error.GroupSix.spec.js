import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import Error from "./Error";

describe("Error", () => {
  it("navigates to home ", async () => {
    render(<Error />);

    await waitFor(() => {
      expect(screen.getByTestId("error-container")).toBeInTheDocument();
    });

    const goToHome = screen.getByTestId("go-to-home");

    await waitFor(() => {
      expect(goToHome).toBeInTheDocument();
    });

    fireEvent.click(goToHome);
  });
});
