import { getDOM, saveList } from "./collector.ts";
import { Element } from "../deps.ts";

console.log("fetch from sanabo.com start");

const baseUrl = "https://sanabo.com/words/archives/category/";

// deno-fmt-ignore
const char_list = [
  'a','i','u','e','o',
  'ka','ki','ku','ke','ko',
  'sa','si','su','se','so',
  'ta','ti','tu','te','to',
  'na','ni','nu','ne','no',
  'ha','hi','hu','he','ho',
  'ma','mi','mu','me','mo',
  'ya','yu','yo',
  'ra','ri','ru','re','ro',
  'wa'
]
const result: string[] = [];

for (const char of char_list) {
  // Estimate the number of pages to be no more than 30 at most.
  for (let i = 1; i <= 30; i++) {
    const url = baseUrl + char + (i > 0 ? "/page/" + i : "");
    const dom = await getDOM(url);
    if (!dom) {
      console.log(`dom parse failed. go next`);
      break;
    }
    const titles = [...dom.querySelectorAll("h1.h2.entry-title")].map((e) =>
      (e as Element).innerText.replace(/【|】.*/g, "")
    );
    result.push(...titles);
  }
}
await saveList(result);

console.log("fetch from sanabo.com end");
