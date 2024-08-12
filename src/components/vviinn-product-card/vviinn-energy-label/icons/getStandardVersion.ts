import { EnergyEfficiencyClass } from "../../../../interfaces/recommendation";

export const getStandardVersion = (
  minEnergyEfficiencyClass: EnergyEfficiencyClass,
  maxEnergyEfficiencyClass: EnergyEfficiencyClass
): "old" | "new" | "unknown" => {
  if (minEnergyEfficiencyClass === "A" && maxEnergyEfficiencyClass === "G") {
    return "new";
  } else if (
    minEnergyEfficiencyClass === "A+++" &&
    maxEnergyEfficiencyClass === "D"
  ) {
    return "old";
  } else {
    return "unknown";
  }
};
