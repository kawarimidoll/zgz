import { katakanaToHiragana } from "../string_utils.ts";

function uniq(array: string[]) {
  return [...new Set(array)];
}

const cwd = Deno.cwd().split("/").at(-1) || "";
const dir = `./${cwd === "zgz" ? "ng_word_list/" : ""}`;
const exactFile = `${dir}exact.txt`;
const exactWordList = Deno.readTextFileSync(exactFile)
  .split("\n")
  .filter((word) => !/^\s*$/.test(word));

const fuzzyFile = `${dir}fuzzy.txt`;
const fuzzyWordList = Deno.readTextFileSync(fuzzyFile)
  .split("\n")
  .filter((word) => !/^\s*$/.test(word) && !exactWordList.includes(word))
  .map((word) => katakanaToHiragana(word))
  .sort();

Deno.writeTextFileSync(fuzzyFile, uniq(fuzzyWordList).join("\n"));
console.log("done.");
