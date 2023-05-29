import { ensureEnv } from "./ensure_env.ts";

export const notifyIfttt = async (
  { content, title, url }: { content: string; title?: string; url?: string },
) => {
  await ensureEnv();

  const endpoint = Deno.env.get("IFTTT_NOTIFY_URL") || "";

  return await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value1: content, value2: title, value3: url }),
  });
};
