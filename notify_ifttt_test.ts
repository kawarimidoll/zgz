import { notifyIfttt } from "./notify_ifttt.ts";
import { assertSpyCallArgs, assertSpyCalls, stub } from "./deps.ts";

Deno.test("notifyIfttt()", async () => {
  const mockFetchResponse = "__MOCK_FETCH_RESPONSE__";
  const fetchStub = stub(
    globalThis,
    "fetch",
    () => Promise.resolve(new Response(mockFetchResponse)),
  );

  const mockEndpoint = "__MOCK_ENDPOINT__";
  const fetchEnvGet = stub(
    Deno.env,
    "get",
    () => mockEndpoint,
  );

  try {
    await notifyIfttt({ title: "notify", content: "hello" });

    // assert fetch arguments
    assertSpyCallArgs(fetchStub, 0, [mockEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"value1":"hello","value2":"notify"}',
    }]);

    // assert fetch called once
    assertSpyCalls(fetchStub, 1);
  } finally {
    // restore stubs
    fetchStub.restore();
    fetchEnvGet.restore();
  }
});
