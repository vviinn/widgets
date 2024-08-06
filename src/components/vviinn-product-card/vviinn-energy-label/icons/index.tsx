import { h } from "@stencil/core";
import { EnergyEfficiencyClass } from "../../../../interfaces/recommendation";
import { NewA, NewB, NewC, NewD, NewE, NewF, NewG } from "./new-standart";
import { OldAx3, OldAx2, OldAx1, OldA, OldB, OldC, OldD } from "./old-standart";

const checkWhichStandart = (
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

export const getEnergyLabel = (
  energyEfficiencyClass: EnergyEfficiencyClass,
  minEnergyEfficiencyClass: EnergyEfficiencyClass,
  maxEnergyEfficiencyClass: EnergyEfficiencyClass
): SVGElement | null => {
  const standart = checkWhichStandart(
    minEnergyEfficiencyClass,
    maxEnergyEfficiencyClass
  );

  if (standart === "new") {
    switch (energyEfficiencyClass) {
      case "A":
        return <NewA />;
      case "B":
        return <NewB />;
      case "C":
        return <NewC />;
      case "D":
        return <NewD />;
      case "E":
        return <NewE />;
      case "F":
        return <NewF />;
      case "G":
        return <NewG />;
      default:
        return null;
    }
  }

  if (standart === "old") {
    switch (energyEfficiencyClass) {
      case "A+++":
        return <OldAx3 />;
      case "A++":
        return <OldAx2 />;
      case "A+":
        return <OldAx1 />;
      case "A":
        return <OldA />;
      case "B":
        return <OldB />;
      case "C":
        return <OldC />;
      case "D":
        return <OldD />;
      default:
        return null;
    }
  }

  if (standart === "unknown") {
    return null;
  }
};
