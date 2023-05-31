// ref: https://qiita.com/H40831/items/5b44ef00cebf532087db

export const katakanaToHiragana = (src: string) =>
  src.replace(
    /[\u30a1-\u30f6]/g,
    (match) => String.fromCharCode(match.charCodeAt(0) - 0x60),
  );

export const hiraganaToKatakana = (src: string) =>
  src.replace(
    /[\u3041-\u3096]/g,
    (match) => String.fromCharCode(match.charCodeAt(0) + 0x60),
  );

const escapeRegexp = (str: string) =>
  str.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");

export const hirakataRegexp = (searchWord: string) => {
  const hiragana = escapeRegexp(searchWord);
  const katakana = hiraganaToKatakana(hiragana);
  if (hiragana === katakana) {
    return new RegExp(hiragana, "i");
  }
  return new RegExp(`(${hiragana}|${katakana})`, "i");
};

export const hirakataRegexpEachChar = (searchWord: string) => {
  const hiragana = katakanaToHiragana(escapeRegexp(searchWord));

  const chars = hiragana.split("").map((char) => {
    const katakana = hiraganaToKatakana(char);
    return (char === katakana) ? char : `(${char}|${katakana})`;
  });

  return new RegExp(`(${chars.join("")})`, "i");
};
