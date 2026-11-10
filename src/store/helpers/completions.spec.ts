import type { QueryCompletion } from "../../interfaces";
import { withSafeLinks } from "./completions";

describe("withSafeLinks", () => {
  it("removes a script link and keeps the rest", () => {
    const completions: QueryCompletion[] = [
      { suggestion: "sale", url: "javascript:alert(1)" },
      { suggestion: "boots", url: "https://shop.com/boots" },
      { suggestion: "sneakers" },
    ];

    expect(withSafeLinks(completions)).toEqual([
      { suggestion: "sale", url: null },
      { suggestion: "boots", url: "https://shop.com/boots" },
      { suggestion: "sneakers", url: null },
    ]);
  });
});
