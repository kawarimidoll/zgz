import { Seed } from "../deps.ts";

// ref: https://github.com/denoland/deno_std/blob/main/collections/sample.ts
// re-implement to use Seed class
export function sample<T>(array: readonly T[], seed?: string): T | undefined {
  const random = new Seed(seed || `${Math.random()}`);
  const length = array.length;
  return length ? array[random.randomInt(0, length - 1)] : undefined;
}

// ref: https://deno.land/x/shuffle/mod.ts;
// re-implement to use Seed class
export function shuffle<T>(arr: readonly T[], seed?: string): T[] {
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

export const handleRandom = ({ did, text }: Record<string, string>) => {
  const todayString = new Date().toISOString().split("T")[0];
  const randomSeed = `${todayString}-${did}`;

  if (text.startsWith("random waha")) {
    return [
      `random waha challenge on ${todayString}`,
      "",
      shuffleString(WAHA, randomSeed),
    ].join("\n");
  }

  return [
    "return random text that changes every day.",
    "available subcommands:",
    "  waha: random waha challenge",
  ].join("\n");
};
