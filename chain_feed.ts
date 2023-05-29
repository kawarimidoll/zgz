import { AppBskyFeedPost } from "./deps.ts";
import { markovChainGenerate } from "./markov_chain.ts";
import { login } from "./login.ts";

const JP_FEED =
  "at://did:plc:q6gjnaw2blty4crticxkmujt/app.bsky.feed.generator/cl-japanese";

export const chainFeed = async (feedUrl = JP_FEED) => {
  const agent = await login();

  const limit = 100;
  const { data: { feed } } = await agent.api.app.bsky.feed.getFeed({
    feed: feedUrl,
    limit,
  });

  const joinedPosts = feed
    .filter(({ post, reply }) =>
      !reply && AppBskyFeedPost.isRecord(post.record) && !post.record.facets
    )
    .map(({ post }) =>
      AppBskyFeedPost.isRecord(post.record)
        ? post.record.text.replace(/https?:\/\/[^\s\r\n]+/g, "")
        : ""
    ).join("\n");

  // console.log(joinedPosts);

  return markovChainGenerate(joinedPosts);
};

if (import.meta.main) {
  console.log(await chainFeed(Deno.args[0]));
}
