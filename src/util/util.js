export const findValidSprites = (sprites) => {
  const exlusionList = [
    "official-artwork",
    "icons",
    "gold",
    "silver",
    "ruby-sapphire",
    "firered-leafgreen",
    "diamond-pearl",
    "heartgold-soulsilver",
    "omegaruby-alphasapphire",
    "generation-i",
    "generation-ii",
    "generation-v",
    "generation-vii",
  ];
  const validSprites = [];

  for (const key in sprites) {
    if (
      typeof sprites[key] === "string" &&
      key === "front_default" &&
      !sprites[key].endsWith(".gif")
    ) {
      validSprites.push(sprites[key]);
    } else if (
      typeof sprites[key] === "object" &&
      !exlusionList.includes(key)
    ) {
      const nestedSprites = findValidSprites(sprites[key]);
      validSprites.push(...nestedSprites);
    }
  }

  return validSprites;
};
