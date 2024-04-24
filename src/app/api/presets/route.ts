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
      return new NextResponse(JSON.stringify({ preset: newPreset }), {
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

  export async function DELETE(request) {
    try {
      const data = await request.json();
      const preset = await prisma.preset.findUnique({
        where: {
          id: data.id,
        },
        select: {
          email: true 
        }
      });
  
      if (!preset) {
        return new NextResponse(JSON.stringify({ error: "Preset not found." }), {
          headers: { 'Content-Type': 'application/json' },
          status: 404,
        });
      }
  
      if (preset.email !== data.email) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized to delete this preset." }), {
          headers: { 'Content-Type': 'application/json' },
          status: 403,
        });
      }
  
      const deletedPreset = await prisma.preset.delete({
        where: {
          id: data.id,
        },
      });
  
      return new NextResponse(JSON.stringify({ message: "Successfully deleted preset." }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }
  