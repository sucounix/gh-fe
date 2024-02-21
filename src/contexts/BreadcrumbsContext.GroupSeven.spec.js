import React, { useContext } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BreadcrumbsProvider, BreadcrumbsContext } from "./BreadcrumbsContext";

const TestingComponent = () => {
  const { breadCrumbs, setBreadCrumbs } = useContext(BreadcrumbsContext);

  return (
    <div data-testid="children_component">
      <button
        data-testid="add_new_breadcrumbs"
        onClick={() => {
          setBreadCrumbs([{ title: "Analysis" }]);
        }}
      >
        add new breadCrumbs
      </button>
      <div>
        <ul>
          {breadCrumbs?.map((path, pathIndex) => {
            return <li data-testid={`path_${pathIndex}`}>{path.title}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

describe("Breadcrumbs Context", () => {
  it("the breadcrumbs should be rendered", async () => {
    render(
      <BreadcrumbsProvider>
        <TestingComponent />
      </BreadcrumbsProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("children_component")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByTestId("add_new_breadcrumbs")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("add_new_breadcrumbs"));

    await waitFor(() => {
      expect(screen.getByTestId("path_0")).toBeInTheDocument();
    });
  });
});
