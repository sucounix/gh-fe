import React, { useContext, useEffect, useState } from "react";
import SingleDropdown from "../single-level-dropdown/SingleDropdown";
import { TimeFrameContext } from "../../contexts/TimeFrameContext";
import SelectTimeframePeriod from "./SelectTimeframePeriod";

const ReportTimeframeSelect = ({
  form,
  freqFormField,
  periodFormField,
  showLabel = true,
}) => {
  const { timeFrameRequestData } = useContext(TimeFrameContext);

  const [periodFrequencyOptions, setperiodFrequencyOptions] = useState([]);

  useEffect(() => {
    if (timeFrameRequestData) {
      handleFreqPeriodOptions();
    }
  }, [timeFrameRequestData]);

  const handleFreqPeriodOptions = () => {
    let frequencyOption = [
      { label: "Monthly", value: "month", disabled: false },
      { label: "Quarterly", value: "quarter", disabled: false },
      { label: "Semi-annual", value: "semi-annual", disabled: false },
      { label: "Annual", value: "annual", disabled: false },
    ];
    // we don't need add month case , bec the {frequencyOption} object by default {disabled: false}
    switch (timeFrameRequestData.initial_value.frequency_period) {
      case "quarter":
        frequencyOption[0].disabled = true;
        break;
      case "semi-annual":
        frequencyOption[0].disabled = true;
        frequencyOption[1].disabled = true;
        break;
      case "annual": // default case is annual
        frequencyOption[0].disabled = true;
        frequencyOption[1].disabled = true;
        frequencyOption[2].disabled = true;
        break;
      default:
        break;
    }
    setperiodFrequencyOptions(frequencyOption);
  };

  return (
    <div className="report_time_frame_select">
      <div>
        <SingleDropdown
          form={form}
          field={freqFormField}
          label="Time Period"
          showLabel={showLabel}
          placeholder="Choose period"
          data={periodFrequencyOptions}
          optionLabel={"label"}
          optionValue={"value"}
          data-testid="period-frequency"
        />
      </div>
      <div>
        <SelectTimeframePeriod
          form={form}
          frequency={form.getInputProps(freqFormField)?.value}
          periodFormField={periodFormField}
          timeframe={timeFrameRequestData.timeframe}
        />
      </div>
    </div>
  );
};
export default ReportTimeframeSelect;
