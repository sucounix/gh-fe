import React, { useState } from "react";
import AxiosMock from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NewNonFinancialKPI from "./NewNonFinancialKPI";
import { CompaniesContext } from "../../../../../../../contexts/CompaniesContext";

jest.mock("axios");
const mockedUsedNavigate = jest.fn();

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const Wrapper = () => {
  const [type, setType] = useState("fixed");

  return (
    <CompaniesContext.Provider
      value={{
        companies: [
          {
            uuid: "1",
            name: "Company 1",
            currency: "EGP",
          },
        ],
        selectedCompany: {
          uuid: "1",
          name: "Company 1",
          currency: "EGP",
        },
      }}
    >
      <NewNonFinancialKPI
        kpiName={"test 1"}
        kpiUnit={"Percentage"}
        form={{
          values: {
            KPIType: type,
          },
          getInputProps: () => {},
          setFieldValue: (key, value) => {
            setType(value);
          },
        }}
        listOfYears={[{ label: "2022", value: "2022" }]}
      />
    </CompaniesContext.Provider>
  );
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    companyId: "1",
  }),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not
}));

describe("KPIs Create", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // adjust time out for the test
  it("should render as fixed and toggle to variable", async () => {
    Promise.resolve(
      AxiosMock.get.mockResolvedValueOnce({
        uuid: "3756ae1e-7287-4910-bcc3-c9191e5af5d2",
        name: "asdasdsa",
        type: "Percentage",
        group: "3cbe5594-1bd3-4d8c-a2e5-c90ae9f7a9e6",
        reference: "Non-financial",
        aggregation: "Sum",
        definition: "Higher value preferable",
        description: "",
        values_type: "fixed",
        value: 20,
        values: [
          {
            year: 2020,
            periods: [
              {
                uuid: "756aa8c9-f6c4-4e4e-a21c-375e34a03c15",
                period: "Jan 2020",
                value: 34,
              },
              {
                uuid: "756aa8c9-f6c4-4e4e-a21c-375e34a03c15",
                period: "Feb 2020",
                value: 20,
              },
            ],
          },
        ],
      })
    );

    window.ResizeObserver = ResizeObserver;

    render(<Wrapper />);

    await waitFor(() => {
      expect(screen.getByTestId("fixed_value")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("tab_Variable Values")).toBeInTheDocument();
      // eslint-disable-next-line
      fireEvent.click(screen.getByTestId("tab_Variable Values"));
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("variable__inputs__wrapper")
      ).toBeInTheDocument();
    });
  });
});
