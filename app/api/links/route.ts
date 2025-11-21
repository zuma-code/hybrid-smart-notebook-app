import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { extractWikiLinks } from "@/lib/wiki-links";
import { slugify } from "@/lib/utils";

const createLinksSchema = z.object({
  fromNoteType: z.enum(["DailyNote", "Concept"]),
  fromNoteId: z.string(),
  content: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createLinksSchema.parse(body);

    // Extraer enlaces wiki del contenido
    const wikiLinks = extractWikiLinks(data.content);

    // Buscar conceptos que coincidan con los slugs
    const conceptSlugs = wikiLinks.map((link) => slugify(link));
    const concepts = await prisma.concept.findMany({
      where: {
        slug: {
          in: conceptSlugs,
        },
      },
    });

    // Eliminar enlaces existentes de esta nota
    await prisma.noteLink.deleteMany({
      where: {
        fromNoteType: data.fromNoteType,
        fromNoteId: data.fromNoteId,
      },
    });

    // Crear nuevos enlaces
    const links = await Promise.all(
      concepts.map((concept) =>
        prisma.noteLink.create({
          data: {
            fromNoteType: data.fromNoteType,
            fromNoteId: data.fromNoteId,
            toNoteType: "Concept",
            toNoteId: concept.id,
            linkType: "reference",
          },
        })
      )
    );

    return NextResponse.json({ links, count: links.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating links:", error);
    return NextResponse.json(
      { error: "Failed to create links" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fromNoteType = searchParams.get("fromNoteType");
    const fromNoteId = searchParams.get("fromNoteId");

    if (!fromNoteType || !fromNoteId) {
      return NextResponse.json(
        { error: "fromNoteType and fromNoteId are required" },
        { status: 400 }
      );
    }

    await prisma.noteLink.deleteMany({
      where: {
        fromNoteType: fromNoteType as "DailyNote" | "Concept",
        fromNoteId,
      },
    });

    return NextResponse.json({ message: "Links deleted successfully" });
  } catch (error) {
    console.error("Error deleting links:", error);
    return NextResponse.json(
      { error: "Failed to delete links" },
      { status: 500 }
    );
  }
}

