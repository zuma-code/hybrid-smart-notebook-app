import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let tags;
    if (search) {
      // Búsqueda case-insensitive (SQLite no soporta insensitive, filtramos en memoria)
      const allTags = await prisma.tag.findMany();
      tags = allTags.filter((tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      tags = await prisma.tag.findMany({
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createTagSchema.parse(body);

    // Verificar si el tag ya existe
    const existingTag = await prisma.tag.findUnique({
      where: { name: data.name },
    });

    if (existingTag) {
      return NextResponse.json(existingTag);
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        color: data.color || "#3b82f6",
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 409 }
      );
    }

    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}






