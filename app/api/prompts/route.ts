import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createPromptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(["general", "debugging", "refactoring", "learning", "documentation", "testing"]).default("general"),
  isFavorite: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const isFavorite = searchParams.get("favorite");

    const where: any = {};

    // SQLite doesn't support case-insensitive mode
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isFavorite === "true") {
      where.isFavorite = true;
    }

    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: [
        { isFavorite: "desc" },
        { updatedAt: "desc" },
      ],
    });

    // Get tags for all prompts
    const promptsWithTags = await Promise.all(
      prompts.map(async (prompt) => {
        const noteTags = await prisma.noteTag.findMany({
          where: {
            noteType: "Prompt",
            noteId: prompt.id,
          },
          include: {
            tag: true,
          },
        });
        return {
          ...prompt,
          tags: noteTags,
        };
      })
    );

    return NextResponse.json(promptsWithTags);
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

    return NextResponse.json(
      {
        ...prompt,
        tags: [],
      },
      { status: 201 }
    );
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

