import React, { useContext } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SideMenuContext, SideMenuProvider } from "./SideMenuContext";

const TestingComponent = () => {
  const { isOpen, setIsOpen } = useContext(SideMenuContext);

  return (
    <div data-testid="children_component">
      <button
        data-testid="menu_toggle"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        menu toggle
      </button>
      {isOpen ? (
        <p data-testid="menu_opended">menu is opened</p>
      ) : (
        <p data-testid="menu_closed">menu is closed</p>
      )}
    </div>
  );
};

describe("sidemenu Context", () => {
  it("the side menu is closed by default", async () => {
    render(
      <SideMenuProvider>
        <TestingComponent />
      </SideMenuProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("menu_closed")).toBeInTheDocument();
    });
  });

  it("the side menu is closed by default and try to open it.", async () => {
    render(
      <SideMenuProvider>
        <TestingComponent />
      </SideMenuProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("menu_closed")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("menu_toggle"));
    await waitFor(() => {
      expect(screen.getByTestId("menu_opended")).toBeInTheDocument();
    });
  });
});
