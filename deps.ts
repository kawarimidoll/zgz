import AtprotoAPI from "npm:@atproto/api";
import type { Facet } from "npm:@atproto/api";

import "https://deno.land/std@0.190.0/dotenv/load.ts";

// https://fukuno.jig.jp/3596
import { TinySegmenter } from "https://code4fukui.github.io/TinySegmenter/TinySegmenter.js";

// https://zenn.dev/kawarimidoll/articles/86342d541b17d7
const segmenter = (text: string) => {
  const segments = TinySegmenter.segment(text);
  const result = [segments[0]];

  // join separated surrogate pairs
  for (const seg of segments.slice(1)) {
    const last = result.at(-1) || "";

    if (/[\ud800-\udbff]$/.test(last) && /^[\udc00-\udfff]/.test(seg)) {
      result.splice(-1, 1, last + seg);
    } else {
      result.push(seg);
    }
  }

  return result;
};

import { partition } from "https://deno.land/std@0.190.0/collections/partition.ts";
import { sample } from "https://deno.land/std@0.190.0/collections/sample.ts";
import { chunk } from "https://deno.land/std@0.190.0/collections/chunk.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";
import {
  assertSpyCallArgs,
  assertSpyCalls,
  returnsNext,
  stub,
} from "https://deno.land/std@0.190.0/testing/mock.ts";

import { Log } from "https://deno.land/x/tl_log@0.1.2/mod.ts";
const log = new Log({ levelIndicator: "initial", color: false });

import { TexTra } from "https://deno.land/x/tex_tra/tex_tra.ts";

const { BskyAgent, RichText, AppBskyFeedPost, AppBskyGraphListitem } =
  AtprotoAPI;

export {
  AppBskyFeedPost,
  AppBskyGraphListitem,
  assertEquals,
  assertExists,
  assertSpyCallArgs,
  assertSpyCalls,
  BskyAgent,
  chunk,
  log,
  partition,
  returnsNext,
  RichText,
  sample,
  segmenter,
  stub,
  TexTra,
};

export type { Facet };
