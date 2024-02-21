import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Submenu from "./Submenu";

describe("Submenu", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the submenu items should be rendered", async () => {
    render(
      <BrowserRouter>
        <Submenu
          activeTab={0}
          title="Organisation Settings"
          links={[
            {
              to: "/organisation-settings/company-profile",
              title: "Company Profile",
            },
          ]}
        />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_1")).toBeInTheDocument();
    });
  });

  it("when click on menu item, should navigate to the right path", async () => {
    render(
      <BrowserRouter>
        <Submenu
          activeTab={1}
          title="Organisation Settings"
          links={[
            {
              to: "/organisation-settings/company-profile",
              title: "Company Profile",
            },
          ]}
        />
      </BrowserRouter>
    );
    let link = screen.getByTestId("submenu_link_1");
    await waitFor(() => {
      expect(screen.getByTestId("submenu_link_1")).toBeInTheDocument();
    });
    expect(link.textContent).toEqual("Company Profile");
    expect(link.href).toContain("/organisation-settings/company-profile");
  });
});
