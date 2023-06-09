import { exists } from "https://deno.land/std@0.191.0/fs/exists.ts";
import { parse } from "https://deno.land/std@0.191.0/jsonc/parse.ts";

type DenoJson = {
  hooks: Record<string, string>;
  tasks: Record<string, string>;
};
const isDenoJson = (json: unknown): json is DenoJson =>
  typeof json === "object" && !!json && !Array.isArray(json) &&
  Object.hasOwn(json, "hooks");

const filename = await exists("./deno.jsonc")
  ? "deno.jsonc"
  : await exists("./deno.json")
  ? "deno.json"
  : "";

if (!filename) {
  throw new Error("No deno configuration file found");
}

const json = parse(await Deno.readTextFile(filename));

if (!isDenoJson(json)) {
  throw new Error(
    "Deno configuration file must be a valid json file with hooks",
  );
}

const hooks = Object.entries(json.hooks)
  .map((
    [hook, script],
  ) => [
    "add",
    `./.hooks/${hook}`,
    script
    // script.replace(/deno task (\S+)/, (_, name) => json.tasks[name]),
  ]);

hooks.unshift(["install", ".hooks"]);

const cmd = "deno";
const args = [
  "run",
  "--allow-read",
  "--allow-run",
  "--allow-write",
  "https://deno.land/x/deno_hooks/mod.ts",
];
const decoder = new TextDecoder();

await (new Deno.Command("rm", { args: ["-rf", ".hooks"] })).output();

for await (const hook of hooks) {
  console.log(">", hook.join(" "));
  const command = new Deno.Command(
    cmd,
    { args: [...args, ...hook] },
  );

  const { code, stdout, stderr } = await command.output();

  if (code === 0) {
    console.info(decoder.decode(stdout));
  } else {
    console.error(decoder.decode(stderr));
  }
}
