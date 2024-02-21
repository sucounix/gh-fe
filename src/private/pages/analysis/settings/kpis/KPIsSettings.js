import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import "./style/KPIsSettings.scss";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  Loader,
  Select,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { SortableContext } from "@dnd-kit/sortable";
import SortableKPI from "./SortableKPI";
import { DndContext } from "@dnd-kit/core";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { CompaniesContext } from "../../../../../contexts/CompaniesContext";
import CompanyLoading from "../../../../components/company-loading/CompanyLoading";
import SingleDropdown from "../../../../../components/single-level-dropdown/SingleDropdown";

function KPIsSettings() {
  const [filterView, setFilterView] = useState("all");
  const [kpiTables, setKpiTables] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [droppable, setDroppable] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

  const { selectedCompany, fetchSelectedCompany, isSelectedCompanyReady } =
    useContext(CompaniesContext);

  const filterOptions = [
    { label: "All KPIs", value: "all" },
    { label: " Activated KPI's", value: "activated" },
  ];

  useLayoutEffect(() => {
    fetchSelectedCompany();
  }, []);

  useEffect(() => {
    if (isSelectedCompanyReady) {
      setLoading(true);
      axios
        .get(`/analysis/kpi/settings/${selectedCompany?.uuid}`)
        .then((res) => {
          setKpiTables(res.data);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, [selectedCompany?.uuid, isSelectedCompanyReady]);

  useEffect(() => {
    let totalNumberOfActive = 0;
    kpiTables.forEach((table) => {
      table.kpis.forEach((row) => {
        if (row.is_active) {
          totalNumberOfActive++;
        }
      });
    });

    setActiveCount(totalNumberOfActive);
  }, [kpiTables]);

  const handleToggle = (rowId, activated, table) => {
    axios
      .put(`/analysis/kpi/item/settings/${rowId}/`, {
        is_active: activated === "show" ? true : false,
      })
      .then((res) => {
        notifications.show({
          title: "Success",
          message: "KPI has been updated",
        });

        setKpiTables((prev) => {
          const newTables = [...prev];
          const targetTableIndex = newTables.findIndex(
            (item) => item.uuid === table.uuid
          );
          const targetRowIndex = newTables[targetTableIndex].kpis.findIndex(
            (item) => item.uuid === rowId
          );

          newTables[targetTableIndex].kpis[targetRowIndex].is_active =
            activated === "show" ? true : false;

          return newTables;
        });

        setActiveCount((prev) => {
          if (activated === "show") {
            return prev + 1;
          } else {
            return prev - 1;
          }
        });
      })
      .catch((e) => {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
        });
      });
  };

  const handleSorting = (event) => {
    setDragging(false);
    setDroppable(null);

    const draggedId = event.active.data.current.uuid;

    const draggedOverPriority = event.over.data.current.priority;
    const draggedOverId = event.over.data.current.uuid;

    const targetTableId = event.over.data.current.table.uuid;
    const targetTableIndex = kpiTables.findIndex(
      (item) => item.uuid === targetTableId
    );
    const targetRowIndex = kpiTables[targetTableIndex].kpis.findIndex(
      (item) => item.uuid === draggedOverId
    );

    const draggedRowIndex = kpiTables[targetTableIndex].kpis.findIndex(
      (item) => item.uuid === draggedId
    );
    const draggedRow = kpiTables[targetTableIndex].kpis.find(
      (item) => item.uuid === draggedId
    );

    let newTables = [...kpiTables];
    newTables[targetTableIndex].kpis.splice(draggedRowIndex, 1);
    newTables[targetTableIndex].kpis.splice(
      draggedOverPriority - 1,
      0,
      draggedRow
    );

    for (
      let i = targetRowIndex;
      i < newTables[targetTableIndex].kpis.length;
      i++
    ) {
      newTables[targetTableIndex].kpis[i].priority = i + 1;
    }

    setKpiTables(newTables);

    axios
      .put(`/analysis/kpi/item/settings/${draggedId}/`, {
        priority: draggedOverPriority,
      })
      .then((res) => {
        notifications.show({
          title: "Success",
          message: "KPI has been updated",
        });
      })
      .catch((e) => {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
        });
      });
  };

  const handleDragStart = (tableId) => {
    setDragging(true);
    setDroppable(tableId);
  };

  if (!isSelectedCompanyReady) {
    return <CompanyLoading title="KPIs" />;
  }

  return (
    <div className="kpis__settings__wrapper">
      <div className="kpis__settings__header">
        <h1 className="kpis__settings__title">KPI's</h1>
        <span className="kpis__settings__desc">
          Select from a range of standard financial KPIs or create your own KPI.
        </span>
        <Divider style={{ margin: "18px 0" }} />
        <Grid style={{ marginBottom: "18px" }}>
          <Grid.Col span={3}>
            <SingleDropdown
              data={filterOptions}
              value={filterOptions.find((item) => item.value === filterView)}
              onChange={(e) => {
                setFilterView(e.value);
              }}
              optionLabel={"label"}
              optionValue={"value"}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Flex
              align={"center"}
              justify={"flex-start"}
              className="kpis__selected__value__wrapper"
              h="100%"
            >
              <Avatar color="#086972" radius="xl">
                <span className="kpis__selected__value">{activeCount}</span>
              </Avatar>

              <span className="kpis__selected__value__desc">
                KPI's have been activated
              </span>
            </Flex>
          </Grid.Col>
          <Grid.Col span={6}>
            <Flex align={"center"} justify={"flex-end"}>
              <Button
                onClick={() => {
                  navigate(
                    `/company/${params.companyId}/analysis/kpis/add/custom`
                  );
                }}
                size={"md"}
              >
                <span className="create__kpi__button">Create new KPI</span>
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </div>

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
        >
          <Loader />
        </div>
      ) : (
        <>
          <div className="kpis_settings_tables">
            <span className="kpis__list__title">KPI's</span>
            {kpiTables?.length > 0 &&
              kpiTables.map((kpiTable) => (
                <>
                  {kpiTable.kpis.length > 0 && (
                    <React.Fragment key={kpiTable.uuid}>
                      <span
                        className="kpi__table__name"
                        style={{
                          color:
                            dragging &&
                            droppable !== kpiTable.uuid &&
                            "#9B9C9F",
                        }}
                      >
                        {kpiTable.group_name}
                      </span>
                      <Divider />
                      <div className="kpis_settings__table">
                        <DndContext
                          onDragEnd={handleSorting}
                          onDragStart={() => {
                            handleDragStart(kpiTable.uuid);
                          }}
                        >
                          <SortableContext
                            items={
                              kpiTable.kpis.length > 0
                                ? kpiTable.kpis.map((value) => value.uuid)
                                : []
                            }
                          >
                            {kpiTable.kpis.map((row) => (
                              <>
                                {filterView === "all" ? (
                                  <SortableKPI
                                    key={row.uuid}
                                    row={row}
                                    handleToggle={handleToggle}
                                    kpiTable={kpiTable}
                                    dragging={dragging}
                                    droppable={droppable}
                                  />
                                ) : (
                                  filterView === "activated" &&
                                  row.is_active && (
                                    <SortableKPI
                                      key={row.uuid}
                                      row={row}
                                      handleToggle={handleToggle}
                                      kpiTable={kpiTable}
                                      dragging={dragging}
                                      droppable={droppable}
                                    />
                                  )
                                )}
                              </>
                            ))}
                          </SortableContext>
                        </DndContext>
                        {kpiTables.findIndex(
                          (item) => item.uuid === kpiTable.uuid
                        ) !==
                          kpiTables.length - 1 && (
                          <div className="kpis__table__border"></div>
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default KPIsSettings;
