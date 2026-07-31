import { trackEvent } from "./store";
import { TrackedEvent } from "../tracking/models";

const fetchMock = jest.fn(() =>
  Promise.resolve({
    status: 200,
    headers: new Headers({ "content-type": "application/json" }),
    text: () => Promise.resolve(JSON.stringify({ status: "accepted" })),
  }),
);
(global as any).fetch = fetchMock;

const event = { typ: "product_click_event" } as TrackedEvent;

describe("trackEvent", () => {
  beforeEach(() => fetchMock.mockClear());

  it("sends the event by default", async () => {
    await trackEvent(event, "token");

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('sends nothing when tracking events are disabled with "all"', async () => {
    await trackEvent(event, "token", { disableTrackingEvents: "all" });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("skips the request without a token", async () => {
    await trackEvent(event, "");

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
