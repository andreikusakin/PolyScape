import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const presets = await prisma.preset.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      author: true,
      settings: true,
      default: true,
    },
    orderBy: {
      default: 'desc' 
    }
  });
  return new NextResponse(JSON.stringify(presets), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

export async function POST(request) {
    try {
      const data = await request.json();
      const newPreset = await prisma.preset.create({
        data: {
          name: data.name,
          type: data.type,
          email: data.email,
          description: data.description,
          author: data.author,
          settings: data.settings,
        },
      });
      return new NextResponse(JSON.stringify({ message: "Successfully saved preset!"}), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }
