import { assertEquals, assertNotEquals } from "../deps.ts";
import { shuffle } from "./random.ts";

Deno.test("seeded shuffle", () => {
  const seed = "hello";
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const expected = [7, 6, 1, 2, 3, 8, 9, 5, 4];
  const actual = shuffle(array, seed);

  // allways return the same result if the seed is the same
  assertEquals(actual, expected);

  // return different result if the seed is different
  assertNotEquals(shuffle(array, seed + "!"), expected);
});
