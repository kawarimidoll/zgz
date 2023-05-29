import { BskyAgent, loadEnv } from "./deps.ts";

const envOptions = {
  envPath: ".env",
  examplePath: null,
  defaultsPath: null,
  export: false,
};

export async function login() {
  const service = "https://bsky.social";
  const agent = new BskyAgent({ service });
  const {
    BLUESKY_IDENTIFIER: identifier,
    BLUESKY_PASSWORD: password,
  } = await loadEnv(envOptions);

  await agent.login({ identifier, password });
  return agent;
}

export type AgentType = Awaited<ReturnType<typeof login>>;
