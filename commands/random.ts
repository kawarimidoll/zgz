import { Seed } from "../deps.ts";

// ref: https://deno.land/x/shuffle/mod.ts;
// re-implement to use Seed class
function shuffle<T>(arr: readonly T[], seed?: string): T[] {
  const length = arr.length;
  const result = [...arr];

  const random = new Seed(seed || `${Math.random()}`);

  for (let i = 0; i <= length - 2; i++) {
    const rand = i + random.randomInt(0, length - i);
    [result[rand], result[i]] = [result[i], result[rand]];
  }

  return result;
}

function shuffleString(str: string, seed?: string) {
  return shuffle(str.split(""), seed).join("");
}

const WAHA = "(っ＾ω＾c)";
const waha = (did: string) => {
  const todayString = new Date().toISOString().split("T")[0];
  const randomSeed = `${todayString}-${did}`;
  return [
    `random waha challenge on ${todayString}!`,
    "",
    shuffleString(WAHA, randomSeed),
  ].join("\n");
};

export const handleRandom = ({ did, text }: Record<string, string>) => {
  if (text.startsWith("random waha")) {
    return waha(did);
  }

  return [
    "return random text that changes every.",
    "available subcommands:",
    "waha",
  ].join("\n");
};
