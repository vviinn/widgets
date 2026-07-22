import { CropperOcrGate } from "./cropperOcrGate";

const imageA = { id: "a" } as unknown as HTMLImageElement;
const imageB = { id: "b" } as unknown as HTMLImageElement;

describe("CropperOcrGate", () => {
  it("gates when OCR is selected and the user has not engaged", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    expect(gate.isGated(true)).toBe(true);
  });

  it("does not gate when OCR is not selected", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    expect(gate.isGated(false)).toBe(false);
  });

  it("keeps the cropper once the user has adjusted it, even under OCR", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    gate.onUserAdjust();
    expect(gate.isGated(true)).toBe(false);
  });

  it("re-arms gating when a different image is loaded", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    gate.onUserAdjust();
    expect(gate.isGated(true)).toBe(false);

    gate.onImage(imageB);
    expect(gate.isGated(true)).toBe(true);
  });

  it("keeps engagement when the same image reloads", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);
    gate.onUserAdjust();
    gate.onImage(imageA);
    expect(gate.isGated(true)).toBe(false);
  });

  it("defers gating on a new image while its search is still loading", () => {
    const gate = new CropperOcrGate();
    gate.onImage(imageA);

    // Search in flight: hide regardless of the current OCR state.
    expect(gate.isGated(false, true)).toBe(true);
    expect(gate.isGated(true, true)).toBe(true);

    // Fresh filters arrived: decide by OCR again.
    gate.onFreshFilters();
    expect(gate.isGated(false, true)).toBe(false);
    expect(gate.isGated(true, true)).toBe(true);
  });
});
