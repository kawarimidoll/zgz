import { getDOM, saveList } from "./collector.ts";
import { Element } from "../deps.ts";

console.log("fetch from imidas start");

async function getFromImidas(url: string) {
  const dom = await getDOM(url);
  if (!dom) {
    console.log(`dom parse failed. go next`);
    return [];
  }
  return [...dom.querySelectorAll("p.colum-title")].map((e) =>
    (e as Element).innerText.replace(/\(.*/, "")
  );
}

const result: string[] = [];
for (let i = 1; i <= 1; i++) {
  const url = `https://imidas.jp/fourchars.html`;
  const dom = await getDOM(url);
  if (!dom) {
    console.log(`dom parse failed. go next`);
    continue;
  }
  const linkList = [...dom.querySelectorAll("#soundTable ul.mb20 > li > a")]
    .map((e) => (e as Element).getAttribute("href"));
  for (const link of linkList) {
    if (!link) {
      console.log(`link is null. go next`);
      continue;
    }

    const dom2 = await getDOM(`https://imidas.jp/${link}`);
    if (!dom2) {
      console.log(`dom parse failed. go next`);
      continue;
    }
    const titles = await getFromImidas(`https://imidas.jp/${link}`);
    result.push(...titles);

    const pages = [...dom2.querySelectorAll("div.articleList a")].slice(0, -1)
      .map((e) => (e as Element).getAttribute("href")).filter((e) =>
        e !== null
      ) as string[];
    for (const page of pages) {
      const titles = await getFromImidas(`https://imidas.jp/${page}`);
      result.push(...titles);
    }
  }
}

await saveList(result);

console.log("fetch from imidas end");
