import { Divider } from "@mantine/core";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useParams } from "react-router-dom";
import nonFinKPI from "../../../../../assets/images/finkpi.svg";
import RowWithToggle from "../../../../../components/row-with-toggle/RowWithToggle";

function SortableKPI({ row, handleToggle, kpiTable, dragging, droppable }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.uuid, data: { ...row, table: kpiTable } });

  const params = useParams();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <React.Fragment key={row.uuid}>
      <div
        ref={setNodeRef}
        {...attributes}
        className="kpis__settings__row"
        style={style}
      >
        <div className="kpis__settings__row__meta">
          <i
            {...listeners}
            className="fa fa-grip-vertical kpis__settings__row__icon"
            style={{
              color:
                dragging && droppable !== kpiTable.uuid ? "#9B9C9F" : "#086972",
            }}
          />
        </div>
        <RowWithToggle
          rowIcon={
            row.reference === "Non-financial" ? (
              <img
                src={nonFinKPI}
                alt="non-financial kpi"
                style={{ width: "1.5rem", height: "1.5rem" }}
              />
            ) : row.reference === "Financial" ? (
              <i
                className="fa-sharp fa-solid fa-calculator-simple"
                style={{ color: "#086972" }}
              ></i>
            ) : null
          }
          rowName={row.name}
          editRow={
            row.reference !== "Predefined" && {
              editTitle: "Edit KPI Entry",
              linkTo: `/company/${params.companyId}/analysis/kpis/edit/custom/${row.uuid}`,
              editTestId: "edit_kpi_button",
            }
          }
          disableSegmentedControl={dragging && droppable !== kpiTable.uuid}
          segmentedDefaultValue={row.is_active ? "show" : "hide"}
          segmentedData={[
            { label: "Hide", value: "hide" },
            { label: "Show", value: "show" },
          ]}
          segmentedTestId={`toggler__row__${row.name}`}
          onSegmentedChange={(e) => {
            handleToggle(row.uuid, e, kpiTable);
          }}
        />
      </div>
      <Divider />
    </React.Fragment>
  );
}

export default SortableKPI;
