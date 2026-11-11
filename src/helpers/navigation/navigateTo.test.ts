import { navigateTo } from "./navigateTo";

describe("navigateTo", () => {
  const location = { href: "https://shop.com/" };
  const open = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      value: location,
      writable: true,
    });
    Object.defineProperty(window, "open", { value: open, writable: true });
  });

  beforeEach(() => {
    location.href = "https://shop.com/";
    open.mockClear();
  });

  it("goes to a web link in the same tab", () => {
    navigateTo("https://shop.com/p/1");

    expect(location.href).toBe("https://shop.com/p/1");
    expect(open).not.toHaveBeenCalled();
  });

  it("opens a web link in a new tab without an opener", () => {
    navigateTo("https://shop.com/p/1", true);

    expect(open).toHaveBeenCalledWith(
      "https://shop.com/p/1",
      "_blank",
      "noopener,noreferrer",
    );
    expect(location.href).toBe("https://shop.com/");
  });

  it.each([false, true])(
    "goes nowhere for a script link (new tab: %s)",
    (newTab) => {
      navigateTo("javascript:alert(1)", newTab);

      expect(location.href).toBe("https://shop.com/");
      expect(open).not.toHaveBeenCalled();
    },
  );
});
