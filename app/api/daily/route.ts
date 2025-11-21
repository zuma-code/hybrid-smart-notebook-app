import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createDailyNoteSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  content: z.string().default(""),
});

export async function GET() {
  try {
    const notes = await prisma.dailyNote.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching daily notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createDailyNoteSchema.parse(body);

    // Check if note already exists for this date
    const existing = await prisma.dailyNote.findUnique({
      where: { date: data.date },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Daily note already exists for this date" },
        { status: 409 }
      );
    }

    const note = await prisma.dailyNote.create({
      data,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating daily note:", error);
    return NextResponse.json(
      { error: "Failed to create daily note" },
      { status: 500 }
    );
  }
}

