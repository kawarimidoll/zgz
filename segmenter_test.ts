import { segmenter } from "./segmenter.ts";
import { assertEquals } from "./deps.ts";

Deno.test("only japanese", () => {
  const src = "私の名前は中野です。";
  const expected = ["私", "の", "名前", "は", "中野", "です", "。"];
  assertEquals(segmenter(src), expected);
});

Deno.test("with english", () => {
  const src = "日本はJapanと書きまーす！";
  const expected = ["日本", "は", "Japan", "と", "書き", "まー", "す", "！"];
  assertEquals(segmenter(src), expected);
});

Deno.test("with english and space", () => {
  const src = "私の名前はjohn doeです";
  const expected = ["私", "の", "名前", "は", "john", "doe", "です"];
  assertEquals(segmenter(src), expected);
});

Deno.test("with number", () => {
  const src = "私の点数は1000点です";
  const expected = ["私", "の", "点数", "は", "1000", "点", "です"];
  assertEquals(segmenter(src), expected);
});

Deno.test("with emoji", () => {
  const src = "非常に🐶です";
  const expected = ["非常", "に", "🐶", "です"];
  assertEquals(segmenter(src), expected);
});

Deno.test("with unicode font", () => {
  const src = "まじ𝑩𝒊𝒈 𝑳𝒐𝒗𝒆";
  const expected = ["まじ", "𝑩𝒊𝒈", "𝑳𝒐𝒗𝒆"];
  assertEquals(segmenter(src), expected);
});
