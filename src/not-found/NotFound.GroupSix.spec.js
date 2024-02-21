import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFound from "./NotFound";
import { BreadcrumbsContext } from "../contexts/BreadcrumbsContext";
import { UserContext } from "../contexts/UserContext";

describe("Not Found", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("If the user doesn't exist, the NoAuthHeader component should be rendered", async () => {
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider value={{ setBreadCrumbs: jest.fn() }}>
          <UserContext.Provider value={{ user: null }}>
            <NotFound />
          </UserContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getByTestId("no_auth_header_container")
      ).toBeInTheDocument();
    });
  });

  it("If the user is exist, the AuthHeader component should be rendered", async () => {
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ breadCrumbs: { title: "test" }, setBreadCrumbs: jest.fn() }}
        >
          <UserContext.Provider value={{ user: { uuid: "123" } }}>
            <NotFound />
          </UserContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("header_container")).toBeInTheDocument();
    });
  });

  it("If the content should be rendered", async () => {
    render(
      <BrowserRouter>
        <BreadcrumbsContext.Provider
          value={{ breadCrumbs: { title: "test" }, setBreadCrumbs: jest.fn() }}
        >
          <UserContext.Provider value={{ user: { uuid: "123" } }}>
            <NotFound />
          </UserContext.Provider>
        </BreadcrumbsContext.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("not__found__title")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("not__found__text")).toBeInTheDocument();
    });
  });
});
