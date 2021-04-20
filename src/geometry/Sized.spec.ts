import { Sized, sizedDivSemigroup } from "./Sized";

it("should divide two sizables", async () => {
  const source: Sized = {
    width: 100,
    height: 100,
  };

  const target: Sized = {
    width: 50,
    height: 50,
  };

  const result = {
    width: 0.5,
    height: 0.5,
  };

  expect(sizedDivSemigroup.concat(target, source)).toStrictEqual(result);
});
