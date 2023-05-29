import { assertExists } from "./deps.ts";
import { login } from "./login.ts";

Deno.test("login test", async () => {
  const agent = await login();
  assertExists(agent.session!.did);
});
