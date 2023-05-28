import { partition, sample, TinySegmenter } from "./deps.ts";

// ref: https://qiita.com/cotton392/items/6e8288616a19669d0e4c

const parseToNodes = (text: string) => {
  return text
    .split("\n")
    .reduce(
      (acc, line) =>
        /^\s*$/.test(line) ? acc : [...acc, TinySegmenter.segment(line)],
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
  return joinedBlocks.flat(1).slice(0, -1).join("");
};

export const markovChainGenerate = (text: string, wordCount = 3) => {
  const nodes = parseToNodes(text);
  const blocks = nodes.map((nodes) => parseToBlocks(nodes, wordCount)).flat(1);
  return joinBlocks(blocks);
};
