const runCommand = async (...args: string[]) => {
  return await (new Deno.Command("git", { args })).output();
};

export const pull = async () => {
  const { code } = await runCommand("pull");

  if (code === 0) {
    return "Pulled successfully 😉";
  } else {
    return "Failed to pull 😢";
  }
};
