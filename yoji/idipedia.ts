import { getDOM, saveList } from "./collector.ts";
import { Element } from "../deps.ts";

console.log("fetch from idiom-encyclopedia.com start");

const result: string[] = [];
for (let i = 1; i <= 44; i++) {
  const url = `https://idiom-encyclopedia.com/gozyuon/page/${i}`;
  const dom = await getDOM(url);
  if (!dom) {
    console.log(`dom parse failed. go next`);
    break;
  }
  const titles = [...dom.querySelectorAll("#main section ul li a")].map((e) =>
    (e as Element).innerText.replace(/【.*/, "")
  );
  result.push(...titles);
}
await saveList(result);

console.log("fetch from idiom-encyclopedia.com end");
