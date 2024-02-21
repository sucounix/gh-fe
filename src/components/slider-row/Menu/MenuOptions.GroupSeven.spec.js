import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MenuOptions from "./MenuOptions";
import * as methods from "./MenuMethods";

describe("menu options", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("the modal should rendered", async () => {
    const form = {
      values: {
        field1: [{ value: "value1" }, { value: "value2" }],
      },
      setFieldValue: () => jest.fn(),
    };

    const handleCopyValueSpy = jest.spyOn(methods, "handleCopyValue");

    render(
      <BrowserRouter>
        <MenuOptions
          form={form}
          rowIndex={0}
          itemIndex={0}
          copyOption={true}
          adjustByAmountOption={true}
          adjustByPercentageOption={true}
          fieldName="field1"
          disabled={false}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("menu__target__0__0")).toBeInTheDocument();
    });
  });

  it("the copy option is rendered and the handleCopyValueSpy method is called", async () => {
    const form = {
      values: {
        field1: [{ value: "value1" }, { value: "value2" }],
      },
      setFieldValue: () => jest.fn(),
    };

    const handleCopyValueSpy = jest.spyOn(methods, "handleCopyValue");

    render(
      <BrowserRouter>
        <MenuOptions
          form={form}
          rowIndex={0}
          itemIndex={0}
          copyOption={true}
          adjustByAmountOption={true}
          adjustByPercentageOption={true}
          fieldName="field1"
          disabled={false}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("menu__target__0__0")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("menu__target__0__0"));

    await waitFor(() => {
      expect(screen.getByTestId("copy__0__0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("copy__0__0"));

    await waitFor(() => {
      expect(handleCopyValueSpy).toBeCalled();
    });
  });

  it("the adjust option is rendered and the adjusted modal is rendered", async () => {
    const form = {
      values: {
        field1: [{ value: "value1" }, { value: "value2" }],
      },
      setFieldValue: () => jest.fn(),
    };

    render(
      <BrowserRouter>
        <MenuOptions
          form={form}
          rowIndex={0}
          itemIndex={0}
          copyOption={true}
          adjustByAmountOption={true}
          adjustByPercentageOption={true}
          fieldName="field1"
          disabled={false}
        />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("menu__target__0__0")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("menu__target__0__0"));

    await waitFor(() => {
      expect(screen.getByTestId("amount_modify__0__0")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("amount_modify__0__0"));

    await waitFor(() => {
      expect(screen.getByTestId("adjust__value__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("save_btn"));
    await waitFor(() => {
      expect(screen.getByTestId("percentage_modify__0__0")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("percentage_modify__0__0"));

    await waitFor(() => {
      expect(screen.getByTestId("adjust__value__modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("save_btn"));
  });
});
