import { TinySegmenter } from "./deps.ts";

const jpProperty = "\\p{sc=Hiragana}\\p{sc=Katakana}\\p{sc=Han}ー";
const jpClass = `[${jpProperty}]`;
const nonJpClass = `[^${jpProperty}]`;
const jpRegex = new RegExp(jpClass, "u");
const seqRegex1 = new RegExp(`(${nonJpClass})(${jpClass})`, "ug");
const seqRegex2 = new RegExp(`(${jpClass})(${nonJpClass})`, "ug");

export const segmenter = (text: string) => {
  return text
    .replace(seqRegex1, "$1 $2")
    .replace(seqRegex2, "$1 $2")
    .split(/[\s\n]/)
    .reduce((acc, cur) => {
      if (/^\s*$/.test(cur)) return acc;
      if (jpRegex.test(cur)) {
        return [...acc, ...TinySegmenter.segment(cur)];
      }
      return [...acc, cur];
    }, [] as string[]);
};
