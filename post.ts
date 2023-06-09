import { chunk, Facet, RichText } from "./deps.ts";
import { login } from "./login.ts";
type ReplyRef = {
  root: { cid: string; uri: string };
  parent: { cid: string; uri: string };
};

const agent = await login();

const doRichPost = async (
  text: string,
  opts: { plain?: boolean; facets?: Facet[]; reply?: ReplyRef } = {},
) => {
  const rt = new RichText({ text, facets: opts.facets || [] });
  if (!opts.plain) {
    // automatically detects mentions and links
    await rt.detectFacets(agent);
  }

  // opts.facets is used if exists (overwrites detected facets)
  const facets = [...(rt.facets || []), ...(opts.facets || [])];
  return await agent.post({
    $type: "app.bsky.feed.post",
    text: rt.text,
    facets,
    reply: opts.reply,
  });
};

export const richPost = async (
  text: string,
  opts: { plain?: boolean; facets?: Facet[]; reply?: ReplyRef } = {},
) => {
  if ([...text].length <= 300) {
    return await doRichPost(text, opts);
  }
  const threadMarker = "[🧵]";
  const chunks = chunk([...text], 297).map((c) => c.join(""));

  const first = await doRichPost(chunks[0] + threadMarker, opts);
  const reply = { root: opts.reply?.root || first, parent: first };
  for (const chunk of chunks.slice(1, -1)) {
    const parent = await doRichPost(chunk + threadMarker, {
      ...opts,
      reply,
    });
    reply.parent = parent;
  }
  await doRichPost(chunks.at(-1)!, { ...opts, reply });
  return first;
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
  return await richPost(text, { facets });
};

if (import.meta.main) {
  if (Deno.args.length === 0) {
    // no args
    console.log("pass some args to post.");
    Deno.exit(1);
  }

  if (Deno.args[0] === "--raw") {
    // raw text post
    console.log(
      await richPost(Deno.args.slice(1).join(" "), { plain: true }),
    );
  } else {
    // rich text post
    console.log(await mdLinkPost(Deno.args.join(" ")));
  }
}
