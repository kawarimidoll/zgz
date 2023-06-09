import {
  assertSpyCallArgs,
  assertSpyCalls,
  returnsNext,
  stub,
} from "./deps.ts";
import { login } from "./login.ts";
import { mdLinkPost, richPost } from "./post.ts";

const agent = await login();

Deno.test("normal", async () => {
  const postStub = stub(
    agent,
    "post",
    () => Promise.resolve({ uri: "uri", cid: "cid" }),
  );

  try {
    await richPost("test hello world");

    // assert post arguments
    assertSpyCallArgs(postStub, 0, [{
      $type: "app.bsky.feed.post",
      text: "test hello world",
      facets: [],
      reply: undefined,
    }]);

    // assert post called once
    assertSpyCalls(postStub, 1);
  } finally {
    // restore stubs
    postStub.restore();
  }
});

Deno.test("thread", async () => {
  const postStub = stub(
    agent,
    "post",
    returnsNext([
      Promise.resolve({ uri: "uri1", cid: "cid1" }),
      Promise.resolve({ uri: "uri2", cid: "cid2" }),
    ]),
  );

  const text = "test ようこそ bsky.".repeat(21);
  const splitText = [...text];
  const first = splitText.slice(0, 297).join("") + "[🧵]";
  const rest = splitText.slice(297).join("");

  try {
    await richPost(text);

    // assert post arguments
    assertSpyCallArgs(postStub, 0, [{
      $type: "app.bsky.feed.post",
      text: first,
      facets: [],
      reply: undefined,
    }]);
    assertSpyCallArgs(postStub, 1, [{
      $type: "app.bsky.feed.post",
      text: rest,
      facets: [],
      reply: {
        root: { uri: "uri1", cid: "cid1" },
        parent: { uri: "uri1", cid: "cid1" },
      },
    }]);

    // assert post called 2 times
    assertSpyCalls(postStub, 2);
  } finally {
    // restore stubs
    postStub.restore();
  }
});

Deno.test("mdLinkPost", async () => {
  const text = [
    "link test",
    "",
    "[プロフィール](https://bsky.app/profile/zgz.bsky.social)",
    "",
    "https://atproto.com/guides/lexicon",
  ].join("\n");

  const postStub = stub(
    agent,
    "post",
    () => Promise.resolve({ uri: "uri", cid: "cid" }),
  );

  try {
    await mdLinkPost(text);

    const expected = [
      "link test",
      "",
      "プロフィール",
      "",
      "https://atproto.com/guides/lexicon",
    ].join("\n");

    // assert post arguments
    assertSpyCallArgs(postStub, 0, [{
      $type: "app.bsky.feed.post",
      text: expected,
      facets: [
        {
          features: [
            {
              "$type": "app.bsky.richtext.facet#link",
              uri: "https://atproto.com/guides/lexicon",
            },
          ],
          index: { byteEnd: 65, byteStart: 31 },
        },
        {
          features: [
            {
              "$type": "app.bsky.richtext.facet#link",
              uri: "https://bsky.app/profile/zgz.bsky.social",
            },
          ],
          index: { byteEnd: 29, byteStart: 11 },
        },
      ],
      reply: undefined,
    }]);

    // assert post called once
    assertSpyCalls(postStub, 1);
  } finally {
    // restore stubs
    postStub.restore();
  }
});
