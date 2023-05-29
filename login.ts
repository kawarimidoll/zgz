import { BskyAgent } from "./deps.ts";
import { ensureEnv } from "./ensure_env.ts";

export async function login() {
  const service = "https://bsky.social";
  const agent = new BskyAgent({ service });

  await ensureEnv();
  const identifier = Deno.env.get("BLUESKY_IDENTIFIER") || "";
  const password = Deno.env.get("BLUESKY_PASSWORD") || "";

  await agent.login({ identifier, password });
  return agent;
}

export type AgentType = Awaited<ReturnType<typeof login>>;
