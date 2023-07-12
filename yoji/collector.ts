import { DOMParser } from "../deps.ts";

export async function getDOM(url: string) {
  console.log(`fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  const html = await res.text();
  return new DOMParser().parseFromString(html, "text/html");
}

export async function saveList(list: string[]) {
  return await Deno.writeTextFile("yoji.txt", list.join("\n"), {
    append: true,
  });
}
