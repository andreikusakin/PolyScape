import prisma from "@/lib/prisma";
import { initPreset } from "./../src/lib/presets/init";

async function main() {
  const init = await prisma.preset.upsert({
    where: { id: "init" },
    update: {},
    create: {
      email: "donotdelete@polysynth.com",
      author: "Andrew Kusakin",
      settings: initPreset,
      name: "init",
      type: "misc",
      description: "Initial preset",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
