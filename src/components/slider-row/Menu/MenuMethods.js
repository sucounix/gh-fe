export const handleCopyValue = (form, currentItemIndex, fieldName) => {
  const value = form?.values[fieldName][currentItemIndex]?.value;
  const newInputs = form?.values[fieldName].map((item, idx) => {
    if (idx > currentItemIndex) {
      return { ...item, value };
    }
    return item;
  });
  form.setFieldValue(fieldName, newInputs);
};

export const handleAdjustByAmount = (
  form,
  currentItemIndex,
  fieldName,
  adjustAmount
) => {
  const newInputs = form?.values[fieldName];
  let lastValueChanged = newInputs[currentItemIndex].value;

  for (let i = currentItemIndex; i < newInputs.length; i++) {
    if (i === currentItemIndex) {
      newInputs[i].value = lastValueChanged;
    }
    if (i > currentItemIndex) {
      lastValueChanged += adjustAmount;
      newInputs[i].value = lastValueChanged;
      lastValueChanged = newInputs[i].value;
    }
  }

  form.setFieldValue(fieldName, newInputs);
};

export const handleAdjustByPercentage = (
  form,
  currentItemIndex,
  fieldName,
  adjustAmount
) => {
  const newInputs = form?.values[fieldName];
  let lastValueChanged = newInputs[currentItemIndex].value;

  for (let i = currentItemIndex; i < newInputs.length; i++) {
    if (i === currentItemIndex) {
      newInputs[i].value = lastValueChanged;
    }
    if (i > currentItemIndex) {
      lastValueChanged =
        lastValueChanged + (adjustAmount / 100) * lastValueChanged;
      newInputs[i].value = lastValueChanged;
      lastValueChanged = newInputs[i].value;
    }
  }

  form.setFieldValue(fieldName, newInputs);
};
