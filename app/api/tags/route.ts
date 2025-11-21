import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    // SQLite doesn't support case-insensitive mode, so we'll filter in memory
    const where = search
      ? {
          name: {
            contains: search,
          },
        }
      : {};

    let tags = await prisma.tag.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    // Filter case-insensitively for SQLite (since it doesn't support mode: "insensitive")
    if (search) {
      const searchLower = search.toLowerCase();
      tags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchLower)
      );
      tags = tags.slice(0, 10); // Limit to 10 results
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

    // Check if tag already exists
    const existing = await prisma.tag.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        color: data.color || "#3b82f6", // Default blue
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

    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}

