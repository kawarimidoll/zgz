import { BskyAgent } from "./deps.ts";

const bskyAgent = () => {
  return new BskyAgent({ service: "https://bsky.social" });
};

export type AgentType = ReturnType<typeof bskyAgent>;

// singleton agent
const agent = bskyAgent();

export async function login() {
  if (agent.session) {
    return agent;
  }

  const identifier = Deno.env.get("BLUESKY_IDENTIFIER") || "";
  const password = Deno.env.get("BLUESKY_PASSWORD") || "";

  await agent.login({ identifier, password });
  return agent;
}
