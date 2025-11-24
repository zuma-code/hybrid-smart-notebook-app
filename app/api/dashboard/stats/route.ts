import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTodayDateString } from "@/lib/utils";

export async function GET() {
  try {
    // Get counts
    const [dailyNotesCount, conceptsCount, promptsCount, imagesCount] =
      await Promise.all([
        prisma.dailyNote.count(),
        prisma.concept.count(),
        prisma.prompt.count(),
        prisma.image.count(),
      ]);

    // Get today's note
    const today = getTodayDateString();
    const todayNote = await prisma.dailyNote.findFirst({
      where: {
        date: today,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get recent activity (last 10 items)
    const recentDailyNotes = await prisma.dailyNote.findMany({
      take: 5,
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        date: true,
        title: true,
        updatedAt: true,
      },
    });

    const recentConcepts = await prisma.concept.findMany({
      take: 5,
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        updatedAt: true,
      },
    });

    const recentPrompts = await prisma.prompt.findMany({
      take: 5,
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        category: true,
        isFavorite: true,
        updatedAt: true,
      },
    });

    // Combine and sort recent activity
    const recentActivity = [
      ...recentDailyNotes.map((note) => ({
        type: "DailyNote" as const,
        id: note.id,
        title: note.title || `Nota del ${note.date}`,
        date: note.updatedAt,
        url: `/daily/${note.id}`,
      })),
      ...recentConcepts.map((concept) => ({
        type: "Concept" as const,
        id: concept.id,
        title: concept.title,
        date: concept.updatedAt,
        url: `/concepts/${concept.slug}`,
      })),
      ...recentPrompts.map((prompt) => ({
        type: "Prompt" as const,
        id: prompt.id,
        title: prompt.title,
        date: prompt.updatedAt,
        url: `/prompts/${prompt.id}`,
        category: prompt.category,
        isFavorite: prompt.isFavorite,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return NextResponse.json({
      stats: {
        dailyNotes: dailyNotesCount,
        concepts: conceptsCount,
        prompts: promptsCount,
        images: imagesCount,
      },
      todayNote: todayNote
        ? {
            id: todayNote.id,
            date: todayNote.date,
            title: todayNote.title,
            content: todayNote.content.substring(0, 200), // Preview
          }
        : null,
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}





