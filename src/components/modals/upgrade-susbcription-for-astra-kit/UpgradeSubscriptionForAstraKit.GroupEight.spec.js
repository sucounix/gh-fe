import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import UpgradeSubscriptionForAstraKit from "./UpgradeSubscriptionForAstraKit";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("UpgradeSubscriptionForastraKit", () => {
  beforeEach(() => {
    useNavigate.mockClear();
  });

  it("renders the astra component with correct content", () => {
    render(
      <UpgradeSubscriptionForAstraKit
        pricePlan={10}
        showUpgradeSubscriptionPopup={true}
        closeUpgradeSubscriptionPopup={jest.fn()}
      />
    );

    expect(
      screen.getByTestId("upgrade_subscription_for_astra_kit")
    ).toBeInTheDocument();
    expect(screen.getByTestId("cancel_btn")).toBeInTheDocument();
    expect(
      screen.getByTestId("go_to_subscription_settings")
    ).toBeInTheDocument();
  });

  it("calls closeUpgradeSubscriptionPopup with false when Cancel button is clicked", () => {
    const closeUpgradeSubscriptionPopup = jest.fn();
    render(
      <UpgradeSubscriptionForAstraKit
        pricePlan={10}
        showUpgradeSubscriptionPopup={true}
        closeUpgradeSubscriptionPopup={closeUpgradeSubscriptionPopup}
      />
    );

    const cancelButton = screen.getByTestId("cancel_btn");
    fireEvent.click(cancelButton);

    expect(closeUpgradeSubscriptionPopup).toHaveBeenCalled();
  });

  it("in astra plan calls useNavigate with the correct path when Go to subscription button is clicked", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    render(
      <UpgradeSubscriptionForAstraKit
        pricePlan={10}
        showUpgradeSubscriptionPopup={true}
        closeUpgradeSubscriptionPopup={jest.fn()}
      />
    );

    const goToSubscriptionButton = screen.getByTestId(
      "go_to_subscription_settings"
    );
    fireEvent.click(goToSubscriptionButton);

    expect(navigate).toHaveBeenCalledWith(
      "/organisation-settings/subscription-settings"
    );
  });
});
