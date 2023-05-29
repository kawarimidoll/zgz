import { Facet, RichText } from "./deps.ts";
import { AgentType, login } from "./login.ts";

export const textPost = async (agent: AgentType, text: string) => {
  return await agent.post({ $type: "app.bsky.feed.post", text });
};

export const richPost = async (
  agent: AgentType,
  text: string,
  facets: Facet[] = [],
) => {
  const rt = new RichText({ text, facets });
  // automatically detects mentions and links
  await rt.detectFacets(agent);
  return await agent.post({
    $type: "app.bsky.feed.post",
    text: rt.text,
    facets: [...(rt?.facets || []), ...facets],
  });
};

const convertMdLink = (src: string) => {
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
  const facets = [];
  let cnt = 0;
  while (true) {
    const links = src.match(mdLinkRegex);
    if (!links) {
      return { text: src, facets };
    }
    if (cnt++ > 50) {
      throw "too many loops";
    }
    const [matched, anchor, uri] = links;
    src = src.replace(matched, anchor);

    const byteStart =
      (new TextEncoder()).encode(src.substring(0, links.index)).byteLength;
    const byteEnd = byteStart + (new TextEncoder()).encode(anchor).byteLength;

    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: "app.bsky.richtext.facet#link", uri }],
    });
  }
};

export const mdLinkPost = async (agent: AgentType, src: string) => {
  const { text, facets } = convertMdLink(src);
  return await richPost(agent, text, facets);
};
// const { text, facets } = convertMdLink(
//   `link test
//
// https://atproto.com/lexicons/com-atproto-moderation#comatprotomoderationdefs
//
// [lexicon](https://atproto.com/guides/lexicon)`,
// );

if (import.meta.main) {
  if (Deno.args.length === 0) {
    // no args
    console.log("pass some args to post.");
    Deno.exit(1);
  }

  const agent = await login();
  if (Deno.args[0] === "--raw") {
    // raw text post
    console.log(await textPost(agent, Deno.args.slice(1).join(" ")));
  } else {
    // rich text post
    console.log(await mdLinkPost(agent, Deno.args.join(" ")));
  }
}