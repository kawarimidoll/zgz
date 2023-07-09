import "https://deno.land/std@0.191.0/dotenv/load.ts";

// https://fukuno.jig.jp/3596
export { TinySegmenter } from "https://raw.githubusercontent.com/kawarimidoll/TinySegmenter/patch-1/TinySegmenter.js";

export { partition } from "https://deno.land/std@0.191.0/collections/partition.ts";
export { sample } from "https://deno.land/std@0.191.0/collections/sample.ts";
export { chunk } from "https://deno.land/std@0.191.0/collections/chunk.ts";
export {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.191.0/testing/asserts.ts";
export {
  assertSpyCallArgs,
  assertSpyCalls,
  returnsNext,
  stub,
} from "https://deno.land/std@0.191.0/testing/mock.ts";

import { Log } from "https://deno.land/x/tl_log@0.1.2/mod.ts";
export const log = new Log({ levelIndicator: "initial", color: false });

export { TexTra } from "https://deno.land/x/tex_tra@0.2.0/tex_tra.ts";

export { Seed } from "https://deno.land/x/seed@1.0.0/index.ts";

export * from "./npm_deps.ts";
