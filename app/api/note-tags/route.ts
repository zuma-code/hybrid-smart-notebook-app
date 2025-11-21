import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createNoteTagSchema = z.object({
  noteType: z.enum(["DailyNote", "Concept", "Prompt"]),
  noteId: z.string(),
  tagId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createNoteTagSchema.parse(body);

    // Check if relation already exists
    const existing = await prisma.noteTag.findUnique({
      where: {
        noteType_noteId_tagId: {
          noteType: data.noteType,
          noteId: data.noteId,
          tagId: data.tagId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const noteTag = await prisma.noteTag.create({
      data,
      include: {
        tag: true,
      },
    });

    return NextResponse.json(noteTag, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating note tag:", error);
    return NextResponse.json(
      { error: "Failed to create note tag" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const noteType = searchParams.get("noteType");
    const noteId = searchParams.get("noteId");
    const tagId = searchParams.get("tagId");

    if (!noteType || !noteId || !tagId) {
      return NextResponse.json(
        { error: "noteType, noteId, and tagId are required" },
        { status: 400 }
      );
    }

    await prisma.noteTag.delete({
      where: {
        noteType_noteId_tagId: {
          noteType: noteType as "DailyNote" | "Concept" | "Prompt",
          noteId,
          tagId,
        },
      },
    });

    return NextResponse.json({ message: "Note tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting note tag:", error);
    return NextResponse.json(
      { error: "Failed to delete note tag" },
      { status: 500 }
    );
  }
}

