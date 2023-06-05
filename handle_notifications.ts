import { AppBskyFeedPost, log } from "./deps.ts";
import { login } from "./login.ts";
import { richPost } from "./post.ts";
import { handleXrpc } from "./commands/xrpc.ts";

const agent = await login();

const executeCommand = async (
  {
    uri: _uri,
    cid: _cid,
    did,
    handle,
    displayName: _displayName,
    text,
  }: Record<string, string>,
) => {
  if (text.startsWith("echo")) {
    log.info("cmd: echo");
    return { plain: true, text: text.replace(/^\s*\/echo\s+/, "") };
  }
  if (text.startsWith("xrpc")) {
    return { plain: true, text: handleXrpc({ handle, did, text }) };
  }
  if (text.startsWith("followme")) {
    log.info("cmd: followme");
    const profile = await agent.getProfile({ actor: did });
    const followUri = profile.data.viewer?.following;
    if (followUri) {
      return { plain: true, text: "I'm already following you :)" };
    }
    await agent.follow(did);
    return {
      plain: false,
      text: ["followed ✅", `nice to meet you, @${handle}`].join("\n"),
    };
  }
  if (text.startsWith("unfollowme")) {
    log.info("cmd: unfollowme");
    const profile = await agent.getProfile({ actor: did });
    const followUri = profile.data.viewer?.following;
    if (!followUri) {
      return { plain: true, text: "I'm not following you :)" };
    }
    await agent.deleteFollow(followUri);
    return {
      plain: false,
      text: ["unfollowed ✅", `hope to see you again, @${handle}`].join("\n"),
    };
  }
  const helpText = [
    "available commands:",
    "echo <text> - echo <text> back",
    "xrpc <subcommand> - return xrpc url",
    "followme - follow you",
    "unfollowme - unfollow you",
    "help - show this help",
  ].join("\n");
  if (text.startsWith("help")) {
    log.info("cmd: help");
    return { plain: true, text: helpText };
  }
  log.info("cmd: unknown");
  return {
    plain: true,
    text: ["undefined command!", "", helpText].join("\n"),
  };
};

const handlePost = async ({
  uri,
  cid,
  did,
  handle,
  displayName,
  text,
  rootUri,
  rootCid,
}: Record<string, string>) => {
  log.info(`mention(@${handle}): ${text}`);

  const response = await executeCommand({
    uri,
    cid,
    did,
    handle,
    displayName: displayName ?? handle,
    text,
  });

  await richPost(agent, response.text, {
    plain: response.plain,
    reply: { root: { uri: rootUri, cid: rootCid }, parent: { uri, cid } },
  });
};

// log.info("start handle_notifications");

const seenAt = new Date().toISOString();
// currently seenAt parameter is unsupported for countUnreadNotifications / listNotifications

const { data: { count } } = await agent.countUnreadNotifications();
const limit = Math.min(count, 100);
if (limit < 1) {
  // log.info("no notification");
  Deno.exit(0);
}

// log.info(`${limit} notifications to fetch`);

// const { data: { notifications, cursor } } = await agent.app.bsky.notification.listNotifications({ limit });
const { data: { notifications } } = await agent.listNotifications({ limit });

// reason is one of "like", "repost", "follow", "mention", "reply", "quote"
const mentions = notifications.filter((item) =>
  !item.isRead && item.reason === "mention"
);

// log.info(`${mentions.length} notifications to process`);

for await (const mention of mentions) {
  const { uri, cid, author: { did, handle, displayName }, record } = mention;

  // type validation
  if (!AppBskyFeedPost.isRecord(record)) {
    continue;
  }
  const text = record.text.replaceAll("@" + agent.session!.handle, "").trim();
  const { cid: rootCid, uri: rootUri } = record.reply?.root || { cid, uri };
  handlePost({
    uri,
    cid,
    did,
    handle,
    displayName: displayName ?? handle,
    text,
    rootCid,
    rootUri,
  });
}

await agent.updateSeenNotifications(seenAt);
// log.info("finish handle_notifications");
