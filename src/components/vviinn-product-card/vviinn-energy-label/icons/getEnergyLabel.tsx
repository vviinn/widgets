import { h } from "@stencil/core";
import { EnergyEfficiencyClass } from "../../../../interfaces/recommendation";
import { NewA, NewB, NewC, NewD, NewE, NewF, NewG } from "./new-standard-icons";
import {
  OldAx3,
  OldAx2,
  OldAx1,
  OldA,
  OldB,
  OldC,
  OldD,
} from "./old-standard-icons";
import { getStandardVersion } from "./getStandartVersion";

export const getEnergyLabel = (
  energyEfficiencyClass: EnergyEfficiencyClass,
  minEnergyEfficiencyClass: EnergyEfficiencyClass,
  maxEnergyEfficiencyClass: EnergyEfficiencyClass
): SVGElement | null => {
  const standardVersion = getStandardVersion(
    minEnergyEfficiencyClass,
    maxEnergyEfficiencyClass
  );

  switch (standardVersion) {
    case "new":
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
    case "old":
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
    case "unknown":
      return null;
  }
};
