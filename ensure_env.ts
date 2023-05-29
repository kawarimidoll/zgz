import { loadEnv } from "./deps.ts";

export const ensureEnv = async () => {
  if (Deno.env.get("BLUESKY_IDENTIFIER")) {
    return;
  }
  const envOptions = {
    envPath: ".env",
    examplePath: null,
    defaultsPath: null,
    export: true,
  };
  await loadEnv(envOptions);
};
