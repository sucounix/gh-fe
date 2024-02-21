import React, { useContext } from "react";
import { Checkbox, Pagination, Tooltip } from "@mantine/core";
import moment from "moment";
import emptyGIF from "../../../../assets/images/report-loading.gif";
import { SubscriptionContext } from "../../../../contexts/SubscriptionContext";

function ListReports({
  response,
  setPageNumber,
  currentSortOption,
  setCurrentSortOption,
  selectedReports,
  setSelectedReports,
  confirmDeleteSingleReportModal,
  handleReportClick,
}) {
  const { canCreateReport } = useContext(SubscriptionContext);
  const canViewReportsList = canCreateReport();

  const handleSortChange = (filterName) => {
    const current = currentSortOption.split("_");
    const currentFilter = current[0];
    const currentOrder = current[1];

    if (currentFilter === filterName) {
      if (currentOrder === "asc") {
        setCurrentSortOption(`${filterName}_desc`);
      } else {
        setCurrentSortOption(`${filterName}_asc`);
      }
    } else {
      setCurrentSortOption(`${filterName}_desc`);
    }

    setPageNumber(1);
  };

  const handleSortIcon = (filterName) => {
    const current = currentSortOption.split("_");
    const currentFilter = current[0];
    const currentOrder = current[1];
    if (currentFilter === filterName) {
      if (currentOrder === "asc") {
        return (
          <i
            onClick={() => {
              handleSortChange(filterName);
            }}
            data-testid={`d-${filterName}-asc`}
            className="fa-regular filter__icon fa-arrow-up-wide-short"
          ></i>
        );
      } else {
        return (
          <i
            onClick={() => {
              handleSortChange(filterName);
            }}
            data-testid={`d-${filterName}-desc`}
            className="fa-regular filter__icon fa-arrow-down-wide-short"
          ></i>
        );
      }
    } else {
      return (
        <i
          onClick={() => {
            handleSortChange(filterName);
          }}
          data-testid={`d-${filterName}-none`}
          className="fa-regular filter__icon fa-arrow-down-arrow-up"
        ></i>
      );
    }
  };

  const handleHeaderBackground = (filterName) => {
    const current = currentSortOption.split("_");
    const currentFilter = current[0];

    if (currentFilter === filterName) {
      return "rgba(8, 105, 114, 0.1)";
    } else {
      return "transparent";
    }
  };

  const handleSelectAll = () => {
    if (selectedReports?.length === response.items.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(response.items.map((report) => report.uuid));
    }
  };

  const handleAllCheckboxChecked = () => {
    if (selectedReports?.length === 0) return false;

    return response?.items.map((report) => report.uuid).length ===
      selectedReports?.length
      ? true
      : false;
  };

  const handleSelectedReports = (e, reportUUID) => {
    if (e.target.checked) {
      setSelectedReports([...selectedReports, reportUUID]);
    } else {
      setSelectedReports(
        selectedReports &&
          selectedReports?.length > 0 &&
          selectedReports?.filter((item) => item !== reportUUID)
      );
    }
  };
  return (
    <section data-testid="list-section">
      {response?.items && response.items.length > 0 ? (
        <div className="reports__table__section">
          <table className="reports__table">
            <tr>
              <th
                style={{
                  display: "flex",
                  gap: " 1rem",
                  textAlign: "start",
                  background: handleHeaderBackground("title"),
                }}
              >
                {canViewReportsList ? (
                  <Checkbox
                    checked={handleAllCheckboxChecked() ? true : false}
                    onChange={handleSelectAll}
                    data-testid={"select_all_checkbox"}
                  />
                ) : (
                  <i class="fa-solid fa-lock lock_icon_list_report"></i>
                )}
                <span>
                  Name
                  {handleSortIcon("title")}
                </span>
              </th>
              <th
                style={{
                  background: handleHeaderBackground("period"),
                }}
                data-testid={"period_header"}
              >
                Report Period
                {handleSortIcon("period")}
              </th>
              <th
                style={{
                  background: handleHeaderBackground("modified"),
                }}
                data-testid={"modified_header"}
              >
                Last Update
                {handleSortIcon("modified")}
              </th>
              <th
                style={{
                  background: handleHeaderBackground("created"),
                }}
                data-testid={"created_header"}
              >
                Creation Date
                {handleSortIcon("created")}
              </th>

              <th className="actions_td pr_24">Actions</th>
            </tr>
            {response?.items &&
              response.items.map((report, index) => (
                <Tooltip
                  label="Your current plan limits access to unlock full functionality please upgrade to report kit "
                  events={{
                    hover: !canViewReportsList,
                    focus: !canViewReportsList,
                    touch: !canViewReportsList,
                  }}
                  position="top-start"
                  zIndex={99}
                  key={index}
                >
                  <tr>
                    <td
                      className="reports__list__cell"
                      style={{
                        display: "flex",
                        gap: "1rem",
                        textAlign: "start",
                      }}
                    >
                      {canViewReportsList ? (
                        <Checkbox
                          data-testid={`checkbox_${index}`}
                          checked={
                            selectedReports?.includes(report.uuid)
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            handleSelectedReports(e, report.uuid)
                          }
                        />
                      ) : (
                        <i class="fa-solid fa-lock lock_icon_list_report"></i>
                      )}

                      <div className="report__list__title__wrapper">
                        <span
                          className="report__list__title"
                          onClick={() => {
                            if (canViewReportsList) handleReportClick(report);
                          }}
                          data-testid={`report_list_title_${report.title}`}
                        >
                          {report.title}
                          {!report.is_valid ? (
                            <span
                              className="invalid__flag"
                              data-testid={`invalid_flag_${report.uuid}`}
                            >
                              Invalid
                            </span>
                          ) : null}
                        </span>
                        {!report.is_valid ? (
                          <span
                            className="edit__flag"
                            data-testid={"report_row"}
                            onClick={() => {
                              if (canViewReportsList) handleReportClick(report);
                            }}
                          >
                            <i className="fa fa-edit"></i>
                            Need to change time period for this report
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="reports__list__cell">{report.period}</td>

                    <td className="reports__list__cell">
                      <span
                        className={
                          report.modified ? "creation__date__value" : ""
                        }
                      >
                        {report.modified && moment(report.modified).fromNow()}
                      </span>
                    </td>
                    <td className="reports__list__cell">
                      {moment(report.created).fromNow()}
                    </td>
                    <td
                      className="reports__list__cell pr_24"
                      style={{ textAlign: "end" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        <i
                          class="fa-regular fa-edit"
                          data-testid={`edit_report_${index}`}
                          onClick={() => {
                            if (canViewReportsList) handleReportClick(report);
                          }}
                        ></i>
                        <i
                          class="fa-regular fa-trash-can"
                          data-testid={`delete_list_report_${index}`}
                          onClick={() => {
                            if (canViewReportsList)
                              confirmDeleteSingleReportModal(report.uuid);
                          }}
                        ></i>
                      </div>
                    </td>
                  </tr>
                </Tooltip>
              ))}
          </table>
          {response?.pages && response.pages > 1 && (
            <div
              className="pagination__wrapper"
              data-testid="pagination__container"
            >
              <Pagination
                onChange={(e) => setPageNumber(e)}
                value={response.page}
                total={response.pages}
                withControls
                withEdges
              />
            </div>
          )}
        </div>
      ) : (
        <div data-testid="empty__list" className="no__reports">
          <img src={emptyGIF} width="300" alt="" />
          <span className="no__reports__title">No reports here yet.</span>
          <span className="no__reports__subtitle">
            Time to create a report and see it in action!
          </span>
        </div>
      )}
      <div></div>
    </section>
  );
}

export default ListReports;
