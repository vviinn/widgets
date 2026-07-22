import { CropperOcrGate } from "./cropperOcrGate";
import { ResponseDynamicFilterItem } from "../../../interfaces";

const ocrFilters = (selected: boolean): ResponseDynamicFilterItem[] =>
  [
    {
      type: "categorical",
      column: "modality",
      label: "modality",
      isPrimary: false,
      values: [{ value: "OCR", label: "OCR", active: true, selected }],
    },
  ] as ResponseDynamicFilterItem[];

const imageA = { id: "a" } as unknown as HTMLImageElement;
const imageB = { id: "b" } as unknown as HTMLImageElement;

describe("CropperOcrGate", () => {
  it("gates when OCR is selected and the user has not engaged", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    expect(gate.isGated(ocrFilters(true))).toBe(true);
  });

  it("does not gate when no OCR filter is selected", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    expect(gate.isGated(ocrFilters(false))).toBe(false);
    expect(gate.isGated([])).toBe(false);
    expect(gate.isGated(undefined)).toBe(false);
  });

  it("keeps the cropper once the user has adjusted it, even under OCR", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    gate.onUserAdjust();
    expect(gate.isGated(ocrFilters(true))).toBe(false);
  });

  it("does not gate a re-upload on stale filters until fresh ones arrive", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    gate.onUserAdjust();
    expect(gate.isGated(ocrFilters(true))).toBe(false);

    // Re-upload: stale filters, cropper stays until fresh ones arrive.
    gate.onImage(imageB);
    expect(gate.isGated(ocrFilters(true))).toBe(false);

    gate.onFreshFilters();
    expect(gate.isGated(ocrFilters(true))).toBe(true);
  });

  it("keeps engagement when the same image reloads", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    gate.onUserAdjust();
    gate.onImage(imageA);
    expect(gate.isGated(ocrFilters(true))).toBe(false);
  });
});
