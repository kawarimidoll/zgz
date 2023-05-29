import { Log } from "./deps.ts";
import { login } from "./login.ts";
import { textPost } from "./post.ts";
import { chainFeed } from "./chain_feed.ts";
import { notifyIfttt } from "./notify_ifttt.ts";

let loopCount = 0;
const maxLoopCount = 50;

const log = new Log({ levelIndicator: "initial", color: false });

// try max 50 times
while (loopCount < maxLoopCount) {
  const text = await chainFeed();

  // post if the text has proper length
  if (text.length > 0 && text.length < 300) {
    try {
      const agent = await login();
      log.info(`post start`);
      log.info(`text: ${text}`);
      const { uri, cid } = await textPost(agent, text);
      log.info(`uri : ${uri}`);
      log.info(`cid : ${cid}`);
      log.info(`post success`);
      Deno.exit(0);
    } catch (e) {
      log.error(`post failed`);
      log.error(e);
      notifyIfttt({ title: "zgz post failed", content: e.message });

      Deno.exit(1);
    }
  }

  loopCount++;
}

log.warn("max loop count reached");
notifyIfttt({ title: "zgz post failed", content: "max loop count reached" });
Deno.exit(1);
