import React from "react";
import AxiosMock from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FinancialKPI from "./FinancialKPI";
import { useForm } from "@mantine/form";

jest.mock("axios");
const mockedUsedNavigate = jest.fn();

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    kpiId: 1,
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));
const Wrapper = ({ addNumber = false }) => {
  let formulaArr = [
    { type: "number", value: 5 },
    { type: "operator", value: "+" },
  ];
  if (addNumber) {
    formulaArr.push({ type: "number", value: 5 });
  }
  const FinancialForm = useForm({
    initialValues: {
      formula: formulaArr,
    },
  });

  return <FinancialKPI form={FinancialForm} />;
};

describe("KPIs Edit", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should read the formula", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          label: "Profit & Loss",
          values: [
            {
              label: "Revenue",
              category: "Revenue",
            },
          ],
        },
      ],
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <FinancialKPI
        form={{
          values: {
            formula: [
              { type: "number", value: 5 },
              { type: "operator", value: "+" },
              { type: "number", value: 7 },
            ],
          },
          getInputProps: () => {},
          setFieldValue: () => {},
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("formula__wrapper")).toBeInTheDocument();
    });

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByTestId("formula__wrapper").children.length).toBe(3);
    });
  });

  it("should add a variable to formula", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            label: "Profit & Loss",
            values: [
              {
                label: "Revenue",
                category: "Revenue",
              },
            ],
          },
        ],
      }),
    ]);

    window.ResizeObserver = ResizeObserver;

    render(<Wrapper />);

    await waitFor(() => {
      expect(screen.getByTestId("variable_0")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("add_variable_0"));
    });

    await waitFor(() => {
      // eslint-disable-next-line
      expect(screen.getByTestId("formula__wrapper").children.length).toBe(3);
    });
  });

  it("should add a number to formula", async () => {
    AxiosMock.get.mockResolvedValueOnce({
      data: [
        {
          label: "Profit & Loss",
          values: [
            {
              label: "Revenue",
              category: "Revenue",
            },
          ],
        },
      ],
    });

    window.ResizeObserver = ResizeObserver;

    render(
      <FinancialKPI
        form={{
          values: {
            formula: [
              { type: "number", value: 5 },
              { type: "operator", value: "+" },
              { type: "number", value: 7 },
            ],
          },
          getInputProps: () => {},
          setFieldValue: () => {},
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("number__0")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("number__0"));

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByTestId("formula__wrapper").children.length).toBe(3);
    });
  });

  it("should add an operator to formula", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            label: "Profit & Loss",
            values: [
              {
                label: "Revenue",
                category: "Revenue",
              },
            ],
          },
        ],
      }),
    ]);

    window.ResizeObserver = ResizeObserver;

    render(<Wrapper addNumber={true} />);

    await waitFor(() => {
      expect(screen.getByTestId("operator__+")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("operator__+"));
    });

    await waitFor(() => {
      // eslint-disable-next-line
      expect(screen.getByTestId("formula__wrapper").children.length).toBe(4);
    });
  });

  it("should remove a variable from formula", async () => {
    Promise.all([
      AxiosMock.get.mockResolvedValueOnce({
        data: [
          {
            label: "Profit & Loss",
            values: [
              {
                label: "Revenue",
                category: "Revenue",
              },
            ],
          },
        ],
      }),
    ]);

    window.ResizeObserver = ResizeObserver;

    render(<Wrapper addNumber={true} />);

    await waitFor(() => {
      expect(screen.getByTestId("variable_0")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("backspace__button"));
    });
    await waitFor(() => {
      // eslint-disable-next-line
      expect(screen.getByTestId("formula__wrapper").children.length).toBe(2);
    });
  });
});
