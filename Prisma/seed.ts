import { PrismaClient } from "@prisma/client";
import { initPreset } from "./../src/lib/presets/init";

const prisma = new PrismaClient();
async function main() {
  const init = await prisma.preset.upsert({
    where: { id: "init" },
    update: {},
    create: {
      email: "donotdelete@polysynth.com",
      author: "Andrew Kusakin",
      presetData: initPreset,
      presetName: "init",
      discription: "Initial preset",
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
