import { toFile } from "./toFile";

describe("toFile", () => {
  it("does not call fetch on the data URL (CSP connect-src safe)", () => {
    const fetchSpy = jest.spyOn(global, "fetch");

    toFile("data:image/png;base64,aGVsbG8=");

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("decodes the base64 payload into a File with the correct type and content", async () => {
    const file = toFile("data:image/png;base64,aGVsbG8=");

    expect(file.type).toBe("image/png");
    expect(file.name).toBe("image");

    const text = await file.text();
    expect(text).toBe("hello");
  });
});
