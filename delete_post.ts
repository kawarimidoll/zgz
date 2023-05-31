import { login } from "./login.ts";

const agent = await login();
// const url = "";
const url = Deno.args[0];

const repo = url.match(/profile\/([^\/]+)/)?.at(1);
const rkey = url.match(/post\/(\w+)/)?.at(1);

if (repo && rkey) {
  const post = await agent.getPost({ repo, rkey });
  console.log({ repo, rkey, post });
  await agent.deletePost(post.uri);
} else {
  console.log("failed");
}
