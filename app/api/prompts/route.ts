import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createPromptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(["general", "debugging", "refactoring", "learning", "documentation"]).default("general"),
  isFavorite: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const isFavorite = searchParams.get("favorite") === "true";
    const limit = parseInt(searchParams.get("limit") || "100");

    let where: any = {};

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by favorite
    if (isFavorite) {
      where.isFavorite = true;
    }

    let prompts = await prisma.prompt.findMany({
      where,
      take: limit,
      orderBy: [
        { isFavorite: "desc" },
        { updatedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Filter by search term (case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      prompts = prompts.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchLower) ||
          prompt.content.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createPromptSchema.parse(body);

    const prompt = await prisma.prompt.create({
      data,
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating prompt:", error);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}




