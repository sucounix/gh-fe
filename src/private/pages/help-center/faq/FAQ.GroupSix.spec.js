import React from "react";
import { render, screen } from "@testing-library/react";
import FAQs from "./FAQ";
import { FAQsData } from "./FAQsData";

describe("FAQs", () => {
  it("should render the FAQs component correctly", () => {
    render(<FAQs />);

    expect(screen.getByTestId("faq__div")).toBeInTheDocument();
    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Have a question about using Femto? Check out some of our frequently asked questions."
      )
    ).toBeInTheDocument();
  });

  it("should render the FAQs data correctly", () => {
    render(<FAQs />);

    for (let i = 0; i < FAQsData.length; i++) {
      expect(screen.getByText(FAQsData[i].question)).toBeInTheDocument();
    }
  });
});
