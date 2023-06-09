import AtprotoAPI from "npm:@atproto/api";
import type { Facet } from "npm:@atproto/api";

import "https://deno.land/std@0.190.0/dotenv/load.ts";

// https://fukuno.jig.jp/3596
import { TinySegmenter } from "https://raw.githubusercontent.com/kawarimidoll/TinySegmenter/patch-1/TinySegmenter.js";

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
  stub,
  TexTra,
  TinySegmenter,
};

export type { Facet };
