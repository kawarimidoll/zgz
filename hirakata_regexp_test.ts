import { assertEquals } from "./deps.ts";
import { hirakataRegexp, hirakataRegexpEachChar } from "./hirakata_regexp.ts";

Deno.test("hirakataRegexp()", () => {
  const src = "あいうえお";
  const regexp = hirakataRegexp(src);
  assertEquals(regexp.test("あいうえお"), true);
  assertEquals(regexp.test("アイウエオ"), true);
  assertEquals(regexp.test("アイうえオ"), false);
});

Deno.test("hirakataRegexpEachChar()", () => {
  const src = "あいうえお";
  const regexp = hirakataRegexpEachChar(src);
  assertEquals(regexp.test("あいうえお"), true);
  assertEquals(regexp.test("アイウエオ"), true);
  assertEquals(regexp.test("アイうえオ"), true);
});
