import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IdleUser } from "./IdleUser";
import { modals } from "@mantine/modals";

jest.mock("@mantine/modals", () => ({
  modals: {
    openConfirmModal: jest.fn().mockImplementation((props) => {
      const { children } = props;
      return children;
    }),
    closeAll: jest.fn(),
  },
}));

describe("IdleUser", () => {
  it("should open the confirm modal with correct props", () => {
    render(<IdleUser />);

    expect(modals.openConfirmModal).toHaveBeenCalledWith({
      centered: true,
      radius: 20,
      size: "lg",
      withCloseButton: false,
      className: "idle__user_modal",
      children: expect.objectContaining({
        type: expect.stringContaining("div"),
      }),
    });
  });
});
