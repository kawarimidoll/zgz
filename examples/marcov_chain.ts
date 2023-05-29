import { markovChainGenerate } from "../markov_chain.ts";

const srcText = `
私の名前は中野です。
実はフランスに住んでいます。
明日は雨が降るでしょう。
赤い車が好きです
大きな木があります。
パソコンを使いました
姉は猫を飼っていますが、私は犬を飼っています。
私はりんごを食べます。日課です。
彼は神を崇めます。
私は彼女を愛しています。
本当に嬉しいです。
それな
`;

// loop 10 times
for (let i = 0; i < 10; i++) {
  console.log(markovChainGenerate(srcText));
}
