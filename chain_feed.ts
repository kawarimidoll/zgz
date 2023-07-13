import { AppBskyFeedPost } from "./deps.ts";
import { markovChainGenerate } from "./markov_chain.ts";
import { login } from "./login.ts";

const JP_FEED =
  "at://did:plc:kwibnjihi6sfdphwfzlogfwi/app.bsky.feed.generator/jp-cluster";

const agent = await login();

const getFeed = async (
  params: { feed: string; limit?: number; cursor?: string },
) => {
  const { data } = await agent.api.app.bsky.feed.getFeed(params);
  return data;
};

export const chainFeed = async (feedUrl = JP_FEED) => {
  const limit = 100;

  // get feed 5 times
  let cursor: string | undefined = undefined;
  const feed = [];
  for (let i = 0; i < 5; i++) {
    const { feed: feedTmp, cursor: cursorTmp } = await getFeed({
      feed: feedUrl,
      limit,
      cursor,
    });
    feed.push(...feedTmp);
    cursor = cursorTmp;
  }
  // console.log(feed.length)

  const joinedPosts = feed
    .filter(({ post, reply }) =>
      !reply && AppBskyFeedPost.isRecord(post.record) && !post.record.facets &&
      !post.record.embed
    )
    .map(({ post }) =>
      AppBskyFeedPost.isRecord(post.record)
        ? post.record.text.replace(/https?:\/\/[^\s\r\n]+/g, "")
        : ""
    ).join("\n");

  // console.log(joinedPosts);

  return await markovChainGenerate(joinedPosts);
};

if (import.meta.main) {
  console.log(await chainFeed(Deno.args[0]));
}
