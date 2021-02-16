export const createBearerHeaders = (x: string): Headers => new Headers({
  Authorization: `Bearer ${x}`
});
