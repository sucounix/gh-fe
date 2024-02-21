export const checkIfBreakevenExists = (data) => {
  let { revenue, fixed_cost, contribution_margin } = data;

  if (revenue === 0 || Object.values(data).length === 0) {
    return { isExist: false, breakeven: null };
  }
  const breakeven = (fixed_cost / contribution_margin) * 100;

  if (breakeven > 2 * revenue || breakeven < 0) {
    return { isExist: false, breakeven: null };
  } else {
    return { isExist: true, breakeven };
  }
};
