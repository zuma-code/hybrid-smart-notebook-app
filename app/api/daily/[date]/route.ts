import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateDailyNoteSchema = z.object({
  content: z.string(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;

    const note = await prisma.dailyNote.findUnique({
      where: { date },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Daily note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error fetching daily note:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;
    const body = await request.json();
    const data = updateDailyNoteSchema.parse(body);

    const note = await prisma.dailyNote.update({
      where: { date },
      data,
    });

    return NextResponse.json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
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
        { error: "Daily note not found" },
        { status: 404 }
      );
    }

    console.error("Error updating daily note:", error);
    return NextResponse.json(
      { error: "Failed to update daily note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;

    await prisma.dailyNote.delete({
      where: { date },
    });

    return NextResponse.json({ message: "Daily note deleted successfully" });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Daily note not found" },
        { status: 404 }
      );
    }

    console.error("Error deleting daily note:", error);
    return NextResponse.json(
      { error: "Failed to delete daily note" },
      { status: 500 }
    );
  }
}

