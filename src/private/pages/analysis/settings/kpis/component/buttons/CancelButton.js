import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

const CancelButton = () => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        navigate(`/company/${params.companyId}/analysis/settings/kpis`);
        localStorage.removeItem("underCreationKPI");
        localStorage.removeItem("underCreationKPIType");
      }}
      variant={"outline"}
      type="button"
      data-testid="cancel_kpi_btn"
    >
      <span className="action__button">Cancel</span>
    </Button>
  );
};

export default CancelButton;
