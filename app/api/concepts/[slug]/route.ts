import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const updateConceptSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const concept = await prisma.concept.findUnique({
      where: { slug },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!concept) {
      return NextResponse.json(
        { error: "Concept not found" },
        { status: 404 }
      );
    }

    // Get backlinks (notes that link to this concept)
    const backlinks = await prisma.noteLink.findMany({
      where: {
        toNoteType: "Concept",
        toNoteId: concept.id,
      },
    });

    return NextResponse.json({
      ...concept,
      backlinks,
    });
  } catch (error) {
    console.error("Error fetching concept:", error);
    return NextResponse.json(
      { error: "Failed to fetch concept" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const data = updateConceptSchema.parse(body);

    const updateData: { title?: string; slug?: string; content?: string } = {};

    if (data.title) {
      updateData.title = data.title;
      updateData.slug = slugify(data.title);
    }

    if (data.content !== undefined) {
      updateData.content = data.content;
    }

    const concept = await prisma.concept.update({
      where: { slug },
      data: updateData,
    });

    return NextResponse.json(concept);
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
        { error: "Concept not found" },
        { status: 404 }
      );
    }

    console.error("Error updating concept:", error);
    return NextResponse.json(
      { error: "Failed to update concept" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await prisma.concept.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Concept deleted successfully" });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Concept not found" },
        { status: 404 }
      );
    }

    console.error("Error deleting concept:", error);
    return NextResponse.json(
      { error: "Failed to delete concept" },
      { status: 500 }
    );
  }
}

