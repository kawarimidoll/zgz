import { assertEquals } from "./deps.ts";
import {
  hirakataRegexp,
  hirakataRegexpEachChar,
  smartJoin,
} from "./string_utils.ts";

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

Deno.test("smartJoin()", () => {
  assertEquals(
    smartJoin([
      "わたし",
      "は",
      "ホットドッグ",
      "が",
      "とても",
      "好き",
      "です",
      "。",
    ]),
    "わたしはホットドッグがとても好きです。",
  );
  assertEquals(
    smartJoin([
      "わたし",
      "は",
      "hotto",
      "doggu",
      "が",
      "とても",
      "好き",
      "です",
      "🌭",
    ]),
    "わたしはhotto dogguがとても好きです🌭",
  );
  assertEquals(
    smartJoin(["I", "like", "hotto", "doggu", "very", "much", "!"]),
    "I like hotto doggu very much!",
  );
  assertEquals(
    smartJoin(["𝑰", "𝒍𝒊𝒌𝒆", "𝒉𝒐𝒕", "𝒅𝒐𝒈𝒔", "𝒗𝒆𝒓𝒚", "𝒎𝒖𝒄𝒉", "."]),
    "𝑰 𝒍𝒊𝒌𝒆 𝒉𝒐𝒕 𝒅𝒐𝒈𝒔 𝒗𝒆𝒓𝒚 𝒎𝒖𝒄𝒉.",
  );
});
