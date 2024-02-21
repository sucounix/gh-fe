import React from "react";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import QRedirectURL from "./Q_redirectURL";
import AxiosMock from "axios";

jest.mock("axios");

describe("Redirect URL", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("valid data", async () => {
    const location = {
      ...window.location,
      search: "?code=1234&state=456&realmId=5555",
    };
    Object.defineProperty(window, "location", {
      writable: true,
      value: location,
    });
    AxiosMock.post.mockResolvedValue();

    render(
      <BrowserRouter>
        <QRedirectURL />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AxiosMock.post).toBeCalledTimes(1);
    });
  });
});
