import { AppBskyFeedPost, TexTra } from "../deps.ts";
import { ensureEnv } from "../ensure_env.ts";
import { AgentType } from "../login.ts";

let texTra: TexTra | undefined = undefined;

const getRepoAndRkey = (targetUri: string) => {
  // at://did:plc:repo/app.bsky.feed.post/rkey
  const [repo, rkey] = targetUri
    .replace("at://", "")
    .replace("/app.bsky.feed.post", "")
    .split("/");
  return { repo, rkey };
};

export const translate = async (
  agent: AgentType,
  targetUri: string,
  langTo: string,
) => {
  const { repo, rkey } = getRepoAndRkey(targetUri);
  if (!repo || !rkey) {
    return "invalid target uri";
  }

  const post = await agent.getPost({ repo, rkey });
  if (!AppBskyFeedPost.isRecord(post.value)) {
    return "invalid post value";
  }
  const src = post.value.text;

  if (!texTra) {
    await ensureEnv();
    const name = Deno.env.get("TEX_TRA_NAME") || "";
    const key = Deno.env.get("TEX_TRA_API_KEY") || "";
    const secret = Deno.env.get("TEX_TRA_API_SECRET") || "";
    texTra = new TexTra({ name, key, secret });
  }
  const detected = await texTra.langDetect(src);
  if (detected.code > 0) {
    return "failed to detect source language";
  }

  const langFrom = detected.result?.langdetect["1"].lang;

  const { result } = await texTra.listAcquisition("mt_standard", {
    lang_s: langFrom,
  });
  const langToList = (result?.list ?? []).filter((item) =>
    `${item.id}`.startsWith("generalNT")
  ).map((item) => item.lang_t);
  if (!langToList.includes(langTo)) {
    return [
      `invalid target language: ${langTo}`,
      `available languages: ${langToList.join(", ")}`,
    ].join("\n");
  }

  const langId = `generalNT_${langFrom}_${langTo}`;
  const translated = await texTra.translate(src, "mt", langId);

  return translated.result?.text || "failed to translate";
};
