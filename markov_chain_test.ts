import { assertEquals } from "./deps.ts";
import { isNgText, parseToNodes, setNgLists } from "./markov_chain.ts";

Deno.test("isNgText", async () => {
  await setNgLists();

  assertEquals(isNgText("丁寧な文章"), false);
  assertEquals(isNgText("犯罪"), true);
  assertEquals(isNgText("嫌い"), true);
  assertEquals(isNgText("くず"), true);
  assertEquals(isNgText("クズ"), true);
});

Deno.test("parseToNodes", async () => {
  await setNgLists();

  const src = `
  今日はいい天気ですね。
  ここにクソみたいな文章が入ります。
  これは丁寧な文章です。
  カレーが嫌い。
  `;
  assertEquals(parseToNodes(src), [
    ["今日", "は", "いい", "天気", "です", "ね", "。"],
    ["これ", "は", "丁寧", "な", "文章", "です", "。"],
  ]);
});
