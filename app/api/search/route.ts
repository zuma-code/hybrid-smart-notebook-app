import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SearchableItem } from "@/lib/search";

export async function GET(request: NextRequest) {
  try {
    // Siempre devolver todos los items - la búsqueda se hace en el cliente
    // Fetch all searchable items
    const [dailyNotes, concepts, prompts, images] = await Promise.all([
      prisma.dailyNote.findMany({
        select: {
          id: true,
          date: true,
          title: true,
          content: true,
          updatedAt: true,
        },
      }),
      prisma.concept.findMany({
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          updatedAt: true,
        },
      }),
      prisma.prompt.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          updatedAt: true,
        },
      }),
      prisma.image.findMany({
        select: {
          id: true,
          filename: true,
          alt: true,
          path: true,
          createdAt: true,
        },
      }),
    ]);

    // Get tags for notes
    const noteTags = await prisma.noteTag.findMany({
      include: {
        tag: true,
      },
    });

    const tagsByNote = noteTags.reduce((acc, nt) => {
      const key = `${nt.noteType}-${nt.noteId}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(nt.tag.name);
      return acc;
    }, {} as Record<string, string[]>);

    // Transform to SearchableItem format
    const items: SearchableItem[] = [
      ...dailyNotes.map((note) => ({
        id: note.id,
        type: "DailyNote" as const,
        title: note.title || `Nota del ${note.date}`,
        content: note.content.replace(/<[^>]*>/g, ""), // Strip HTML
        url: `/daily/${note.id}`,
        date: note.updatedAt.toISOString(),
        tags: tagsByNote[`DailyNote-${note.id}`] || [],
      })),
      ...concepts.map((concept) => ({
        id: concept.id,
        type: "Concept" as const,
        title: concept.title,
        content: concept.content.replace(/<[^>]*>/g, ""), // Strip HTML
        url: `/concepts/${concept.slug}`,
        date: concept.updatedAt.toISOString(),
        tags: tagsByNote[`Concept-${concept.id}`] || [],
      })),
      ...prompts.map((prompt) => ({
        id: prompt.id,
        type: "Prompt" as const,
        title: prompt.title,
        content: prompt.content,
        url: `/prompts/${prompt.id}`,
        date: prompt.updatedAt.toISOString(),
        category: prompt.category,
        tags: [],
      })),
      ...images.map((image) => ({
        id: image.id,
        type: "Image" as const,
        title: image.filename,
        content: image.alt,
        url: `/gallery`,
        date: image.createdAt.toISOString(),
        tags: [],
      })),
    ];

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching search items:", error);
    return NextResponse.json(
      { error: "Failed to fetch search items" },
      { status: 500 }
    );
  }
}

