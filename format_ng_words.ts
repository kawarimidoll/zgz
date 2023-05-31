import { katakanaToHiragana } from "./string_utils.ts";

function uniq(array: string[]) {
  return [...new Set(array)];
}

const filename = "./ng_word_list.txt";
const wordList = Deno.readTextFileSync(filename).split("\n").filter(
  (word) => !/^\s*$/.test(word),
).map((word) => katakanaToHiragana(word)).sort();

Deno.writeTextFileSync(filename, uniq(wordList).join("\n"));
