import { RichText } from "./deps.ts";
import type { Facet } from "./deps.ts";
import { login } from "./login.ts";

export const richPost = async (text: string, facets: Facet[] = []) => {
  const agent = await login();
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

export const mdLinkPost = async (src: string) => {
  const { text, facets } = convertMdLink(src);
  return await richPost(text, facets);
};
// const { text, facets } = convertMdLink(
//   `link test
//
// https://atproto.com/lexicons/com-atproto-moderation#comatprotomoderationdefs
//
// [lexicon](https://atproto.com/guides/lexicon)`,
// );

if (import.meta.main) {
  if (Deno.args.length > 0) {
    // console.log(await mdLinkPost(Deno.args.join(" ")));
    console.log("post: " + Deno.args.join(" "));
  } else {
    console.log("pass some args to post.");
  }
}
