// Usage:
// 1. Create a deno.json(c) file in the root of your project
// 2. Add a "hooks" key with a map of hooks to scripts
// 3. Run `deno run --allow-read --allow-run ./setup-deno-hooks.ts`

// Thank you for https://github.com/Yakiyo/deno_hooks

import { exists } from "https://deno.land/std/fs/exists.ts";
import { parse } from "https://deno.land/std/jsonc/parse.ts";
import { join } from "https://deno.land/std/path/mod.ts";

const HOOKS_DIR = ".hooks";
const KNOWN_HOOKS = [
  "applypatch-msg",
  "commit-msg",
  "post-applypatch",
  "post-checkout",
  "post-commit",
  "post-merge",
  "post-rewrite",
  "post-update",
  "pre-applypatch",
  "pre-commit",
  "pre-merge-commit",
  "pre-push",
  "pre-rebase",
  "prepare-commit-msg",
  "push-to-checkout",
];

// type guard
type DenoJson = {
  hooks: Record<string, string>;
  [key: string]: unknown;
};
const isDenoJson = (json: unknown): json is DenoJson =>
  !!json && typeof json === "object" && Object.hasOwn(json, "hooks");

// load deno.json(c)
const filename = await exists("./deno.jsonc")
  ? "deno.jsonc"
  : await exists("./deno.json")
  ? "deno.json"
  : "";
if (!filename) {
  throw new Error("No deno configuration file found");
}

// parse deno.json(c)
const json = parse(await Deno.readTextFile(filename));
if (!isDenoJson(json)) {
  throw new Error(`'${filename}' must be a valid json file with 'hooks' key`);
}

// convert hooks to array of commands
const hooks = Object.entries(json.hooks)
  .filter(([hook]) => KNOWN_HOOKS.includes(hook))
  .map(([hook, script]) => ["add", join(HOOKS_DIR, hook), script]);
hooks.unshift(["install", HOOKS_DIR]);

// remove .hooks directory (for idempotency)
await (new Deno.Command("rm", { args: ["-rf", HOOKS_DIR] })).output();

// define deno command variables
const cmd = "deno";
const baseArgs = [
  "run",
  "--allow-read",
  "--allow-run",
  "--allow-write",
  "https://deno.land/x/deno_hooks/mod.ts",
];
const decoder = new TextDecoder();

// setup hooks
for await (const hook of hooks) {
  console.log(">", hook.join(" "));
  const command = new Deno.Command(cmd, { args: [...baseArgs, ...hook] });

  const { code, stdout, stderr } = await command.output();

  if (code === 0) {
    console.info(decoder.decode(stdout));
  } else {
    console.error(decoder.decode(stderr));
  }
}
