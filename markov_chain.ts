import { partition, sample } from "./deps.ts";
import { segmenter } from "./segmenter.ts";
import { hirakataRegexp, smartJoin } from "./string_utils.ts";

let fuzzyNgWordList: RegExp[] | null = null;
let exactNgWordList: string[] | null = null;

export const setNgLists = async () => {
  if (fuzzyNgWordList === null) {
    try {
      const url = Deno.env.get("FUZZY_NG_WORD_LIST_URL");
      if (!url) {
        throw new Error("FUZZY_NG_WORD_LIST_URL is not set");
      }
      const res = await fetch(url);
      const src = await res.text();
      fuzzyNgWordList = src.split("\n").filter((word) => !/^\s*$/.test(word))
        .map((word) => hirakataRegexp(word));
    } catch (_e) {
      fuzzyNgWordList = [];
    }
  }
  if (exactNgWordList === null) {
    try {
      const url = Deno.env.get("EXACT_NG_WORD_LIST_URL");
      if (!url) {
        throw new Error("EXACT_NG_WORD_LIST_URL is not set");
      }
      const res = await fetch(url);
      const src = await res.text();
      exactNgWordList = src.split("\n").filter((word) => !/^\s*$/.test(word));
    } catch (_e) {
      exactNgWordList = [];
    }
  }
};

// check the text has any NG words
export const isNgText = (text: string) => {
  // check the text contains any NG words
  if (fuzzyNgWordList !== null) {
    for (const word of fuzzyNgWordList) {
      if (word.test(text)) {
        return true;
      }
    }
  }

  if (exactNgWordList !== null) {
    for (const word of exactNgWordList) {
      if (text.includes(word)) {
        return true;
      }
    }
  }

  return false;
};

// ref: https://qiita.com/cotton392/items/6e8288616a19669d0e4c

export const parseToNodes = (text: string) => {
  return text
    .split("\n")
    .reduce(
      (acc, line) =>
        /^\s*$/.test(line) || isNgText(line) ? acc : [
          ...acc,
          segmenter(line).filter((node) => !/^[\s　]*$|\./.test(node)),
        ],
      [] as string[][],
    );
};

const BOS = "__BOS__"; // begin of sentence
const EOS = "__EOS__"; // end of sentence

const parseToBlocks = (nodes: string[], wordCount = 3) => {
  if (nodes.length === wordCount - 2) {
    return [[BOS, ...nodes, EOS]];
  } else if (nodes.length === wordCount - 1) {
    return [[BOS, ...nodes], [...nodes, EOS]];
  }
  const blocks: string[][] = [];

  blocks.push([BOS, ...nodes.slice(0, wordCount - 1)]);
  for (let i = 0; i < nodes.length - wordCount + 1; i++) {
    blocks.push(nodes.slice(i, i + wordCount));
  }
  blocks.push([
    ...nodes.slice(nodes.length - wordCount + 1, nodes.length),
    EOS,
  ]);
  return blocks;
};

const joinBlocks = (blocks: string[][]) => {
  const [startBlocks, restBlocks] = partition(
    blocks,
    (block) => block[0] === BOS,
  );

  let stopCount = 0;

  const startBlock = sample(startBlocks) ?? [""];

  // slice to remove BOS
  const joinedBlocks: string[][] = [startBlock.slice(1)];

  while (stopCount < 100) {
    const key = joinedBlocks.at(-1)!.at(-1)!;
    const nextBlock = sample(restBlocks.filter((block) => block[0] === key));
    if (!nextBlock) {
      break;
    }

    joinedBlocks.push(nextBlock.slice(1));
    if (nextBlock.at(-1) === EOS) {
      break;
    }

    // to avoid infinite loop
    stopCount++;
  }

  // slice to remove EOS
  return smartJoin(joinedBlocks.flat(1).slice(0, -1));
};

export const markovChainGenerate = async (text: string, wordCount = 3) => {
  await setNgLists();
  const nodes = parseToNodes(text);
  const blocks = nodes.map((nodes) => parseToBlocks(nodes, wordCount)).flat(1);
  return joinBlocks(blocks);
};
