import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updatePromptSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().optional(),
  category: z.enum(["general", "debugging", "refactoring", "learning", "documentation"]).optional(),
  isFavorite: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const prompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }

    // Get tags for this prompt
    const noteTags = await prisma.noteTag.findMany({
      where: {
        noteType: "Prompt",
        noteId: prompt.id,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json({
      ...prompt,
      tags: noteTags.map((nt) => nt.tag),
    });
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updatePromptSchema.parse(body);

    const prompt = await prisma.prompt.update({
      where: { id },
      data,
    });

    return NextResponse.json(prompt);
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
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }

    console.error("Error updating prompt:", error);
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.prompt.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Prompt deleted successfully" });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }

    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 }
    );
  }
}




