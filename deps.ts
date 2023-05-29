import AtprotoAPI from "npm:@atproto/api";
import type { Facet } from "npm:@atproto/api";

import { load as loadEnv } from "https://deno.land/std@0.183.0/dotenv/mod.ts";

// https://fukuno.jig.jp/3596
import { TinySegmenter } from "https://code4fukui.github.io/TinySegmenter/TinySegmenter.js";

import { partition } from "https://deno.land/std@0.189.0/collections/partition.ts";
import { sample } from "https://deno.land/std@0.189.0/collections/sample.ts";

import { Log } from "https://raw.githubusercontent.com/kawarimidoll/deno-tl-log/main/mod.ts";

const { BskyAgent, RichText, AppBskyFeedPost } = AtprotoAPI;

export {
  AppBskyFeedPost,
  BskyAgent,
  loadEnv,
  Log,
  partition,
  RichText,
  sample,
  TinySegmenter,
};

export type { Facet };
