import AtprotoAPI from "npm:@atproto/api";
import type { Facet } from "npm:@atproto/api";

import { load as loadEnv } from "https://deno.land/std@0.183.0/dotenv/mod.ts";

const { BskyAgent, RichText, AppBskyFeedPost } = AtprotoAPI;

export {
  AppBskyFeedPost,
  BskyAgent,
  loadEnv,
  RichText,
};

export type { Facet };
