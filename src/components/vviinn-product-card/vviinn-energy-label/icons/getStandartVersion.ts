import { EnergyEfficiencyClass } from "../../../../interfaces/recommendation";

export const getStandardVersion = (
  minEnergyEfficiencyClass: EnergyEfficiencyClass,
  maxEnergyEfficiencyClass: EnergyEfficiencyClass
): "old" | "new" | "unknown" => {
  if (minEnergyEfficiencyClass === "G" && maxEnergyEfficiencyClass === "A") {
    return "new";
  } else if (
    minEnergyEfficiencyClass === "D" &&
    maxEnergyEfficiencyClass === "A+++"
  ) {
    return "old";
  } else {
    return "unknown";
  }
};
