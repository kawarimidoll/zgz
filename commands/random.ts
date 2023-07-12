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

let idiomList: string[] | null = null;
const fourCharacterIdiom = async (seed?: string) => {
  if (idiomList === null) {
    try {
      const url = Deno.env.get("YOJI_JUKUGO_LIST_URL");
      if (!url) {
        throw new Error("YOJI_JUKUGO_LIST_URL is not set");
      }
      const res = await fetch(url);
      const src = await res.text();
      idiomList = src.split("\n").filter((word) => !/^\s*$/.test(word));
    } catch (_e) {
      idiomList = ["取得失敗"];
    }
  }
  return sample(idiomList, seed);
};

const WAHA = "(っ＾ω＾c)";
export const handleRandom = async ({ did, text }: Record<string, string>) => {
  const todayString = new Date().toISOString().split("T")[0];
  const randomSeed = `${todayString}-${did}`;

  if (text.startsWith("random waha")) {
    return [
      `random waha challenge on ${todayString}`,
      "",
      shuffleString(WAHA, randomSeed),
    ].join("\n");
  }

  if (text.startsWith("random yoji")) {
    return [
      `random yoji-jukugo on ${todayString}`,
      "",
      await fourCharacterIdiom(todayString),
    ].join("\n");
  }

  return [
    "return random text that changes every day.",
    "available subcommands:",
    "  waha: random waha challenge",
    "  yoji: random Japanese yoji-jukugo (four-character idiom)",
  ].join("\n");
};
