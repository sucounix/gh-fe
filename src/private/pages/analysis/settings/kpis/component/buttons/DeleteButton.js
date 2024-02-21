import React, { useState } from "react";
import { handleResponseError } from "../../../../../../../utils/errorHandling";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mantine/core";

const DeleteButton = ({ kpiId }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [deleteKPILoading, setDeleteKPILoading] = useState(false);

  const handleDeleteKPI = () => {
    setDeleteKPILoading(true);
    axios
      .delete(`/analysis/kpi/custom/${kpiId}/`)
      .then(() => {
        navigate(`/company/${params.companyId}/analysis/settings/kpis/`);
        setDeleteKPILoading(false);
      })
      .catch((e) => {
        handleResponseError(e);
        setDeleteKPILoading(false);
      });
  };

  return (
    <Button
      data-testid="delete_kpi_btn"
      color="red"
      loading={deleteKPILoading}
      onClick={handleDeleteKPI}
      type="button"
    >
      <span className="action__button">Delete KPI</span>
    </Button>
  );
};

export default DeleteButton;
