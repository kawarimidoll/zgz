const xrpcRecordsURL = (repo: string, record: string) =>
  `https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=${repo}&collection=app.bsky.${record}&limit=100`;
const xrpcSyncURL = (did: string, path: string) =>
  `https://bsky.social/xrpc/com.atproto.sync.${path}?did=${did}`;

export const handleXrpc = ({ handle, did, text }: Record<string, string>) => {
  if (text.startsWith("xrpc did")) {
    return [
      did,
      `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`,
    ].join("\n");
  }
  if (text.startsWith("xrpc repo")) {
    return `https://bsky.social/xrpc/com.atproto.repo.describeRepo?repo=${did}`;
  }
  if (text.startsWith("xrpc post")) {
    return xrpcRecordsURL(handle, "feed.post");
  }
  if (text.startsWith("xrpc repost")) {
    return xrpcRecordsURL(handle, "feed.repost");
  }
  if (text.startsWith("xrpc block")) {
    return xrpcRecordsURL(handle, "graph.block");
  }
  if (text.startsWith("xrpc follow")) {
    return xrpcRecordsURL(handle, "graph.follow");
  }
  if (text.startsWith("xrpc list")) {
    return xrpcRecordsURL(handle, "graph.list");
  }
  if (text.startsWith("xrpc profile")) {
    return xrpcRecordsURL(handle, "actor.profile");
  }
  if (text.startsWith("xrpc commit")) {
    return xrpcSyncURL(did, "getCommitPath");
  }
  if (text.startsWith("xrpc head")) {
    return xrpcSyncURL(did, "getHead");
  }
  if (text.startsWith("xrpc blob")) {
    return xrpcSyncURL(did, "listBlobs");
  }
  return [
    "available subcommands:",
    "did, repo, post, repost, block, follow, profile, list, commit, head, blob",
  ].join("\n");
};
