import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractWikiLinks, wikiLinkToSlug } from "@/lib/wiki-links";

/**
 * POST /api/notes/[noteType]/[noteId]/links
 * Sync wiki-links from note content
 * This endpoint extracts wiki-links from content and creates/removes NoteLink entries
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ noteType: string; noteId: string }> }
) {
  try {
    const { noteType, noteId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Extract wiki-links from content
    const wikiLinks = extractWikiLinks(content);

    // Get all existing links from this note
    const existingLinks = await prisma.noteLink.findMany({
      where: {
        fromNoteType: noteType as "DailyNote" | "Concept",
        fromNoteId: noteId,
      },
    });

    // Find concepts that match the wiki-link slugs
    const conceptSlugs = wikiLinks.map((link) => wikiLinkToSlug(link));
    const concepts = await prisma.concept.findMany({
      where: {
        slug: {
          in: conceptSlugs,
        },
      },
    });

    // Create a map of slug -> concept
    const conceptMap = new Map(concepts.map((c) => [c.slug, c]));

    // Create links for found concepts
    const linksToCreate: Array<{
      fromNoteType: string;
      fromNoteId: string;
      toNoteType: string;
      toNoteId: string;
    }> = [];

    for (const slug of conceptSlugs) {
      const concept = conceptMap.get(slug);
      if (concept) {
        linksToCreate.push({
          fromNoteType: noteType,
          fromNoteId: noteId,
          toNoteType: "Concept",
          toNoteId: concept.id,
        });
      }
    }

    // Determine which links to create and which to delete
    const linksToDelete = existingLinks.filter(
      (link) =>
        !linksToCreate.some(
          (newLink) =>
            newLink.toNoteType === link.toNoteType &&
            newLink.toNoteId === link.toNoteId
        )
    );

    // Delete removed links
    for (const link of linksToDelete) {
      await prisma.noteLink.delete({
        where: {
          fromNoteType_fromNoteId_toNoteType_toNoteId: {
            fromNoteType: link.fromNoteType as "DailyNote" | "Concept",
            fromNoteId: link.fromNoteId,
            toNoteType: link.toNoteType as "DailyNote" | "Concept",
            toNoteId: link.toNoteId,
          },
        },
      });
    }

    // Create new links
    const createdLinks = [];
    for (const linkData of linksToCreate) {
      // Check if link already exists
      const existing = await prisma.noteLink.findUnique({
        where: {
          fromNoteType_fromNoteId_toNoteType_toNoteId: {
            fromNoteType: linkData.fromNoteType as "DailyNote" | "Concept",
            fromNoteId: linkData.fromNoteId,
            toNoteType: linkData.toNoteType as "DailyNote" | "Concept",
            toNoteId: linkData.toNoteId,
          },
        },
      });

      if (!existing) {
        const link = await prisma.noteLink.create({
          data: linkData,
        });
        createdLinks.push(link);
      }
    }

    return NextResponse.json({
      created: createdLinks.length,
      deleted: linksToDelete.length,
      links: createdLinks,
    });
  } catch (error) {
    console.error("Error syncing wiki-links:", error);
    return NextResponse.json(
      { error: "Failed to sync wiki-links" },
      { status: 500 }
    );
  }
}

