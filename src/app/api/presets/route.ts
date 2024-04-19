import prisma from "@/lib/prisma";

export async function GET() {
  const presets = await prisma.preset.findMany({
    select: {
      presetName: true,
      discription: true,
      author: true,
      presetData: true,
    },
  });
  return Response.json(presets);
}
