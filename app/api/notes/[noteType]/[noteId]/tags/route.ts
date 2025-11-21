import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ noteType: string; noteId: string }> }
) {
  try {
    const { noteType, noteId } = await params;

    if (!["DailyNote", "Concept", "Prompt"].includes(noteType)) {
      return NextResponse.json(
        { error: "Invalid note type" },
        { status: 400 }
      );
    }

    const noteTags = await prisma.noteTag.findMany({
      where: {
        noteType: noteType as "DailyNote" | "Concept" | "Prompt",
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

