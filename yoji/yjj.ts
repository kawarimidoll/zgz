import { getDOM, saveList } from "./collector.ts";
import { Element } from "../deps.ts";

console.log("fetch from yoji-jukugo.com start");

const result: string[] = [];
for (let i = 1; i <= 112; i++) {
  const url = `https://yoji-jukugo.com/index/page/${i}`;
  const dom = await getDOM(url);
  if (!dom) {
    console.log(`dom parse failed. go next`);
    break;
  }
  const titles = [
    ...dom.querySelectorAll("#main section .archives .archives-title b"),
  ].map((e) => (e as Element).innerText);
  result.push(...titles);
}
await saveList(result);

console.log("fetch from yoji-jukugo.com end");
