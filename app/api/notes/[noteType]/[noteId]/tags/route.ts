import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const noteTypes = ["DailyNote", "Concept", "Prompt"] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ noteType: string; noteId: string }> }
) {
  try {
    const { noteType, noteId } = await params;

    if (!noteTypes.includes(noteType as any)) {
      return NextResponse.json(
        { error: "Invalid note type" },
        { status: 400 }
      );
    }

    const noteTags = await prisma.noteTag.findMany({
      where: {
        noteType,
        noteId,
      },
      include: {
        tag: true,
      },
    });

    const tags = noteTags.map((nt) => nt.tag);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching note tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch note tags" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ noteType: string; noteId: string }> }
) {
  try {
    const { noteType, noteId } = await params;
    const body = await request.json();
    const { tagId } = z.object({ tagId: z.string() }).parse(body);

    if (!noteTypes.includes(noteType as any)) {
      return NextResponse.json(
        { error: "Invalid note type" },
        { status: 400 }
      );
    }

    // Verificar si la relación ya existe
    const existing = await prisma.noteTag.findUnique({
      where: {
        noteType_noteId_tagId: {
          noteType,
          noteId,
          tagId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Tag already added" });
    }

    const noteTag = await prisma.noteTag.create({
      data: {
        noteType,
        noteId,
        tagId,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(noteTag.tag, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error adding tag to note:", error);
    return NextResponse.json(
      { error: "Failed to add tag to note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ noteType: string; noteId: string }> }
) {
  try {
    const { noteType, noteId } = await params;
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");

    if (!tagId) {
      return NextResponse.json(
        { error: "tagId is required" },
        { status: 400 }
      );
    }

    if (!noteTypes.includes(noteType as any)) {
      return NextResponse.json(
        { error: "Invalid note type" },
        { status: 400 }
      );
    }

    await prisma.noteTag.delete({
      where: {
        noteType_noteId_tagId: {
          noteType,
          noteId,
          tagId,
        },
      },
    });

    return NextResponse.json({ message: "Tag removed successfully" });
  } catch (error) {
    console.error("Error removing tag from note:", error);
    return NextResponse.json(
      { error: "Failed to remove tag from note" },
      { status: 500 }
    );
  }
}






