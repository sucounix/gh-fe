import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import UpgradeSubscriptionForReportKit from "./UpgradeSubscriptionForReportKit";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("UpgradeSubscriptionForReportKit", () => {
  beforeEach(() => {
    useNavigate.mockClear();
  });

  it("renders the component with correct content", () => {
    render(
      <UpgradeSubscriptionForReportKit
        pricePlan={10}
        showUpgradeSubscriptionPopup={true}
        setShowUpgradeSubscriptionPopup={jest.fn()}
      />
    );

    expect(
      screen.getByTestId("upgrade_subscription_for_report_kit")
    ).toBeInTheDocument();
    expect(screen.getByTestId("cancel_btn")).toBeInTheDocument();
    expect(
      screen.getByTestId("go_to_subscription_settings")
    ).toBeInTheDocument();
  });

  it("calls setShowUpgradeSubscriptionPopup with false when Cancel button is clicked", () => {
    const setShowUpgradeSubscriptionPopup = jest.fn();
    render(
      <UpgradeSubscriptionForReportKit
        pricePlan={10}
        showUpgradeSubscriptionPopup={true}
        setShowUpgradeSubscriptionPopup={setShowUpgradeSubscriptionPopup}
      />
    );

    const cancelButton = screen.getByTestId("cancel_btn");
    fireEvent.click(cancelButton);

    expect(setShowUpgradeSubscriptionPopup).toHaveBeenCalledWith(false);
  });

  it("calls useNavigate with the correct path when Go to subscription button is clicked", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    render(
      <UpgradeSubscriptionForReportKit
        pricePlan={10}
        showUpgradeSubscriptionPopup={true}
        setShowUpgradeSubscriptionPopup={jest.fn()}
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
