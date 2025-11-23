import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createLinkSchema = z.object({
  fromNoteType: z.enum(["DailyNote", "Concept"]),
  fromNoteId: z.string(),
  toNoteType: z.enum(["DailyNote", "Concept"]),
  toNoteId: z.string(),
  linkType: z.string().default("reference"),
});

/**
 * POST /api/links
 * Create or update a link between notes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createLinkSchema.parse(body);

    // Check if link already exists
    const existing = await prisma.noteLink.findUnique({
      where: {
        fromNoteType_fromNoteId_toNoteType_toNoteId: {
          fromNoteType: data.fromNoteType,
          fromNoteId: data.fromNoteId,
          toNoteType: data.toNoteType,
          toNoteId: data.toNoteId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const link = await prisma.noteLink.create({
      data,
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/links
 * Remove a link between notes
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromNoteType = searchParams.get("fromNoteType");
    const fromNoteId = searchParams.get("fromNoteId");
    const toNoteType = searchParams.get("toNoteType");
    const toNoteId = searchParams.get("toNoteId");

    if (!fromNoteType || !fromNoteId || !toNoteType || !toNoteId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    await prisma.noteLink.delete({
      where: {
        fromNoteType_fromNoteId_toNoteType_toNoteId: {
          fromNoteType: fromNoteType as "DailyNote" | "Concept",
          fromNoteId,
          toNoteType: toNoteType as "DailyNote" | "Concept",
          toNoteId,
        },
      },
    });

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    );
  }
}




