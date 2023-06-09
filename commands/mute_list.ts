import { AppBskyGraphListitem, partition } from "../deps.ts";
import { login } from "../login.ts";

const agent = await login();

const getLists = async () => {
  const { data } = await agent.app.bsky.graph.getLists({
    actor: agent.session!.did,
  });
  return data.lists.map((list) => ({
    name: list.name,
    uri: list.uri,
    description: list.description,
  }));
};

const getProfile = async (
  handleOrDid: string,
) => {
  const actor = handleOrDid.replace(/^@/, "");
  const { data } = await agent.getProfile({ actor });
  return data;
};

const doAddMuteList = async (
  listUri: string,
  handleOrDid: string,
) => {
  const { did: subject, handle } = await getProfile(handleOrDid);
  const collection = "app.bsky.graph.listitem";
  const createdAt = new Date().toISOString();
  const { data } = await agent.com.atproto.repo.createRecord({
    collection,
    repo: agent.session!.did,
    record: { $type: collection, list: listUri, subject, createdAt },
  });
  return { handle, ...data };
};
export const addMuteList = async (
  listName: string,
  handleOrDidList: string[],
) => {
  if (handleOrDidList.length === 0) {
    return "target did or handle is required. e.g. list add bots zgz.bsky.social";
  }
  const agentLists = await getLists();
  const list = agentLists.find(({ name }) =>
    name.toLowerCase().startsWith(listName.toLowerCase())
  );
  if (!list) {
    return [
      `invalid list name: ${listName}`,
      `available lists: ${agentLists.map(({ name }) => name).join(", ")}`,
    ].join("\n");
  }
  const results = await Promise.all(
    handleOrDidList.map((target) => doAddMuteList(list.uri, target)),
  );
  const [added, failed] = partition(results, (result) => !!result.uri);
  return [
    `list: ${list.name}`,
    `added: ${added.map(({ handle }) => handle).join(",") || "none"}`,
    `failed: ${failed.map(({ handle }) => handle).join(",") || "none"}`,
  ].join("\n");
};

const doRemoveMuteList = async (
  handleOrDid: string,
) => {
  const { did: targetDid, handle } = await getProfile(handleOrDid);
  const repo = agent.session!.did;
  const collection = "app.bsky.graph.listitem";
  let { data: { records, cursor } } = await agent.com.atproto.repo
    .listRecords({ collection, repo, limit: 100 });

  let target = undefined;
  let i = 0;
  while (true) {
    i++;
    if (records.length === 0) {
      return {
        handle,
        success: false,
        reason: `${handle} could not be found in list`,
      };
    }
    if (i > 100) {
      return { handle, success: false, reason: "too many loop" };
    }

    target = records.find((record) =>
      AppBskyGraphListitem.isRecord(record.value) &&
      record.value.subject === targetDid
    );
    if (target) {
      break;
    }

    const { data } = await agent.com.atproto.repo
      .listRecords({ collection, repo, limit: 100, cursor });
    records = data.records;
    cursor = data.cursor;
  }

  const { success } = await agent.com.atproto.repo.deleteRecord({
    collection,
    repo,
    rkey: target.uri.split("/").at(-1) || "",
  });
  return { handle, success, reason: success ? "" : "something went wrong" };
};

export const removeMuteList = async (
  handleOrDidList: string[],
) => {
  if (handleOrDidList.length === 0) {
    return "target did or handle is required. e.g. list remove zgz.bsky.social";
  }

  const results = await Promise.all(
    handleOrDidList.map((target) => doRemoveMuteList(target)),
  );

  const [removed, failed] = partition(results, (result) => result.success);
  return [
    `removed: ${removed.map(({ handle }) => handle).join(",") || "none"}`,
    `failed: ${failed.map(({ handle }) => handle).join(",") || "none"}`,
  ].join("\n");
};
