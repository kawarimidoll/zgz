import { chainFeed } from "../chain_feed.ts";

// ref: https://deno.land/x/sleep
function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

// show chained feed every 5 seconds
while (true) {
  console.log(await chainFeed());
  console.log("---");
  await sleep(5);
}
