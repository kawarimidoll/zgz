import { parse } from "https://deno.land/std/jsonc/parse.ts";
import { mapValues } from "https://deno.land/std/collections/map_values.ts";

const readJsonc = async (filename: string) => {
  try {
    return parse(await Deno.readTextFile(filename));
  } catch (e) {
    console.error(e.message);
  }
};

const json = await readJsonc("./deno.jsonc") || await readJsonc("./deno.json");

if (!json || typeof json !== "object" || Array.isArray(json)) {
  console.error("Valid deno configuration file is required");
  Deno.exit(1);
}

const lintStaged = json["lint-staged"];
if (
  !lintStaged || typeof lintStaged !== "object" || Array.isArray(lintStaged)
) {
  console.log({});
  Deno.exit(0);
}

console.log(mapValues(lintStaged, (value: unknown) => `bash -c '${value}'`));
