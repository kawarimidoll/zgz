import { getDOM, saveList } from "./collector.ts";
import { Element } from "../deps.ts";

console.log("fetch from yoji.jitenon start");

const result: string[] = [];
for (let i = 1; i <= 66; i++) {
  if (i === 58 || i === 59) {
    continue;
  }

  const url = `https://yoji.jitenon.jp/cat/yomi${
    String(i).padStart(2, "0")
  }.html`;
  const dom = await getDOM(url);
  if (!dom) {
    console.log(`dom parse failed. go next`);
    continue;
  }
  const titles = [...dom.querySelectorAll("#maininner span.word")].map((e) =>
    (e as Element).innerText
  );
  result.push(...titles);
}

await saveList(result);

console.log("fetch from yoji.jitenon end");
