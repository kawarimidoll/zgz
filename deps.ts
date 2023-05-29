import AtprotoAPI from "npm:@atproto/api";
import type { Facet } from "npm:@atproto/api";

import { load as loadEnv } from "https://deno.land/std@0.189.0/dotenv/mod.ts";

// https://fukuno.jig.jp/3596
import { TinySegmenter } from "https://code4fukui.github.io/TinySegmenter/TinySegmenter.js";

import { partition } from "https://deno.land/std@0.189.0/collections/partition.ts";
import { sample } from "https://deno.land/std@0.189.0/collections/sample.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.189.0/testing/asserts.ts";
import {
  assertSpyCallArgs,
  assertSpyCalls,
  stub,
} from "https://deno.land/std@0.189.0/testing/mock.ts";

import { Log } from "https://deno.land/x/tl_log@0.1.2/mod.ts";

const { BskyAgent, RichText, AppBskyFeedPost } = AtprotoAPI;

export {
  AppBskyFeedPost,
  assertEquals,
  assertExists,
  assertSpyCallArgs,
  assertSpyCalls,
  BskyAgent,
  loadEnv,
  Log,
  partition,
  RichText,
  sample,
  stub,
  TinySegmenter,
};

export type { Facet };
