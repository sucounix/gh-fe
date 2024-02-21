import React from "react";
import { waitFor } from "@testing-library/react";
import { renderUI } from "./RenderUI";

describe("Render quickbooks form", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Redirect successfully", async () => {
    window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
      },
      writable: true,
    });

    window.location.assign = jest.fn();
    renderUI({ state: "from=2022-04-01,to=2022-05-01" });

    await waitFor(() => {
      expect(window.location.assign).toBeCalledTimes(1);
    });
  });
});
