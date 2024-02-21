import { checkIfBreakevenExists } from "./BreakevenHelper"; // Adjust the path to the file

describe("checkIfBreakevenExists", () => {
  it("should return false when revenue is 0", () => {
    const data = { revenue: 0, fixed_cost: 100, contribution_margin: 0.5 };
    const result = checkIfBreakevenExists(data);
    expect(result).toEqual({ isExist: false, breakeven: null });
  });

  it("should return false when data is empty", () => {
    const data = {};
    const result = checkIfBreakevenExists(data);
    expect(result).toEqual({ isExist: false, breakeven: null });
  });

  it("should return false when breakeven is greater than 2 * revenue", () => {
    const data = { revenue: 100, fixed_cost: 500, contribution_margin: 0.4 };
    const result = checkIfBreakevenExists(data);
    expect(result).toEqual({ isExist: false, breakeven: null });
  });

  it("should return false when breakeven is negative", () => {
    const data = { revenue: 100, fixed_cost: -50, contribution_margin: 0.4 };
    const result = checkIfBreakevenExists(data);
    expect(result).toEqual({ isExist: false, breakeven: null });
  });

  it("should return true and calculate breakeven when conditions are met", () => {
    const data = {
      revenue: 66000000.0,
      total_cost: 32421253.37,
      fixed_cost: 3495003.37,
      contribution_margin: 56.17234848484849,
      margin_of_safety: 59778071.48130416,
      display_message: false,
    };
    const result = checkIfBreakevenExists(data);
    expect(result).toEqual({ isExist: true, breakeven: 6221928.518695842 });
  });
});
