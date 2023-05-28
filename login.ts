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
    ZGZ_BLUESKY_IDENTIFIER: identifier,
    ZGZ_BLUESKY_PASSWORD: password,
  } = await loadEnv(envOptions);

  await agent.login({ identifier, password });
  return agent;
}

export type AgentType = Awaited<ReturnType<typeof login>>;
